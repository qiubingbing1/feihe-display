/* ============================================================
   Feihe — main.js
   Nav / cart (localStorage) / filters / gallery / forms
   Front-end demo only — no real payment processing.
   ============================================================ */
(function () {
  "use strict";

  var CART_KEY = "feihe_cart_v1";

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Cart (localStorage) ---------- */
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartCount();
  }
  function updateCartCount() {
    var count = getCart().reduce(function (n, it) { return n + it.qty; }, 0);
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = count;
    });
  }
  function money(n) {
    return "$" + n.toFixed(2);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-add-to-cart]");
    if (!btn) return;
    var item = {
      id: btn.getAttribute("data-id"),
      name: btn.getAttribute("data-name"),
      price: parseFloat(btn.getAttribute("data-price")) || 0,
      img: btn.getAttribute("data-img") || "",
      qty: parseInt(btn.getAttribute("data-qty"), 10) || 1
    };
    var cart = getCart();
    var found = cart.find(function (it) { return it.id === item.id; });
    if (found) { found.qty += item.qty; } else { cart.push(item); }
    saveCart(cart);
    showAddedFeedback(btn);
  });

  function showAddedFeedback(btn) {
    var original = btn.textContent;
    btn.textContent = "Added ✓";
    btn.disabled = true;
    setTimeout(function () {
      btn.textContent = original;
      btn.disabled = false;
    }, 1400);
  }

  /* ---------- Quantity selector on product pages ---------- */
  var qtyInput = document.getElementById("qtyInput");
  if (qtyInput) {
    var syncQty = function () {
      var addBtn = document.querySelector("[data-add-to-cart]");
      if (addBtn) addBtn.setAttribute("data-qty", Math.max(1, parseInt(qtyInput.value, 10) || 1));
    };
    var minus = document.getElementById("qtyMinus");
    var plus = document.getElementById("qtyPlus");
    if (minus) minus.addEventListener("click", function () { qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1); syncQty(); });
    if (plus) plus.addEventListener("click", function () { qtyInput.value = (parseInt(qtyInput.value, 10) || 1) + 1; syncQty(); });
    qtyInput.addEventListener("change", function () {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) || 1);
      syncQty();
    });
    syncQty();
  }

  /* ---------- Cart page ---------- */
  var cartItemsEl = document.getElementById("cartItems");
  if (cartItemsEl) {
    var renderCart = function () {
      var cart = getCart();
      var emptyEl = document.getElementById("cartEmpty");
      var tableWrap = document.getElementById("cartTableWrap");
      var summaryWrap = document.getElementById("cartSummaryWrap");
      if (!cart.length) {
        if (emptyEl) emptyEl.style.display = "block";
        if (tableWrap) tableWrap.style.display = "none";
        if (summaryWrap) summaryWrap.style.display = "none";
        return;
      }
      if (emptyEl) emptyEl.style.display = "none";
      if (tableWrap) tableWrap.style.display = "";
      if (summaryWrap) summaryWrap.style.display = "";
      var rows = "";
      cart.forEach(function (it) {
        rows += '<tr>' +
          '<td><div class="cart-item-cell"><img src="' + it.img + '" alt="' + it.name + '">' +
          '<div><strong>' + it.name + '</strong><span>Model ' + it.id + '</span></div></div></td>' +
          '<td class="item-price">' + money(it.price) + '</td>' +
          '<td><div class="qty-wrap">' +
          '<button type="button" data-dec="' + it.id + '" aria-label="Decrease quantity">−</button>' +
          '<input value="' + it.qty + '" readonly aria-label="Quantity">' +
          '<button type="button" data-inc="' + it.id + '" aria-label="Increase quantity">+</button>' +
          '</div></td>' +
          '<td class="item-price">' + money(it.price * it.qty) + '</td>' +
          '<td><button type="button" class="cart-remove" data-remove="' + it.id + '">Remove</button></td>' +
          '</tr>';
      });
      cartItemsEl.innerHTML = rows;
      var subtotal = cart.reduce(function (n, it) { return n + it.price * it.qty; }, 0);
      var st = document.getElementById("cartSubtotal");
      var tt = document.getElementById("cartTotal");
      if (st) st.textContent = money(subtotal);
      if (tt) tt.textContent = money(subtotal);
    };
    renderCart();
    window.feiheRenderCart = renderCart;

    cartItemsEl.addEventListener("click", function (e) {
      var inc = e.target.getAttribute("data-inc");
      var dec = e.target.getAttribute("data-dec");
      var rem = e.target.getAttribute("data-remove");
      var cart = getCart();
      if (inc) {
        var it1 = cart.find(function (it) { return it.id === inc; });
        if (it1) it1.qty += 1;
        saveCart(cart); renderCart();
      } else if (dec) {
        var it2 = cart.find(function (it) { return it.id === dec; });
        if (it2) {
          it2.qty -= 1;
          if (it2.qty <= 0) cart = cart.filter(function (it) { return it.id !== dec; });
        }
        saveCart(cart); renderCart();
      } else if (rem) {
        cart = cart.filter(function (it) { return it.id !== rem; });
        saveCart(cart); renderCart();
      }
    });
  }

  /* ---------- Checkout modal — records a demo order for the admin ---------- */
  var modal = document.getElementById("checkoutModal");
  var checkoutMethod = "stripe";
  var checkoutForm = document.getElementById("checkoutForm");
  var checkoutDone = document.getElementById("checkoutDone");
  document.querySelectorAll("[data-checkout]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (!getCart().length) { alert("Your cart is empty. Add a product first."); return; }
      checkoutMethod = btn.getAttribute("data-checkout") || "stripe";
      var titleEl = document.getElementById("modalTitle");
      var noteEl = document.getElementById("checkoutMethodNote");
      if (titleEl) titleEl.textContent = checkoutMethod === "paypal" ? "Checkout via PayPal" : "Checkout via Stripe";
      if (noteEl) {
        noteEl.textContent = checkoutMethod === "paypal"
          ? "This demo records a PayPal order for the Feihe sales desk. No payment is captured."
          : "This demo records a Stripe order for the Feihe sales desk. No payment is captured.";
      }
      if (checkoutForm) checkoutForm.hidden = false;
      if (checkoutDone) checkoutDone.hidden = true;
      if (modal) modal.classList.add("show");
    });
  });
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!checkoutForm.checkValidity()) { checkoutForm.reportValidity(); return; }
      var cart = getCart();
      if (!cart.length || !window.FeiheStore) return;
      var fd = new FormData(checkoutForm);
      var order = FeiheStore.addOrder({
        customer: fd.get("name"),
        email: fd.get("email"),
        country: fd.get("country"),
        method: checkoutMethod,
        items: cart.map(function (it) { return { id: it.id, name: it.name, price: it.price, qty: it.qty }; })
      });
      saveCart([]);
      if (window.feiheRenderCart) window.feiheRenderCart();
      checkoutForm.reset();
      checkoutForm.hidden = true;
      if (checkoutDone) checkoutDone.hidden = false;
      var doneText = document.getElementById("checkoutDoneText");
      if (doneText) doneText.textContent = "Order " + order.id + " is in. Our team can see it in the admin desk. This demo did not charge a card.";
    });
  }
  if (modal) {
    var closeEls = modal.querySelectorAll("[data-modal-close]");
    closeEls.forEach(function (el) {
      el.addEventListener("click", function () { modal.classList.remove("show"); });
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.classList.remove("show");
    });
  }

  /* ---------- Product gallery thumbnails ---------- */
  var galleryMain = document.getElementById("galleryMainImg");
  var thumbs = document.querySelectorAll(".gallery-thumbs button");
  thumbs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-full");
      if (galleryMain && src) {
        galleryMain.src = src;
        galleryMain.alt = btn.getAttribute("data-alt") || galleryMain.alt;
      }
      thumbs.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
    });
  });

  /* ---------- Catalog, news and inbox stay in sync with the admin ---------- */
  function stockView(product) {
    if (product.stock <= 0) return { text: "Out of Stock", cls: "out" };
    if (product.stock <= product.lowAt) return { text: "Low Stock", cls: "low" };
    return { text: "In Stock", cls: "" };
  }
  function formatNewsDate(value) {
    var d = new Date(String(value).length === 10 ? value + "T00:00:00" : value);
    if (isNaN(d.getTime())) return value;
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }
  function fillInquiryProducts() {
    var sel = document.getElementById("qProduct");
    if (!sel || !window.FeiheStore) return;
    var preset = new URLSearchParams(location.search).get("product") || sel.value;
    var products = FeiheStore.products().filter(function (p) { return p.status !== "hidden"; });
    sel.innerHTML = "";
    products.forEach(function (p) {
      var opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name + " (" + p.id + ")";
      sel.appendChild(opt);
    });
    [["mixed", "Multiple models / mixed order"], ["oem", "Custom OEM / ODM project"]].forEach(function (pair) {
      var opt = document.createElement("option");
      opt.value = pair[0];
      opt.textContent = pair[1];
      sel.appendChild(opt);
    });
    if (preset) sel.value = preset;
  }
  function applyStorefront() {
    if (!window.FeiheStore) return;
    var products = FeiheStore.products();
    var byId = {};
    products.forEach(function (p) { byId[p.id] = p; });
    var catEn = { "smart-tv": "Smart TV", "digital-tv": "Digital TV", monitor: "Monitor" };
    var inSub = /\/(products|news)\//.test(location.pathname);

    document.querySelectorAll(".product-card").forEach(function (card) {
      var link = card.querySelector("a[href]");
      if (!link) return;
      var href = link.getAttribute("href") || "";
      var product = products.find(function (p) { return p.builtin && href.indexOf(p.slug) !== -1; });
      if (!product) return;
      card.setAttribute("data-sku", product.id);
      var hidden = product.status === "hidden";
      if (hidden) card.setAttribute("data-admin-hidden", "1");
      else card.removeAttribute("data-admin-hidden");
      card.style.display = hidden ? "none" : "";
      var nameLink = card.querySelector("h3 a");
      if (nameLink) nameLink.textContent = product.name;
      var meta = card.querySelector(".meta");
      if (meta && product.meta) meta.textContent = product.meta;
      var priceEl = card.querySelector(".price");
      if (priceEl) priceEl.textContent = money(product.price);
      var stockEl = card.querySelector(".stock");
      if (stockEl) {
        var view = stockView(product);
        stockEl.textContent = view.text;
        stockEl.classList.remove("low", "out");
        if (view.cls) stockEl.classList.add(view.cls);
      }
      var img = card.querySelector("img");
      if (img && product.image) img.src = img.getAttribute("src").replace(/[^/]+$/, product.image);
      var badge = null;
      Array.prototype.forEach.call(card.children, function (child) {
        if (child.classList && child.classList.contains("badge")) badge = child;
      });
      if (product.badge) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "badge blue";
          card.insertBefore(badge, card.firstChild);
        }
        badge.textContent = product.badge;
      } else if (badge) {
        badge.remove();
      }
    });

    var listing = document.querySelector(".products-grid");
    if (listing) {
      products.forEach(function (product) {
        if (product.builtin || product.status === "hidden") return;
        if (listing.querySelector('[data-sku="' + product.id + '"]')) return;
        var card = document.createElement("article");
        card.className = "product-card";
        card.setAttribute("data-sku", product.id);
        card.setAttribute("data-category", product.category);
        card.setAttribute("data-size", String(product.size));
        var href = "../inquiry.html?product=" + encodeURIComponent(product.id);
        var thumb = document.createElement("a");
        thumb.className = "thumb";
        thumb.href = href;
        var img = document.createElement("img");
        img.src = "../assets/img/" + product.image;
        img.alt = product.name;
        img.width = 800;
        img.height = 600;
        thumb.appendChild(img);
        var body = document.createElement("div");
        body.className = "body";
        var cat = document.createElement("span");
        cat.className = "category";
        cat.textContent = catEn[product.category] || "Display";
        var h3 = document.createElement("h3");
        var title = document.createElement("a");
        title.href = href;
        title.textContent = product.name;
        h3.appendChild(title);
        var meta = document.createElement("p");
        meta.className = "meta";
        meta.textContent = product.meta || product.id;
        var row = document.createElement("div");
        row.className = "price-row";
        var priceEl = document.createElement("span");
        priceEl.className = "price";
        priceEl.textContent = money(product.price);
        var stockEl = document.createElement("span");
        var view = stockView(product);
        stockEl.className = "stock" + (view.cls ? " " + view.cls : "");
        stockEl.textContent = view.text;
        row.appendChild(priceEl);
        row.appendChild(stockEl);
        body.appendChild(cat);
        body.appendChild(h3);
        body.appendChild(meta);
        body.appendChild(row);
        if (product.badge) {
          var badge = document.createElement("span");
          badge.className = "badge blue";
          badge.textContent = product.badge;
          card.appendChild(badge);
        }
        card.appendChild(thumb);
        card.appendChild(body);
        listing.appendChild(card);
      });
    }

    document.querySelectorAll("[data-add-to-cart]").forEach(function (btn) {
      var product = byId[btn.getAttribute("data-id")];
      if (!product) return;
      btn.setAttribute("data-price", Number(product.price).toFixed(2));
      btn.setAttribute("data-name", product.name);
      var priceEl = document.querySelector(".product-price-row .price");
      if (priceEl) priceEl.textContent = money(product.price);
      var infoName = document.querySelector(".product-info h1");
      if (infoName) infoName.textContent = product.name;
      var line = document.querySelector(".stock-line");
      if (line) {
        var view = stockView(product);
        var ship = product.stock <= 0 ? "Currently unavailable" : (view.cls === "low" ? "Limited quantity" : "ships within 48 hours from EU or US warehouse");
        line.innerHTML = "";
        var stockEl = document.createElement("span");
        stockEl.className = "stock" + (view.cls ? " " + view.cls : "");
        stockEl.textContent = view.text;
        line.appendChild(stockEl);
        line.appendChild(document.createTextNode(" — " + ship));
      }
      if (product.status === "hidden" || product.stock <= 0) {
        btn.disabled = true;
        btn.textContent = product.stock <= 0 ? "Out of Stock" : "Unavailable";
      }
    });

    var news = FeiheStore.news();
    document.querySelectorAll(".news-card").forEach(function (card) {
      var link = card.querySelector("a[href]");
      if (!link) return;
      var href = link.getAttribute("href") || "";
      var item = news.find(function (n) { return n.builtin && href.indexOf(n.slug) !== -1; });
      if (!item) return;
      card.style.display = item.published ? "" : "none";
      var heading = card.querySelector("h3 a");
      if (heading) heading.textContent = item.title;
      var summary = card.querySelector(".body > p");
      if (summary) summary.textContent = item.excerpt;
      var dateEl = card.querySelector(".date");
      if (dateEl) dateEl.textContent = formatNewsDate(item.date) + " · " + item.category;
    });
    var newsGrids = [];
    document.querySelectorAll(".news-card").forEach(function (card) {
      if (newsGrids.indexOf(card.parentElement) === -1) newsGrids.push(card.parentElement);
    });
    news.filter(function (n) { return !n.builtin && n.published; }).forEach(function (item) {
      newsGrids.forEach(function (grid) {
        if (!grid || grid.querySelector('a[href*="' + item.id + '"]')) return;
        var href = (inSub ? "" : "news/") + "post.html?id=" + encodeURIComponent(item.id);
        var article = document.createElement("article");
        article.className = "news-card";
        var media = document.createElement("a");
        media.href = href;
        var img = document.createElement("img");
        img.src = (inSub ? "../" : "") + "assets/img/" + item.image;
        img.alt = item.title;
        img.loading = "lazy";
        media.appendChild(img);
        var body = document.createElement("div");
        body.className = "body";
        var dateEl = document.createElement("span");
        dateEl.className = "date";
        dateEl.textContent = formatNewsDate(item.date) + " · " + item.category;
        var h3 = document.createElement("h3");
        var title = document.createElement("a");
        title.href = href;
        title.textContent = item.title;
        h3.appendChild(title);
        var summary = document.createElement("p");
        summary.textContent = item.excerpt;
        var more = document.createElement("a");
        more.className = "read-more";
        more.href = href;
        more.textContent = "Read article →";
        body.appendChild(dateEl);
        body.appendChild(h3);
        body.appendChild(summary);
        body.appendChild(more);
        article.appendChild(media);
        article.appendChild(body);
        grid.appendChild(article);
      });
    });

    var file = location.pathname.split("/").pop();
    var currentNews = news.find(function (n) { return n.slug === file; });
    if (currentNews) {
      var articleTitle = document.querySelector(".article h1");
      if (articleTitle) articleTitle.textContent = currentNews.title;
      var articleDate = document.querySelector(".article .date");
      if (articleDate) articleDate.textContent = formatNewsDate(currentNews.date) + " · " + currentNews.category;
      if (!currentNews.published) {
        var article = document.querySelector(".article");
        if (article) {
          article.innerHTML = "";
          var missing = document.createElement("h1");
          missing.textContent = "This article is unavailable";
          article.appendChild(missing);
        }
      }
    }

    var postArticle = document.getElementById("postArticle");
    if (postArticle) {
      var postId = new URLSearchParams(location.search).get("id");
      var post = news.find(function (n) { return n.id === postId; });
      var postTitle = document.getElementById("postTitle");
      var postDate = document.getElementById("postDate");
      var postBody = document.getElementById("postBody");
      var postImage = document.getElementById("postImage");
      if (!post || !post.published) {
        if (postTitle) postTitle.textContent = "This article is unavailable";
      } else {
        document.title = post.title + " | Feihe";
        if (postTitle) postTitle.textContent = post.title;
        if (postDate) postDate.textContent = formatNewsDate(post.date) + " · " + post.category;
        if (postImage) {
          postImage.src = "../assets/img/" + post.image;
          postImage.alt = post.title;
          postImage.hidden = false;
        }
        if (postBody) {
          postBody.innerHTML = "";
          String(post.body || post.excerpt || "").split(/\n{2,}/).forEach(function (para) {
            var text = para.trim();
            if (!text) return;
            var p = document.createElement("p");
            p.textContent = text;
            postBody.appendChild(p);
          });
        }
      }
    }

    fillInquiryProducts();
    document.querySelectorAll('nav[aria-label="Legal"]').forEach(function (nav) {
      if (nav.querySelector("[data-admin-link]")) return;
      var a = document.createElement("a");
      a.href = (inSub ? "../" : "") + "admin/";
      a.textContent = "管理后台";
      a.setAttribute("data-admin-link", "");
      nav.appendChild(a);
    });
  }
  applyStorefront();

  /* ---------- Product filters (products listing page) ---------- */
  var filterBoxes = document.querySelectorAll("[data-filter-group]");
  if (filterBoxes.length) {
    var productCards = document.querySelectorAll("[data-category]");
    var countEl = document.getElementById("resultsCount");
    var noResults = document.getElementById("noResults");
    var applyFilters = function () {
      var active = { category: [], size: [] };
      filterBoxes.forEach(function (box) {
        if (box.checked) active[box.getAttribute("data-filter-group")].push(box.value);
      });
      var shown = 0;
      var total = 0;
      productCards.forEach(function (card) {
        if (card.getAttribute("data-admin-hidden") === "1") {
          card.style.display = "none";
          return;
        }
        total++;
        var cat = card.getAttribute("data-category");
        var size = parseFloat(card.getAttribute("data-size")) || 0;
        var catOk = !active.category.length || active.category.indexOf(cat) !== -1;
        var sizeOk = true;
        if (active.size.length) {
          sizeOk = active.size.some(function (range) {
            if (range === "lt20") return size < 20;
            if (range === "20-24") return size >= 20 && size <= 24;
            if (range === "25-27") return size > 24;
            return true;
          });
        }
        var show = catOk && sizeOk;
        card.style.display = show ? "" : "none";
        if (show) shown++;
      });
      if (countEl) countEl.textContent = "Showing " + shown + " of " + total + " products";
      if (noResults) noResults.style.display = shown ? "none" : "block";
    };
    filterBoxes.forEach(function (box) { box.addEventListener("change", applyFilters); });
    var clearBtn = document.getElementById("filterClear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        filterBoxes.forEach(function (b) { b.checked = false; });
        applyFilters();
      });
    }
    applyFilters();
  }

  /* ---------- Quote & contact forms feed the admin inbox ---------- */
  document.querySelectorAll("form[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (window.FeiheStore) {
        var obj = {};
        new FormData(form).forEach(function (value, key) { obj[key] = value; });
        if (form.querySelector("#qName")) FeiheStore.addInquiry(obj);
        else if (form.querySelector("#cName")) FeiheStore.addMessage(obj);
      }
      var success = form.querySelector(".form-success");
      if (success) {
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
      if (typeof fillInquiryProducts === "function") fillInquiryProducts();
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  updateCartCount();
})();
