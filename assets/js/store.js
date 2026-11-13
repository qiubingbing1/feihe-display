/* ============================================================
   Feihe — shared catalog & inbox (localStorage)
   Used by the storefront and /admin/. Demo only.
   ============================================================ */
(function (global) {
  "use strict";

  var KEY = "feihe_admin_v1";

  var SEED = {
    version: 1,
    products: [
      { id: "FH-24STV", name: "24″ Smart TV with Google TV™ — FHD Frameless", category: "smart-tv", size: 24, price: 139, compareAt: 169, stock: 240, lowAt: 30, status: "active", badge: "", slug: "24-smart-tv.html", image: "product-24-smart-tv.svg", meta: "23.8″ IPS · 1920×1080 · Netflix & YouTube built in", moq: 1, featured: true, builtin: true },
      { id: "FH-27M4K", name: "27″ 4K UHD Monitor — USB-C 65W, 99% sRGB", category: "monitor", size: 27, price: 219, compareAt: 259, stock: 86, lowAt: 20, status: "active", badge: "New", slug: "27-4k-monitor.html", image: "product-27-4k-monitor.svg", meta: "3840×2160 IPS · Height-adjustable stand", moq: 1, featured: true, builtin: true },
      { id: "FH-22DTV", name: "22″ Digital TV — DVB-T2/S2/C Triple Tuner", category: "digital-tv", size: 22, price: 109, compareAt: 129, stock: 154, lowAt: 20, status: "active", badge: "", slug: "22-digital-tv.html", image: "product-22-digital-tv.svg", meta: "Full HD · PVR recording · Ideal for EU broadcast", moq: 1, featured: true, builtin: true },
      { id: "FH-24M100", name: "24″ 100Hz IPS Monitor — 1ms MPRT, FreeSync", category: "monitor", size: 24, price: 129, compareAt: 149, stock: 310, lowAt: 40, status: "active", badge: "", slug: "24-monitor.html", image: "product-24-monitor.svg", meta: "1920×1080 · HDMI + VGA · Home & office", moq: 1, featured: true, builtin: true },
      { id: "FH-195STV", name: "19.5″ HD Smart TV — Compact Android 11", category: "smart-tv", size: 19.5, price: 99, compareAt: 119, stock: 64, lowAt: 20, status: "active", badge: "", slug: "19-smart-tv.html", image: "product-19-smart-tv.svg", meta: "1366×768 · Dual HDMI · Kitchen & bedroom fit", moq: 1, featured: true, builtin: true },
      { id: "FH-27MQHD", name: "27″ QHD Pro Monitor — 100% sRGB, USB-C 90W", category: "monitor", size: 27, price: 249, compareAt: 289, stock: 12, lowAt: 20, status: "active", badge: "", slug: "27-qhd-monitor.html", image: "product-27-qhd-monitor.svg", meta: "2560×1440 · ΔE < 2 · Pivot & swivel stand", moq: 1, featured: true, builtin: true }
    ],
    orders: [
      {
        id: "FH261112-1618",
        createdAt: "2026-11-12T16:40:00+08:00",
        customer: "Marco Rossi",
        email: "m.rossi@rossivision.it",
        country: "Italy",
        method: "stripe",
        status: "pending",
        tracking: "",
        note: "等待客户确认账单地址。",
        items: [{ id: "FH-27MQHD", name: "27″ QHD Pro Monitor — 100% sRGB, USB-C 90W", price: 249, qty: 2 }],
        total: 498
      },
      {
        id: "FH261111-0924",
        createdAt: "2026-11-11T09:24:00+08:00",
        customer: "Lena Hoffmann",
        email: "lena@nordlicht.de",
        country: "Germany",
        method: "stripe",
        status: "paid",
        tracking: "",
        note: "欧盟仓发货，需要 CE 随货文件。",
        items: [{ id: "FH-27M4K", name: "27″ 4K UHD Monitor — USB-C 65W, 99% sRGB", price: 219, qty: 4 }],
        total: 876
      },
      {
        id: "FH261108-1402",
        createdAt: "2026-11-08T14:02:00+08:00",
        customer: "James Carter",
        email: "james@carterretail.com",
        country: "United States",
        method: "paypal",
        status: "shipped",
        tracking: "EU-WH-88421",
        note: "",
        items: [{ id: "FH-24STV", name: "24″ Smart TV with Google TV™ — FHD Frameless", price: 139, qty: 12 }],
        total: 1668
      },
      {
        id: "FH261101-0811",
        createdAt: "2026-11-01T08:11:00+08:00",
        customer: "Sophie Martin",
        email: "s.martin@hotelbleu.fr",
        country: "France",
        method: "stripe",
        status: "completed",
        tracking: "EU-WH-87102",
        note: "酒店项目，已签收。",
        items: [
          { id: "FH-195STV", name: "19.5″ HD Smart TV — Compact Android 11", price: 99, qty: 20 },
          { id: "FH-22DTV", name: "22″ Digital TV — DVB-T2/S2/C Triple Tuner", price: 109, qty: 8 }
        ],
        total: 2852
      }
    ],
    inquiries: [
      { id: "Q-1048", createdAt: "2026-11-12T11:20:00+08:00", name: "Olivia Bennett", company: "Harbor Hotels", email: "olivia@harborhotels.co.uk", country: "United Kingdom", product: "FH-24STV", quantity: "100-499", message: "We need 180 units of the 24″ Google TV for a lobby and guest-room refresh. Please include CE paperwork and a boot-logo mockup.", status: "new", note: "" },
      { id: "Q-1042", createdAt: "2026-11-09T15:05:00+08:00", name: "Marco Bianchi", company: "Bianchi Retail", email: "marco@bianchiretail.it", country: "Italy", product: "FH-27M4K", quantity: "10-99", message: "Looking for 40 units of the 4K monitor for a design studio chain. Need Italian plugs and a November ship date.", status: "quoted", note: "已报 €198/台 EXW 深圳，交期 18 天。" },
      { id: "Q-1036", createdAt: "2026-11-04T10:12:00+08:00", name: "Anna Kowalska", company: "Hotel Mazovia", email: "anna@hotelmazovia.pl", country: "Poland", product: "FH-195STV", quantity: "500+", message: "OEM project: 800 compact smart TVs with our logo on the boot screen and a custom carton.", status: "closed", note: "客户改期到明年 Q1。" },
      { id: "Q-1031", createdAt: "2026-11-02T09:40:00+08:00", name: "David Nguyen", company: "Pacific Workspace", email: "david@pacificworkspace.com", country: "United States", product: "oem", quantity: "500+", message: "Can you build a 24″ monitor with our bezel color and a locked-down firmware image for coworking spaces?", status: "new", note: "" }
    ],
    messages: [
      { id: "M-220", createdAt: "2026-11-13T08:16:00+08:00", name: "Chris Adler", email: "chris.adler@gmail.com", subject: "Replacement remote for FH-24STV", message: "The remote that came with my 24-inch smart TV stopped responding. Order was placed in October. Can you ship a replacement to Berlin?", status: "unread", note: "" },
      { id: "M-214", createdAt: "2026-11-07T13:22:00+08:00", name: "Elena Petrov", email: "elena@nordoffice.se", subject: "Partnership", message: "We distribute displays in Sweden and Norway. Happy to talk about a reseller agreement for the monitor line.", status: "read", note: "" },
      { id: "M-208", createdAt: "2026-10-28T17:05:00+08:00", name: "Tom Walker", email: "tom@walkermedia.com", subject: "Order question", message: "Does the 22″ digital TV include a UK power lead, or only EU?", status: "replied", note: "已回复：英规电源线可随单更换。" }
    ],
    news: [
      { id: "news-4k", slug: "feihe-launches-27-inch-4k-monitor-eu.html", title: "Feihe Launches 27″ 4K UHD Monitor Across Europe", date: "2026-11-02", category: "Product News", excerpt: "The FH-27M4K arrives in EU warehouses with CE and ENERGY STAR certification, USB-C power delivery, and a launch price of $219.", body: "", image: "news-4k-launch.svg", published: true, builtin: true },
      { id: "news-guide", slug: "how-to-choose-small-smart-tv.html", title: "How to Choose a Small Smart TV for Kitchen & Bedroom", date: "2026-10-18", category: "Buying Guide", excerpt: "Screen size, operating system, brightness and mounting — a plain-English guide to picking the right compact TV for tight spaces.", body: "", image: "news-buying-guide.svg", published: true, builtin: true },
      { id: "news-eu", slug: "feihe-expands-eu-warehouse.html", title: "Feihe Expands EU Warehouse for 2–4 Day Delivery", date: "2026-09-30", category: "Company News", excerpt: "A new central European fulfillment hub now stocks our six best-selling models, cutting delivery times for retail and B2B customers.", body: "", image: "news-eu-warehouse.svg", published: true, builtin: true }
    ]
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function load() {
    try {
      var data = JSON.parse(localStorage.getItem(KEY));
      if (!data || !Array.isArray(data.products)) {
        data = clone(SEED);
        save(data);
      }
      return data;
    } catch (e) {
      var fresh = clone(SEED);
      save(fresh);
      return fresh;
    }
  }

  function updateItem(collection, id, patch) {
    var data = load();
    var item = data[collection].find(function (row) { return row.id === id; });
    if (!item) return null;
    Object.keys(patch).forEach(function (key) {
      if (patch[key] !== undefined) item[key] = patch[key];
    });
    save(data);
    return item;
  }

  function num(value, fallback) {
    var n = Number(value);
    return isNaN(n) ? fallback : n;
  }

  function nextSeq(list, prefix, floor) {
    var max = floor;
    list.forEach(function (row) {
      var n = parseInt(String(row.id).replace(/^\D+/, ""), 10);
      if (!isNaN(n) && n > max) max = n;
    });
    return prefix + "-" + (max + 1);
  }

  function orderId() {
    var d = new Date();
    var y = String(d.getFullYear()).slice(2);
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    var n = Math.floor(1000 + Math.random() * 9000);
    return "FH" + y + m + day + "-" + n;
  }

  var api = {
    load: load,
    products: function () { return load().products; },
    orders: function () { return load().orders; },
    inquiries: function () { return load().inquiries; },
    messages: function () { return load().messages; },
    news: function () { return load().news; },

    addProduct: function (input) {
      var data = load();
      var id = String(input.id || "").trim().toUpperCase();
      if (!id) id = "FH-" + Math.floor(1000 + Math.random() * 9000);
      if (data.products.some(function (row) { return row.id === id; })) {
        throw new Error("型号 " + id + " 已存在");
      }
      var item = {
        id: id,
        name: String(input.name || "").trim(),
        category: input.category || "monitor",
        size: num(input.size, 24),
        price: num(input.price, 0),
        compareAt: num(input.compareAt, 0),
        stock: parseInt(input.stock, 10) || 0,
        lowAt: parseInt(input.lowAt, 10) || 20,
        status: input.status === "hidden" ? "hidden" : "active",
        badge: String(input.badge || "").trim(),
        slug: String(input.slug || (id.toLowerCase() + ".html")).trim(),
        image: input.image || "product-24-monitor.svg",
        meta: String(input.meta || "").trim(),
        moq: parseInt(input.moq, 10) || 1,
        featured: input.featured === true || input.featured === "on",
        builtin: false
      };
      if (!item.name) throw new Error("请填写商品名称");
      data.products.push(item);
      save(data);
      return item;
    },

    updateProduct: function (id, input) {
      return updateItem("products", id, {
        name: String(input.name || "").trim(),
        category: input.category,
        size: num(input.size, 24),
        price: num(input.price, 0),
        compareAt: num(input.compareAt, 0),
        stock: parseInt(input.stock, 10) || 0,
        lowAt: parseInt(input.lowAt, 10) || 0,
        status: input.status === "hidden" ? "hidden" : "active",
        badge: String(input.badge || "").trim(),
        image: input.image,
        meta: String(input.meta || "").trim(),
        moq: parseInt(input.moq, 10) || 1,
        featured: input.featured === true || input.featured === "on"
      });
    },

    removeProduct: function (id) {
      var data = load();
      var item = data.products.find(function (row) { return row.id === id; });
      if (!item) return;
      if (item.builtin) {
        item.status = "hidden";
      } else {
        data.products = data.products.filter(function (row) { return row.id !== id; });
      }
      save(data);
    },

    addOrder: function (input) {
      var data = load();
      var items = (input.items || []).map(function (it) {
        return {
          id: it.id,
          name: it.name,
          price: num(it.price, 0),
          qty: parseInt(it.qty, 10) || 1
        };
      });
      var total = items.reduce(function (sum, it) { return sum + it.price * it.qty; }, 0);
      items.forEach(function (it) {
        var product = data.products.find(function (row) { return row.id === it.id; });
        if (product) product.stock = Math.max(0, product.stock - it.qty);
      });
      var order = {
        id: orderId(),
        createdAt: new Date().toISOString(),
        customer: String(input.customer || "").trim(),
        email: String(input.email || "").trim(),
        country: String(input.country || "").trim(),
        method: input.method === "paypal" ? "paypal" : "stripe",
        status: "pending",
        tracking: "",
        note: "",
        items: items,
        total: Math.round(total * 100) / 100
      };
      data.orders.unshift(order);
      save(data);
      return order;
    },

    updateOrder: function (id, patch) {
      return updateItem("orders", id, patch);
    },

    addInquiry: function (input) {
      var data = load();
      var row = {
        id: nextSeq(data.inquiries, "Q", 1000),
        createdAt: new Date().toISOString(),
        name: String(input.name || "").trim(),
        company: String(input.company || "").trim(),
        email: String(input.email || "").trim(),
        country: String(input.country || "").trim(),
        product: String(input.product || "").trim(),
        quantity: String(input.quantity || "").trim(),
        message: String(input.message || "").trim(),
        status: "new",
        note: ""
      };
      data.inquiries.unshift(row);
      save(data);
      return row;
    },

    updateInquiry: function (id, patch) {
      return updateItem("inquiries", id, patch);
    },

    addMessage: function (input) {
      var data = load();
      var row = {
        id: nextSeq(data.messages, "M", 200),
        createdAt: new Date().toISOString(),
        name: String(input.name || "").trim(),
        email: String(input.email || "").trim(),
        subject: String(input.subject || "").trim() || "（无主题）",
        message: String(input.message || "").trim(),
        status: "unread",
        note: ""
      };
      data.messages.unshift(row);
      save(data);
      return row;
    },

    updateMessage: function (id, patch) {
      return updateItem("messages", id, patch);
    },

    addNews: function (input) {
      var data = load();
      var id = "news-" + Date.now().toString(36);
      var row = {
        id: id,
        slug: "post.html?id=" + id,
        title: String(input.title || "").trim(),
        date: input.date || new Date().toISOString().slice(0, 10),
        category: String(input.category || "Company News").trim(),
        excerpt: String(input.excerpt || "").trim(),
        body: String(input.body || "").trim(),
        image: input.image || "news-4k-launch.svg",
        published: input.published === true || input.published === "on",
        builtin: false
      };
      if (!row.title) throw new Error("请填写标题");
      data.news.unshift(row);
      save(data);
      return row;
    },

    updateNews: function (id, input) {
      var existing = load().news.find(function (row) { return row.id === id; });
      if (!existing) return null;
      var patch = {
        title: String(input.title || "").trim(),
        date: input.date,
        category: String(input.category || "").trim(),
        excerpt: String(input.excerpt || "").trim(),
        image: input.image,
        published: input.published === true || input.published === "on"
      };
      if (!existing.builtin) patch.body = String(input.body || "").trim();
      return updateItem("news", id, patch);
    },

    removeNews: function (id) {
      var data = load();
      var item = data.news.find(function (row) { return row.id === id; });
      if (!item) return;
      if (item.builtin) item.published = false;
      else data.news = data.news.filter(function (row) { return row.id !== id; });
      save(data);
    },

    reset: function () {
      save(clone(SEED));
    },

    exportJSON: function () {
      return JSON.stringify(load(), null, 2);
    },

    importJSON: function (text) {
      var data = JSON.parse(text);
      ["products", "orders", "inquiries", "messages", "news"].forEach(function (key) {
        if (!Array.isArray(data[key])) throw new Error("文件缺少 " + key);
      });
      data.version = 1;
      save(data);
    }
  };

  global.FeiheStore = api;
})(window);
