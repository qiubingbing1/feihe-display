/* Feihe admin console */
(function () {
  "use strict";

  var app = document.getElementById("app");
  var SESSION = "feihe_admin_session";
  var USER = "admin";
  var PASS = "feihe2026";

  var CATS = { "smart-tv": "智能电视", "digital-tv": "数字电视", monitor: "显示器" };
  var CAT_EN = { "smart-tv": "Smart TV", "digital-tv": "Digital TV", monitor: "Monitor" };
  var ORDER_STATUS = { pending: "待付款", paid: "已付款", shipped: "已发货", completed: "已完成", cancelled: "已取消" };
  var INQ_STATUS = { "new": "待处理", quoted: "已报价", closed: "已关闭" };
  var MSG_STATUS = { unread: "未读", read: "已读", replied: "已回复" };
  var QTY = { "1-9": "1–9 台（零售）", "10-99": "10–99 台", "100-499": "100–499 台", "500+": "500 台以上（OEM）" };
  var IMAGES = [
    "product-24-smart-tv.svg",
    "product-27-4k-monitor.svg",
    "product-22-digital-tv.svg",
    "product-24-monitor.svg",
    "product-19-smart-tv.svg",
    "product-27-qhd-monitor.svg"
  ];
  var NEWS_IMAGES = ["news-4k-launch.svg", "news-buying-guide.svg", "news-eu-warehouse.svg"];

  var pageName = "dashboard";

  function authed() { return sessionStorage.getItem(SESSION) === "1"; }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function money(n) { return "$" + (Number(n) || 0).toFixed(2); }

  function fmt(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return esc(iso);
    var p = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  function dayKey(iso) {
    var d = new Date(iso);
    var p = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  function toast(message) {
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () { el.remove(); }, 2200);
  }

  function parseHash() {
    var raw = (location.hash || "#/dashboard").replace(/^#/, "");
    var q = "";
    var path = raw;
    var qi = raw.indexOf("?");
    if (qi !== -1) {
      path = raw.slice(0, qi);
      q = raw.slice(qi + 1);
    }
    var parts = path.split("/").filter(Boolean);
    return {
      page: parts[0] || "dashboard",
      id: parts[1] ? decodeURIComponent(parts.slice(1).join("/")) : "",
      params: new URLSearchParams(q)
    };
  }

  function productName(id) {
    var row = FeiheStore.products().find(function (p) { return p.id === id; });
    if (row) return row.name;
    if (id === "mixed") return "多型号混合订单";
    if (id === "oem") return "定制 OEM / ODM";
    return id || "—";
  }

  function statusTag(map, value) {
    var label = map[value] || value;
    var tone = "gray";
    if (value === "paid" || value === "completed" || value === "replied" || value === "active" || value === "quoted") tone = "green";
    if (value === "pending" || value === "new" || value === "unread" || value === "shipped") tone = "amber";
    if (value === "cancelled" || value === "hidden" || value === "closed") tone = "red";
    if (value === "read") tone = "gray";
    return '<span class="tag ' + tone + '">' + esc(label) + "</span>";
  }

  function counts() {
    return {
      orders: FeiheStore.orders().filter(function (o) { return o.status === "pending"; }).length,
      inquiries: FeiheStore.inquiries().filter(function (o) { return o.status === "new"; }).length,
      messages: FeiheStore.messages().filter(function (o) { return o.status === "unread"; }).length
    };
  }

  function icon(name) {
    var paths = {
      home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"/>',
      box: '<path d="M3 7.5 12 3l9 4.5v9L12 21 3 16.5v-9z"/><path d="M12 12 21 7.5M12 12v9M12 12 3 7.5"/>',
      cart: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2.2 11h11.2l2-7H7"/>',
      mail: '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
      chat: '<path d="M5 6h14v9H8l-3 3z"/>',
      news: '<path d="M5 5h10a2 2 0 0 1 2 2v12H7a2 2 0 0 0-2 2V5z"/><path d="M17 9h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8"/><path d="M8 9h6M8 13h6"/>',
      gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>'
    };
    return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (paths[name] || "") + "</svg>";
  }

  function nav(current) {
    var c = counts();
    var items = [
      ["dashboard", "概览", "home", 0],
      ["products", "商品", "box", 0],
      ["orders", "订单", "cart", c.orders],
      ["inquiries", "询盘", "mail", c.inquiries],
      ["messages", "留言", "chat", c.messages],
      ["news", "新闻", "news", 0],
      ["settings", "设置", "gear", 0]
    ];
    return items.map(function (item) {
      var badge = item[3] ? '<span class="count">' + item[3] + "</span>" : "";
      var cls = current === item[0] ? "active" : "";
      return '<a class="' + cls + '" href="#/' + item[0] + '">' + icon(item[2]) + "<span>" + item[1] + "</span>" + badge + "</a>";
    }).join("");
  }

  function shell(title, body) {
    app.innerHTML =
      '<div class="backdrop" id="backdrop"></div>' +
      '<div class="layout">' +
        '<aside class="sidebar" id="sidebar">' +
          '<a class="side-brand" href="#/dashboard"><img src="../assets/img/logo.svg" alt=""><span>飞鹤后台<small>Feihe Admin</small></span></a>' +
          '<nav class="side-nav">' + nav(pageName) + "</nav>" +
          '<div class="side-foot"><a href="../index.html" target="_blank" rel="noopener">查看前台站点</a></div>' +
        "</aside>" +
        '<div class="main">' +
          '<header class="topbar">' +
            '<button class="btn ghost sm menu-btn" type="button" id="menuBtn" aria-label="打开菜单">菜单</button>' +
            "<h1>" + esc(title) + "</h1>" +
            '<div class="top-actions"><span class="muted">admin</span><button class="btn ghost sm" type="button" data-action="logout">退出</button></div>' +
          "</header>" +
          '<div class="content">' + body + "</div>" +
        "</div>" +
      "</div>";
  }

  function renderLogin() {
    app.innerHTML =
      '<div class="login-wrap"><form class="login-card" id="loginForm">' +
        '<div class="brand"><img src="../assets/img/logo.svg" alt=""><span>飞鹤<i>.</i> 管理后台</span></div>' +
        "<h1>登录</h1>" +
        '<p class="lede">管理商品、订单、询盘和新闻。数据保存在这台浏览器里。</p>' +
        '<div class="form-error" id="loginError">账号或密码不正确</div>' +
        '<div class="field"><label for="user">账号</label><input id="user" name="user" autocomplete="username" required value="admin"></div>' +
        '<div class="field"><label for="pass">密码</label><input id="pass" name="pass" type="password" autocomplete="current-password" required></div>' +
        '<button class="btn block" type="submit">进入后台</button>' +
        '<p class="hint">演示账号 <strong>admin</strong>，密码 <strong>feihe2026</strong></p>' +
      "</form></div>";
  }

  function renderDashboard() {
    var orders = FeiheStore.orders();
    var inquiries = FeiheStore.inquiries();
    var products = FeiheStore.products();
    var revenue = orders.filter(function (o) { return o.status !== "cancelled"; }).reduce(function (sum, o) { return sum + o.total; }, 0);
    var pending = orders.filter(function (o) { return o.status === "pending"; }).length;
    var fresh = inquiries.filter(function (o) { return o.status === "new"; }).length;
    var low = products.filter(function (p) { return p.status !== "hidden" && p.stock <= p.lowAt; });
    var days = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setHours(12, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push(dayKey(d.toISOString()));
    }
    var series = days.map(function (key) {
      return orders.filter(function (o) { return o.status !== "cancelled" && dayKey(o.createdAt) === key; })
        .reduce(function (sum, o) { return sum + o.total; }, 0);
    });
    var max = Math.max.apply(null, series.concat([1]));
    var bars = series.map(function (value, idx) {
      var h = Math.max(4, Math.round((value / max) * 100));
      var label = days[idx].slice(5);
      return '<div class="bar-col" title="' + esc(money(value)) + '"><div class="bar" style="height:' + h + '%"></div><span>' + label + "</span></div>";
    }).join("");
    var recentOrders = orders.slice(0, 5).map(function (o) {
      return "<tr><td><a class=\"linkish\" href=\"#/orders/" + esc(o.id) + "\">" + esc(o.id) + "</a><div class=\"muted\">" + esc(o.customer) + "</div></td><td>" + money(o.total) + "</td><td>" + statusTag(ORDER_STATUS, o.status) + "</td></tr>";
    }).join("") || '<tr><td colspan="3" class="empty">还没有订单</td></tr>';
    var recentInq = inquiries.slice(0, 4).map(function (q) {
      return '<a class="linkish" href="#/inquiries/' + esc(q.id) + '">' + esc(q.company || q.name) + "</a> · " + esc(productName(q.product)) + " " + statusTag(INQ_STATUS, q.status);
    }).join("<br><br>") || '<p class="empty">还没有询盘</p>';
    var lowHtml = low.map(function (p) {
      return "<div>" + esc(p.id) + " · 库存 " + p.stock + "</div>";
    }).join("") || "<div>库存都在安全线以上</div>";

    return (
      '<div class="stats">' +
        '<div class="stat"><div class="k">有效订单金额</div><div class="v">' + money(revenue) + '</div><div class="s">' + orders.length + " 笔订单</div></div>" +
        '<div class="stat"><div class="k">待付款</div><div class="v">' + pending + '</div><div class="s"><a href="#/orders?status=pending">查看订单</a></div></div>' +
        '<div class="stat"><div class="k">待处理询盘</div><div class="v">' + fresh + '</div><div class="s"><a href="#/inquiries?status=new">查看询盘</a></div></div>' +
        '<div class="stat' + (low.length ? " warn" : "") + '"><div class="k">低库存商品</div><div class="v">' + low.length + '</div><div class="s">' + products.filter(function (p) { return p.status !== "hidden"; }).length + " 个在售</div></div>" +
      "</div>" +
      '<div class="grid-2">' +
        '<section class="card"><h2>近 7 日订单金额</h2><div class="bars">' + bars + "</div></section>" +
        '<section class="card"><h2>库存提醒</h2><div class="note-box">' + lowHtml + "</div></section>" +
      "</div>" +
      '<div class="split">' +
        '<section class="card"><h2>最近订单</h2><table><thead><tr><th>订单</th><th>金额</th><th>状态</th></tr></thead><tbody>' + recentOrders + "</tbody></table></section>" +
        '<section class="card"><h2>最新询盘</h2>' + recentInq + "</section>" +
      "</div>"
    );
  }

  function renderProducts() {
    var rows = FeiheStore.products().map(function (p) {
      var stockTone = p.stock <= 0 ? "red" : (p.stock <= p.lowAt ? "amber" : "green");
      var search = (p.id + " " + p.name + " " + (CATS[p.category] || "")).toLowerCase();
      return '<tr data-search="' + esc(search) + '" data-cat="' + esc(p.category) + '">' +
        '<td><div class="product-cell"><img src="../assets/img/' + esc(p.image) + '" alt=""><div><strong>' + esc(p.name) + '</strong><span>' + esc(p.id) + "</span></div></div></td>" +
        "<td>" + esc(CATS[p.category] || p.category) + "</td>" +
        "<td>" + money(p.price) + "</td>" +
        '<td><span class="tag ' + stockTone + '">' + p.stock + "</span></td>" +
        "<td>" + statusTag({ active: "在售", hidden: "已下架" }, p.status) + "</td>" +
        '<td><a class="btn ghost sm" href="#/products/' + esc(p.id) + '">编辑</a></td>' +
      "</tr>";
    }).join("");
    var options = Object.keys(CATS).map(function (key) {
      return '<option value="' + key + '">' + CATS[key] + "</option>";
    }).join("");
    return '<div class="toolbar">' +
      '<input id="listSearch" type="search" placeholder="搜索型号或名称">' +
      '<select id="catFilter"><option value="">全部分类</option>' + options + "</select>" +
      '<div class="spacer"><a class="btn" href="#/products/new">新增商品</a></div>' +
    "</div>" +
    '<section class="card" style="padding:8px 12px;"><table><thead><tr><th>商品</th><th>分类</th><th>售价</th><th>库存</th><th>状态</th><th></th></tr></thead><tbody>' +
      rows + "</tbody></table></section>";
  }

  function imageOptions(current, list) {
    return list.map(function (name) {
      return '<option value="' + esc(name) + '"' + (name === current ? " selected" : "") + ">" + esc(name) + "</option>";
    }).join("");
  }

  function renderProductForm(id) {
    var creating = id === "new";
    var p = creating ? {
      id: "", name: "", category: "monitor", size: 24, price: 0, compareAt: 0,
      stock: 0, lowAt: 20, status: "active", badge: "", image: IMAGES[0], meta: "", moq: 1, featured: false, builtin: false
    } : FeiheStore.products().find(function (row) { return row.id === id; });
    if (!p) return '<p class="empty">找不到这个商品</p>';
    var cats = Object.keys(CATS).map(function (key) {
      return '<option value="' + key + '"' + (p.category === key ? " selected" : "") + ">" + CATS[key] + "</option>";
    }).join("");
    return '<form id="productForm" class="card">' +
      '<input type="hidden" name="mode" value="' + (creating ? "create" : "edit") + '">' +
      '<div class="detail-head"><div><h2>' + (creating ? "新商品" : esc(p.id)) + '</h2><p class="muted">保存后，前台价格、库存和上下架会立刻按这里的数据更新。</p></div>' +
      '<div class="btn-row"><a class="btn ghost" href="#/products">返回</a><button class="btn" type="submit">保存</button></div></div>' +
      '<div class="form-error" id="formError"></div>' +
      '<div class="form-grid">' +
        '<div class="field"><label>型号</label><input name="id" value="' + esc(p.id) + '"' + (creating ? "" : " readonly") + ' placeholder="FH-24NEW" required></div>' +
        '<div class="field"><label>分类</label><select name="category">' + cats + "</select></div>" +
        '<div class="field span-2"><label>名称</label><input name="name" value="' + esc(p.name) + '" required></div>' +
        '<div class="field span-2"><label>卖点摘要</label><input name="meta" value="' + esc(p.meta) + '"></div>' +
        '<div class="field"><label>售价（美元）</label><input name="price" type="number" min="0" step="0.01" value="' + esc(p.price) + '" required></div>' +
        '<div class="field"><label>对比价</label><input name="compareAt" type="number" min="0" step="0.01" value="' + esc(p.compareAt || 0) + '"></div>' +
        '<div class="field"><label>库存</label><input name="stock" type="number" min="0" step="1" value="' + esc(p.stock) + '"></div>' +
        '<div class="field"><label>低库存阈值</label><input name="lowAt" type="number" min="0" step="1" value="' + esc(p.lowAt) + '"></div>' +
        '<div class="field"><label>尺寸（英寸）</label><input name="size" type="number" min="1" step="0.1" value="' + esc(p.size) + '"></div>' +
        '<div class="field"><label>起订量</label><input name="moq" type="number" min="1" step="1" value="' + esc(p.moq || 1) + '"></div>' +
        '<div class="field"><label>角标</label><input name="badge" value="' + esc(p.badge) + '" placeholder="New"></div>' +
        '<div class="field"><label>状态</label><select name="status"><option value="active"' + (p.status !== "hidden" ? " selected" : "") + '>在售</option><option value="hidden"' + (p.status === "hidden" ? " selected" : "") + ">已下架</option></select></div>" +
        '<div class="field span-2"><label>图片</label><select name="image">' + imageOptions(p.image, IMAGES) + "</select></div>" +
        '<div class="field"><label class="check"><input type="checkbox" name="featured"' + (p.featured ? " checked" : "") + "> 首页主推</label></div>" +
      "</div>" +
      (creating ? "" : '<div class="btn-row" style="margin-top:8px;"><button class="btn danger sm" type="button" data-action="delete-product" data-id="' + esc(p.id) + '">' + (p.builtin ? "下架这个在售型号" : "删除商品") + "</button></div>") +
    "</form>";
  }

  function renderOrders(params) {
    var filter = params.get("status") || "";
    var tabs = '<div class="filters">' +
      ["", "pending", "paid", "shipped", "completed", "cancelled"].map(function (key) {
        var label = key ? ORDER_STATUS[key] : "全部";
        return '<a class="' + (filter === key ? "on" : "") + '" href="#/orders' + (key ? "?status=" + key : "") + '">' + label + "</a>";
      }).join("") + "</div>";
    var rows = FeiheStore.orders().filter(function (o) { return !filter || o.status === filter; }).map(function (o) {
      var search = (o.id + " " + o.customer + " " + o.email + " " + o.country).toLowerCase();
      return '<tr data-search="' + esc(search) + '"><td><a class="linkish" href="#/orders/' + esc(o.id) + '">' + esc(o.id) + '</a><div class="muted">' + fmt(o.createdAt) + "</div></td>" +
        "<td>" + esc(o.customer) + '<div class="muted">' + esc(o.country) + "</div></td>" +
        "<td>" + o.items.reduce(function (n, it) { return n + it.qty; }, 0) + " 件</td>" +
        "<td>" + money(o.total) + "</td>" +
        "<td>" + statusTag(ORDER_STATUS, o.status) + "</td>" +
        '<td><a class="btn ghost sm" href="#/orders/' + esc(o.id) + '">处理</a></td></tr>';
    }).join("") || '<tr><td colspan="6" class="empty">这个状态下没有订单</td></tr>';
    return '<div class="toolbar">' + tabs + '<input id="listSearch" type="search" placeholder="搜索客户或订单号"></div>' +
      '<section class="card" style="padding:8px 12px;"><table><thead><tr><th>订单</th><th>客户</th><th>数量</th><th>金额</th><th>状态</th><th></th></tr></thead><tbody>' + rows + "</tbody></table></section>";
  }

  function renderOrderDetail(id) {
    var o = FeiheStore.orders().find(function (row) { return row.id === id; });
    if (!o) return '<p class="empty">找不到这个订单</p>';
    var options = Object.keys(ORDER_STATUS).map(function (key) {
      return '<option value="' + key + '"' + (o.status === key ? " selected" : "") + ">" + ORDER_STATUS[key] + "</option>";
    }).join("");
    var items = o.items.map(function (it) {
      return "<tr><td>" + esc(it.name) + '<div class="muted">' + esc(it.id) + "</div></td><td>" + money(it.price) + "</td><td>" + it.qty + "</td><td>" + money(it.price * it.qty) + "</td></tr>";
    }).join("");
    return '<form id="orderForm" class="card">' +
      '<input type="hidden" name="id" value="' + esc(o.id) + '">' +
      '<div class="detail-head"><div><h2>' + esc(o.id) + '</h2><p class="muted">' + fmt(o.createdAt) + " · " + (o.method === "paypal" ? "PayPal" : "Stripe") + "</p></div>" +
      '<div class="btn-row"><a class="btn ghost" href="#/orders">返回</a><button class="btn" type="submit">保存</button></div></div>' +
      '<dl class="kv"><dt>客户</dt><dd>' + esc(o.customer) + "</dd><dt>邮箱</dt><dd>" + esc(o.email) + "</dd><dt>国家</dt><dd>" + esc(o.country) + "</dd><dt>金额</dt><dd>" + money(o.total) + "</dd></dl>" +
      '<table><thead><tr><th>商品</th><th>单价</th><th>数量</th><th>小计</th></tr></thead><tbody>' + items + "</tbody></table>" +
      '<div class="form-grid" style="margin-top:16px;">' +
        '<div class="field"><label>状态</label><select name="status">' + options + "</select></div>" +
        '<div class="field"><label>物流单号</label><input name="tracking" value="' + esc(o.tracking || "") + '"></div>' +
        '<div class="field span-2"><label>内部备注</label><textarea name="note">' + esc(o.note || "") + "</textarea></div>" +
      "</div></form>";
  }

  function renderInquiries(params) {
    var filter = params.get("status") || "";
    var tabs = '<div class="filters">' + ["", "new", "quoted", "closed"].map(function (key) {
      var label = key ? INQ_STATUS[key] : "全部";
      return '<a class="' + (filter === key ? "on" : "") + '" href="#/inquiries' + (key ? "?status=" + key : "") + '">' + label + "</a>";
    }).join("") + "</div>";
    var rows = FeiheStore.inquiries().filter(function (q) { return !filter || q.status === filter; }).map(function (q) {
      var search = (q.id + " " + q.name + " " + q.company + " " + q.country + " " + q.email).toLowerCase();
      return '<tr data-search="' + esc(search) + '"><td><a class="linkish" href="#/inquiries/' + esc(q.id) + '">' + esc(q.id) + '</a><div class="muted">' + fmt(q.createdAt) + "</div></td>" +
        "<td>" + esc(q.name) + '<div class="muted">' + esc(q.company || q.country) + "</div></td>" +
        "<td>" + esc(productName(q.product)) + '<div class="muted">' + esc(QTY[q.quantity] || q.quantity) + "</div></td>" +
        "<td>" + statusTag(INQ_STATUS, q.status) + "</td>" +
        '<td><a class="btn ghost sm" href="#/inquiries/' + esc(q.id) + '">处理</a></td></tr>';
    }).join("") || '<tr><td colspan="5" class="empty">没有询盘</td></tr>';
    return '<div class="toolbar">' + tabs + '<input id="listSearch" type="search" placeholder="搜索公司或联系人"></div>' +
      '<section class="card" style="padding:8px 12px;"><table><thead><tr><th>编号</th><th>联系人</th><th>需求</th><th>状态</th><th></th></tr></thead><tbody>' + rows + "</tbody></table></section>";
  }

  function renderInquiryDetail(id) {
    var q = FeiheStore.inquiries().find(function (row) { return row.id === id; });
    if (!q) return '<p class="empty">找不到这条询盘</p>';
    var options = Object.keys(INQ_STATUS).map(function (key) {
      return '<option value="' + key + '"' + (q.status === key ? " selected" : "") + ">" + INQ_STATUS[key] + "</option>";
    }).join("");
    return '<form id="inquiryForm" class="card">' +
      '<input type="hidden" name="id" value="' + esc(q.id) + '">' +
      '<div class="detail-head"><div><h2>' + esc(q.company || q.name) + '</h2><p class="muted">' + esc(q.id) + " · " + fmt(q.createdAt) + "</p></div>" +
      '<div class="btn-row"><a class="btn ghost" href="#/inquiries">返回</a><button class="btn" type="submit">保存</button></div></div>' +
      '<dl class="kv"><dt>联系人</dt><dd>' + esc(q.name) + "</dd><dt>公司</dt><dd>" + esc(q.company || "—") + "</dd><dt>邮箱</dt><dd><a href=\"mailto:" + esc(q.email) + '">' + esc(q.email) + "</a></dd><dt>国家</dt><dd>" + esc(q.country) + "</dd><dt>型号</dt><dd>" + esc(productName(q.product)) + "</dd><dt>数量</dt><dd>" + esc(QTY[q.quantity] || q.quantity) + "</dd></dl>" +
      '<div class="note-box">' + esc(q.message) + "</div>" +
      '<div class="form-grid" style="margin-top:16px;">' +
        '<div class="field"><label>状态</label><select name="status">' + options + "</select></div>" +
        '<div class="field span-2"><label>报价备注</label><textarea name="note">' + esc(q.note || "") + "</textarea></div>" +
      "</div></form>";
  }

  function renderMessages() {
    var rows = FeiheStore.messages().map(function (m) {
      var search = (m.name + " " + m.email + " " + m.subject).toLowerCase();
      return '<tr data-search="' + esc(search) + '"><td>' + statusTag(MSG_STATUS, m.status) + "</td>" +
        '<td><a class="linkish" href="#/messages/' + esc(m.id) + '">' + esc(m.subject) + '</a><div class="muted">' + esc(m.name) + " · " + fmt(m.createdAt) + "</div></td>" +
        "<td>" + esc(m.email) + "</td></tr>";
    }).join("") || '<tr><td colspan="3" class="empty">还没有留言</td></tr>';
    return '<div class="toolbar"><input id="listSearch" type="search" placeholder="搜索姓名、邮箱或主题"></div>' +
      '<section class="card" style="padding:8px 12px;"><table><thead><tr><th>状态</th><th>主题</th><th>邮箱</th></tr></thead><tbody>' + rows + "</tbody></table></section>";
  }

  function renderMessageDetail(id) {
    var m = FeiheStore.messages().find(function (row) { return row.id === id; });
    if (!m) return '<p class="empty">找不到这条留言</p>';
    var options = Object.keys(MSG_STATUS).map(function (key) {
      return '<option value="' + key + '"' + (m.status === key ? " selected" : "") + ">" + MSG_STATUS[key] + "</option>";
    }).join("");
    return '<form id="messageForm" class="card">' +
      '<input type="hidden" name="id" value="' + esc(m.id) + '">' +
      '<div class="detail-head"><div><h2>' + esc(m.subject) + '</h2><p class="muted">' + esc(m.name) + " · " + fmt(m.createdAt) + "</p></div>" +
      '<div class="btn-row"><a class="btn ghost" href="#/messages">返回</a><button class="btn" type="submit">保存</button></div></div>' +
      '<dl class="kv"><dt>邮箱</dt><dd><a href="mailto:' + esc(m.email) + '">' + esc(m.email) + "</a></dd></dl>" +
      '<div class="note-box">' + esc(m.message) + "</div>" +
      '<div class="form-grid" style="margin-top:16px;">' +
        '<div class="field"><label>状态</label><select name="status">' + options + "</select></div>" +
        '<div class="field span-2"><label>跟进备注</label><textarea name="note">' + esc(m.note || "") + "</textarea></div>" +
      "</div></form>";
  }

  function newsHref(item) {
    if (item.builtin) return "../news/" + item.slug;
    return "../news/post.html?id=" + encodeURIComponent(item.id);
  }

  function renderNews() {
    var rows = FeiheStore.news().map(function (n) {
      return "<tr><td><strong>" + esc(n.title) + '</strong><div class="muted">' + esc(n.date) + " · " + esc(n.category) + "</div></td>" +
        "<td>" + (n.published ? '<span class="tag green">已发布</span>' : '<span class="tag gray">未发布</span>') + "</td>" +
        '<td class="btn-row"><a class="btn ghost sm" href="#/news/' + esc(n.id) + '">编辑</a><a class="btn ghost sm" href="' + esc(newsHref(n)) + '" target="_blank" rel="noopener">查看</a></td></tr>';
    }).join("");
    return '<div class="toolbar"><div class="spacer"><a class="btn" href="#/news/new">写新闻</a></div></div>' +
      '<section class="card" style="padding:8px 12px;"><table><thead><tr><th>标题</th><th>状态</th><th></th></tr></thead><tbody>' + rows + "</tbody></table></section>";
  }

  function renderNewsForm(id) {
    var creating = id === "new";
    var n = creating ? { id: "", title: "", date: new Date().toISOString().slice(0, 10), category: "Company News", excerpt: "", body: "", image: NEWS_IMAGES[0], published: true, builtin: false } :
      FeiheStore.news().find(function (row) { return row.id === id; });
    if (!n) return '<p class="empty">找不到这篇新闻</p>';
    return '<form id="newsForm" class="card">' +
      '<input type="hidden" name="mode" value="' + (creating ? "create" : "edit") + '">' +
      '<input type="hidden" name="id" value="' + esc(n.id) + '">' +
      '<div class="detail-head"><div><h2>' + (creating ? "新文章" : "编辑文章") + '</h2><p class="muted">' + (n.builtin ? "站内原有文章的正文在 HTML 文件里。这里改标题、摘要、日期和发布状态，列表页会同步。" : "新文章会显示在首页和新闻列表，点进去阅读全文。") + "</p></div>" +
      '<div class="btn-row"><a class="btn ghost" href="#/news">返回</a><button class="btn" type="submit">保存</button></div></div>' +
      '<div class="form-error" id="formError"></div>' +
      '<div class="field"><label>标题</label><input name="title" value="' + esc(n.title) + '" required></div>' +
      '<div class="form-grid">' +
        '<div class="field"><label>日期</label><input name="date" type="date" value="' + esc(n.date) + '"></div>' +
        '<div class="field"><label>分类</label><input name="category" value="' + esc(n.category) + '"></div>' +
      "</div>" +
      '<div class="field"><label>摘要</label><textarea name="excerpt">' + esc(n.excerpt) + "</textarea></div>" +
      (n.builtin ? "" : '<div class="field"><label>正文</label><textarea name="body" style="min-height:180px;">' + esc(n.body || "") + "</textarea></div>") +
      '<div class="field"><label>封面</label><select name="image">' + imageOptions(n.image, NEWS_IMAGES) + "</select></div>" +
      '<div class="field"><label class="check"><input type="checkbox" name="published"' + (n.published ? " checked" : "") + "> 发布到前台</label></div>" +
      (creating ? "" : '<button class="btn danger sm" type="button" data-action="delete-news" data-id="' + esc(n.id) + '">' + (n.builtin ? "取消发布" : "删除文章") + "</button>") +
    "</form>";
  }

  function renderSettings() {
    return '<section class="card"><h2>数据</h2><p class="muted" style="margin-bottom:14px;">商品、订单、询盘、留言和新闻都存在当前浏览器的本地存储里。换一台电脑或清除站点数据后需要重新导入。</p>' +
      '<div class="btn-row">' +
        '<button class="btn" type="button" data-action="export">导出 JSON</button>' +
        '<label class="btn ghost">导入 JSON<input id="importFile" type="file" accept="application/json" hidden></label>' +
        '<button class="btn danger" type="button" data-action="reset">恢复演示数据</button>' +
      "</div></section>" +
      '<section class="card"><h2>账号</h2><p>当前是演示登录，账号 admin，密码 feihe2026。适合本机预览，上线前要换成服务端账号。</p></section>';
  }

  function render() {
    if (!authed()) {
      pageName = "login";
      renderLogin();
      return;
    }
    var route = parseHash();
    if (route.page === "login") {
      location.hash = "#/dashboard";
      return;
    }
    pageName = route.page;
    var title = { dashboard: "概览", products: "商品", orders: "订单", inquiries: "询盘", messages: "留言", news: "新闻", settings: "设置" }[route.page] || "后台";
    var body = "";
    if (route.page === "dashboard") body = renderDashboard();
    else if (route.page === "products" && route.id) { title = route.id === "new" ? "新增商品" : "编辑商品"; body = renderProductForm(route.id); }
    else if (route.page === "products") body = renderProducts();
    else if (route.page === "orders" && route.id) { title = "订单详情"; body = renderOrderDetail(route.id); }
    else if (route.page === "orders") body = renderOrders(route.params);
    else if (route.page === "inquiries" && route.id) { title = "询盘详情"; body = renderInquiryDetail(route.id); }
    else if (route.page === "inquiries") body = renderInquiries(route.params);
    else if (route.page === "messages" && route.id) { title = "留言详情"; body = renderMessageDetail(route.id); }
    else if (route.page === "messages") body = renderMessages();
    else if (route.page === "news" && route.id) { title = route.id === "new" ? "写新闻" : "编辑新闻"; body = renderNewsForm(route.id); }
    else if (route.page === "news") body = renderNews();
    else if (route.page === "settings") body = renderSettings();
    else body = '<p class="empty">没有这个页面</p>';
    shell(title, body);
  }

  function formError(message) {
    var el = document.getElementById("formError");
    if (!el) { toast(message); return; }
    el.textContent = message;
    el.classList.add("show");
  }

  app.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form || form.tagName !== "FORM") return;
    var formId = form.getAttribute("id");
    if (formId === "loginForm") {
      e.preventDefault();
      var fd = new FormData(form);
      if (fd.get("user") === USER && fd.get("pass") === PASS) {
        sessionStorage.setItem(SESSION, "1");
        location.hash = "#/dashboard";
        render();
      } else {
        var err = document.getElementById("loginError");
        if (err) err.classList.add("show");
      }
      return;
    }
    if (formId === "productForm") {
      e.preventDefault();
      var data = Object.fromEntries(new FormData(form).entries());
      data.featured = !!form.querySelector("[name=featured]").checked;
      try {
        if (data.mode === "create") FeiheStore.addProduct(data);
        else FeiheStore.updateProduct(data.id, data);
        toast("商品已保存");
        location.hash = "#/products";
      } catch (err) { formError(err.message); }
      return;
    }
    if (formId === "orderForm") {
      e.preventDefault();
      var order = Object.fromEntries(new FormData(form).entries());
      FeiheStore.updateOrder(order.id, { status: order.status, tracking: order.tracking, note: order.note });
      toast("订单已保存");
      render();
      return;
    }
    if (formId === "inquiryForm") {
      e.preventDefault();
      var inquiry = Object.fromEntries(new FormData(form).entries());
      FeiheStore.updateInquiry(inquiry.id, { status: inquiry.status, note: inquiry.note });
      toast("询盘已保存");
      render();
      return;
    }
    if (formId === "messageForm") {
      e.preventDefault();
      var message = Object.fromEntries(new FormData(form).entries());
      FeiheStore.updateMessage(message.id, { status: message.status, note: message.note });
      toast("留言已保存");
      render();
      return;
    }
    if (formId === "newsForm") {
      e.preventDefault();
      var news = Object.fromEntries(new FormData(form).entries());
      news.published = !!form.querySelector("[name=published]").checked;
      try {
        if (news.mode === "create") FeiheStore.addNews(news);
        else FeiheStore.updateNews(news.id, news);
        toast("新闻已保存");
        location.hash = "#/news";
      } catch (err) { formError(err.message); }
    }
  });

  app.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action]");
    if (e.target.id === "menuBtn" || (btn && btn.id === "menuBtn")) {
      document.getElementById("sidebar").classList.toggle("open");
      document.getElementById("backdrop").classList.toggle("show");
      return;
    }
    if (e.target.id === "backdrop") {
      document.getElementById("sidebar").classList.remove("open");
      e.target.classList.remove("show");
      return;
    }
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    var id = btn.getAttribute("data-id");
    if (action === "logout") {
      sessionStorage.removeItem(SESSION);
      location.hash = "#/login";
      render();
    } else if (action === "delete-product") {
      var builtin = FeiheStore.products().some(function (p) { return p.id === id && p.builtin; });
      if (!confirm(builtin ? "下架后前台不再展示这个型号。" : "删除后前台不再展示这个商品。")) return;
      FeiheStore.removeProduct(id);
      toast(builtin ? "已下架" : "已删除");
      location.hash = "#/products";
    } else if (action === "delete-news") {
      if (!confirm("确定要处理这篇文章吗？")) return;
      FeiheStore.removeNews(id);
      toast("已更新");
      location.hash = "#/news";
    } else if (action === "export") {
      var blob = new Blob([FeiheStore.exportJSON()], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "feihe-admin.json";
      a.click();
      URL.revokeObjectURL(a.href);
    } else if (action === "reset") {
      if (!confirm("恢复演示数据会覆盖你在这台浏览器里改过的商品、订单和询盘。")) return;
      FeiheStore.reset();
      toast("已恢复演示数据");
      render();
    }
  });

  function applyListFilters() {
    var search = document.getElementById("listSearch");
    var catEl = document.getElementById("catFilter");
    var q = search ? search.value.trim().toLowerCase() : "";
    var cat = catEl ? catEl.value : "";
    document.querySelectorAll("tbody tr[data-search]").forEach(function (row) {
      var textOk = !q || row.getAttribute("data-search").indexOf(q) !== -1;
      var catOk = !cat || row.getAttribute("data-cat") === cat;
      row.hidden = !(textOk && catOk);
    });
  }

  app.addEventListener("input", function (e) {
    if (e.target.id === "listSearch") applyListFilters();
  });

  app.addEventListener("change", function (e) {
    if (e.target.id === "catFilter") applyListFilters();
    if (e.target.id === "importFile" && e.target.files[0]) {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function () {
        try {
          FeiheStore.importJSON(String(reader.result));
          toast("导入完成");
          render();
        } catch (err) {
          toast(err.message || "导入失败");
        }
      };
      reader.readAsText(file);
    }
  });

  window.addEventListener("hashchange", render);
  if (!location.hash) location.hash = authed() ? "#/dashboard" : "#/login";
  render();
})();
