/* Galaxy Real Estate — interactions */
(function(){
  "use strict";
  var $ = function(s, c){ return (c||document).querySelector(s); };
  var $$ = function(s, c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };

  /* Year */
  var yearEl = $("#year"); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Header shadow + back-to-top */
  var header = $("#header"), toTop = $("#toTop");
  function onScroll(){
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
  if (toTop) toTop.addEventListener("click", function(){ window.scrollTo({top:0, behavior:"smooth"}); });

  /* Mobile menu */
  var burger = $("#burger"), menu = $("#mobileMenu"), overlay = $("#menuOverlay"), closeBtn = $("#mobileClose");
  var lastFocus = null;
  function setMenu(open){
    if (!menu) return;
    if (open){ lastFocus = document.activeElement; }
    menu.classList.toggle("open", open);
    if (overlay) overlay.classList.toggle("show", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    if (open){
      var first = $(".mobile-nav a", menu);
      if (first) setTimeout(function(){ first.focus(); }, 120);
    } else if (lastFocus && lastFocus.focus){
      lastFocus.focus();
    }
  }
  if (burger) burger.addEventListener("click", function(){ setMenu(true); });
  if (closeBtn) closeBtn.addEventListener("click", function(){ setMenu(false); });
  if (overlay) overlay.addEventListener("click", function(){ setMenu(false); });
  $$(".mobile-nav a, .mobile-menu-cta a").forEach(function(a){
    a.addEventListener("click", function(){ setMenu(false); });
  });
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") setMenu(false); });

  /* Property filtering */
  var cards = $$(".property-card");
  var tabs = $$(".filter-tab");
  var noResults = $("#noResults");
  var activeType = "all", searchArea = "", searchMax = 0;

  function applyFilter(){
    var shown = 0;
    cards.forEach(function(card){
      var type = card.dataset.type;
      var typeOk = (activeType === "all" || type === activeType);
      var areaOk = !searchArea || (card.dataset.area || "").toLowerCase().indexOf(searchArea.toLowerCase()) !== -1;
      var price = parseFloat(card.dataset.price || "0");
      var priceOk = true;
      if (searchMax && type === "sale" && (activeType === "sale" || activeType === "all")) priceOk = price <= searchMax;
      var show = typeOk && areaOk && priceOk;
      card.hidden = !show;
      if (show) shown++;
    });
    if (noResults) noResults.hidden = shown !== 0;
  }
  function setFilter(type){
    activeType = type;
    tabs.forEach(function(t){
      var on = t.dataset.filter === type;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    applyFilter();
  }
  tabs.forEach(function(t){ t.addEventListener("click", function(){ setFilter(t.dataset.filter); }); });
  $$("[data-goto-filter]").forEach(function(el){
    el.addEventListener("click", function(e){
      e.preventDefault();
      setFilter(el.dataset.gotoFilter);
      var target = $("#properties"); if (target) target.scrollIntoView({behavior:"smooth"});
    });
  });

  /* Hero search — price options adapt to Buy / Rent / Commercial */
  var priceSets = {
    sale: [["", "No max"], ["300000", "£300,000"], ["500000", "£500,000"], ["700000", "£700,000"], ["1000000", "£1,000,000"]],
    let: [["", "No max"], ["1500", "£1,500 PCM"], ["2200", "£2,200 PCM"], ["3000", "£3,000 PCM"], ["3500", "£3,500 PCM"]],
    commercial: [["", "No max"], ["65000", "£65,000"], ["250000", "£250,000"], ["600000", "£600,000"], ["1100000", "£1,100,000"]]
  };
  var searchTabs = $$(".search-tab");
  var priceSel = $("#searchPrice");
  var searchType = "sale";
  function fillPrices(type){
    if (!priceSel) return;
    priceSel.innerHTML = "";
    priceSets[type].forEach(function(o){
      var opt = document.createElement("option");
      opt.value = o[0]; opt.textContent = o[1];
      priceSel.appendChild(opt);
    });
    searchMax = 0;
  }
  function setSearchTab(t){
    searchTabs.forEach(function(x){ x.classList.remove("is-active"); x.setAttribute("aria-selected","false"); });
    t.classList.add("is-active"); t.setAttribute("aria-selected","true");
    searchType = t.dataset.type;
    fillPrices(searchType);
    var label = priceSel ? priceSel.closest(".field").querySelector("span") : null;
    if (label) label.textContent = searchType === "let" ? "Max rent" : "Max price";
  }
  searchTabs.forEach(function(t){ t.addEventListener("click", function(){ setSearchTab(t); }); });
  $$(".hint-link").forEach(function(h){
    h.addEventListener("click", function(){
      var input = $("#searchArea"); if (input) input.value = h.dataset.area;
    });
  });
  var searchForm = $("#searchForm");
  if (searchForm) searchForm.addEventListener("submit", function(e){
    e.preventDefault();
    searchArea = ($("#searchArea") ? $("#searchArea").value.trim() : "");
    searchMax = (priceSel ? parseInt(priceSel.value, 10) || 0 : 0);
    setFilter(searchType);
    var target = $("#properties"); if (target) target.scrollIntoView({behavior:"smooth"});
  });
  fillPrices("sale");

  /* Reviews slider */
  var track = $("#reviewTrack");
  if (track){
    var slides = $$(".review-card", track);
    var dotsWrap = $("#sliderDots");
    var index = 0;
    function perView(){ return window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 640 ? 2 : 1); }
    function maxIndex(){ return Math.max(0, slides.length - perView()); }
    function renderDots(){
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      for (var i = 0; i <= maxIndex(); i++){
        (function(i){
          var b = document.createElement("button");
          b.setAttribute("aria-label", "Go to review " + (i+1));
          if (i === index) b.classList.add("is-active");
          b.addEventListener("click", function(){ go(i); });
          dotsWrap.appendChild(b);
        })(i);
      }
    }
    function go(i){
      index = Math.max(0, Math.min(i, maxIndex()));
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0") || 0;
      var w = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = "translateX(" + (-index * w) + "px)";
      renderDots();
    }
    var prev = $("#prevReview"), next = $("#nextReview");
    if (prev) prev.addEventListener("click", function(){ go(index - 1 < 0 ? maxIndex() : index - 1); });
    if (next) next.addEventListener("click", function(){ go(index + 1 > maxIndex() ? 0 : index + 1); });
    window.addEventListener("resize", function(){ go(index); });
    // Touch swipe
    var startX = 0;
    track.addEventListener("touchstart", function(e){ startX = e.touches[0].clientX; }, {passive:true});
    track.addEventListener("touchend", function(e){
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1);
    }, {passive:true});
    go(0);
    // Auto-advance (paused on hover/focus)
    var auto = setInterval(function(){ if (!document.hidden) go(index + 1 > maxIndex() ? 0 : index + 1); }, 6000);
    track.addEventListener("mouseenter", function(){ clearInterval(auto); });
  }

  /* FAQ accordion */
  $$(".faq-item").forEach(function(item){
    var btn = $(".faq-q", item), panel = $(".faq-a", item);
    if (!btn || !panel) return;
    btn.addEventListener("click", function(){
      var open = item.classList.contains("open");
      $$(".faq-item.open").forEach(function(o){
        o.classList.remove("open");
        $(".faq-a", o).style.maxHeight = "0px";
        $(".faq-q", o).setAttribute("aria-expanded","false");
      });
      if (!open){
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        btn.setAttribute("aria-expanded","true");
      }
    });
  });

  /* Valuation form — mailto handoff (no backend on static demo) */
  var form = $("#valuationForm");
  if (form) form.addEventListener("submit", function(e){
    e.preventDefault();
    var el = function(n){ var f = form.elements[n]; return f ? (f.value || "").trim() : ""; };
    var name = el("name"), phone = el("phone"), pc = el("postcode"), intent = el("intent") || "Sell my home";
    var err = $("#formError");
    if (!name || !phone || !pc){
      if (err) err.hidden = false;
      return;
    }
    if (err) err.hidden = true;
    var subject = encodeURIComponent("Free valuation request — " + pc);
    var body = encodeURIComponent("Name: " + name + "\nPhone: " + phone + "\nPostcode: " + pc + "\nI'm interested in: " + intent + "\n\nPlease call me to arrange my free valuation.");
    window.location.href = "mailto:info@galaxyrealestate.co.uk?subject=" + subject + "&body=" + body;
  });

  /* Reveal on scroll */
  if ("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add("visible"); io.unobserve(en.target); } });
    }, {threshold:.12});
    $$(".service-card,.property-card,.process-grid li,.area-grid li,.contact-card,.why-media,.why-copy").forEach(function(el){
      el.classList.add("reveal"); io.observe(el);
    });
  }
})();
