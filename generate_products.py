# -*- coding: utf-8 -*-
"""Generate the remaining 5 Feihe product detail pages from a shared template."""
import io, os, json

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "products")

# Per-product custom sections -------------------------------------------
SELLPOINTS = {
"FH-27M4K": """
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg></div>
          <div><h3>True 4K, Truly Sharp</h3><p>Four times the pixels of Full HD on a 27-inch canvas: text is crisp, gradients are smooth, and 150% more screen real estate means fewer windows shuffling all day.</p></div>
        </div>
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="10"/></svg></div>
          <div><h3>Color You Can Trust</h3><p>99% sRGB coverage and factory calibration make this panel a dependable choice for design work, photo editing and content review — without the pro-monitor price.</p></div>
        </div>
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
          <div><h3>One Cable Does It All</h3><p>USB-C delivers 65 W of power, video and data over a single cable — connect a modern laptop and your desk stays clean. HDMI 2.0 and DisplayPort cover everything else.</p></div>
        </div>""",
"FH-22DTV": """
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg></div>
          <div><h3>Every EU Broadcast, Out of the Box</h3><p>Triple tuners cover DVB-T2 terrestrial, DVB-S2 satellite and DVB-C cable. Plug in an antenna or dish and you're watching free-to-air channels in minutes — no set-top box needed.</p></div>
        </div>
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></div>
          <div><h3>Pause and Record Live TV</h3><p>Plug a USB drive into the PVR port to record broadcasts or pause live TV — perfect for small apartments, guest rooms and holiday rentals.</p></div>
        </div>
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4"/></svg></div>
          <div><h3>Media Player Built In</h3><p>Play movies, photos and music straight from USB in MKV, MP4, JPEG and MP3 formats. HDMI and VGA inputs hook up consoles, laptops and legacy devices.</p></div>
        </div>""",
"FH-24M100": """
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
          <div><h3>100Hz That Feels Instant</h3><p>Double the refresh rate of standard office monitors, paired with a 1 ms MPRT response time. Scrolling, spreadsheets and casual gaming all feel noticeably smoother.</p></div>
        </div>
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
          <div><h3>Easy on the Eyes</h3><p>Flicker-free backlight, low blue light mode and an anti-glare matte coating keep long working sessions comfortable — certified for TÜV-grade eye comfort testing.</p></div>
        </div>
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg></div>
          <div><h3>Play Without Tearing</h3><p>AMD FreeSync synchronizes the panel with your graphics card over HDMI, eliminating stutter and screen tear in games — at a price that leaves room in the budget.</p></div>
        </div>""",
"FH-195STV": """
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg></div>
          <div><h3>Fits Where Others Can't</h3><p>At 19.5 inches with a slim 8.9 mm frame, this TV slips onto kitchen counters, dorm desks, campers and caravan walls where a 24-inch simply won't fit.</p></div>
        </div>
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/></svg></div>
          <div><h3>Android 11, Ready to Stream</h3><p>YouTube, Prime Video and a full app store come pre-installed. Cast from your phone over dual-band Wi-Fi and the built-in speakers handle casual viewing well.</p></div>
        </div>
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
          <div><h3>Built for the Road</h3><p>A 12 V DC input means it runs from car batteries, solar setups and boats with a simple adapter — a favorite of RV owners and van converters on both continents.</p></div>
        </div>""",
"FH-27MQHD": """
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
          <div><h3>Delta E Below 2, Verified</h3><p>Every unit is factory-calibrated to a Delta E under 2 with 100% sRGB coverage. What you see on screen is what your printer, client and audience will see.</p></div>
        </div>
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6M3 2v6h6M3 12a9 9 0 0 0 15 6.7L21 16M3 12a9 9 0 0 1 15-6.7L21 8"/></svg></div>
          <div><h3>Pivot, Swivel, Adjust</h3><p>The ergonomic stand rotates 90° to portrait for coding and long documents, tilts, swivels and adjusts in height — or drop it on any VESA 100 arm.</p></div>
        </div>
        <div class="sellpoint">
          <div class="adv-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg></div>
          <div><h3>90W Power Delivery</h3><p>USB-C pushes up to 90 W to power even 16-inch professional laptops while displaying video — one cable, zero docks, a genuinely tidy desk.</p></div>
        </div>""",
}

SPEC_ROWS = {
"FH-27M4K": [
    ("Panel size", "27″ diagonal (27″ class)"),
    ("Panel type", "IPS, frameless design (3 sides)"),
    ("Resolution", "3840 × 2160 (4K UHD)"),
    ("Refresh rate", "60 Hz"),
    ("Color coverage", "99% sRGB · 8-bit + FRC (1.07B colors)"),
    ("Brightness", "350 cd/m² typical"),
    ("Ports", "1 × USB-C (DP Alt Mode, 65 W PD) · 2 × HDMI 2.0 · 1 × DisplayPort 1.2 · 1 × USB-B · 2 × USB-A hub · 3.5 mm audio out"),
    ("Ergonomics", "Height adjustable 130 mm · tilt −5°/+15° · swivel ±45° · pivot"),
    ("VESA mount", "100 × 100 mm"),
    ("Power", "AC 100–240 V · max 55 W · standby &lt; 0.5 W"),
    ("Dimensions (with stand)", "612 × 400 × 200 mm"),
    ("Weight", "5.2 kg with stand · 4.3 kg without stand"),
    ("Box contents", "Monitor, stand, USB-C cable, DisplayPort cable, power cord, quick-start guide"),
],
"FH-22DTV": [
    ("Panel size", "21.5″ diagonal (22″ class)"),
    ("Panel type", "VA, slim bezel"),
    ("Resolution", "1920 × 1080 (Full HD)"),
    ("Refresh rate", "60 Hz"),
    ("Tuners", "DVB-T2/T · DVB-S2/S · DVB-C (triple tuner)"),
    ("CI/CI+", "CI+ 1.4 slot for subscription cards"),
    ("PVR", "Record and pause live TV via USB storage (FAT32/NTFS)"),
    ("Media player", "USB playback: MKV, MP4, AVI, JPEG, MP3"),
    ("Ports", "2 × HDMI 1.4 · 1 × USB 2.0 · CI+ slot · VGA · LAN · coaxial out · 3.5 mm headphone"),
    ("Speakers", "2 × 5 W"),
    ("Teletext / EPG", "Yes · 7-day electronic program guide"),
    ("VESA mount", "100 × 100 mm"),
    ("Power", "AC 100–240 V · max 30 W · standby &lt; 0.5 W"),
    ("Dimensions (with stand)", "505 × 340 × 140 mm"),
    ("Weight", "2.9 kg with stand · 2.4 kg without stand"),
    ("Box contents", "TV, remote control, stand base, power cord, quick-start guide"),
],
"FH-24M100": [
    ("Panel size", "23.8″ diagonal (24″ class)"),
    ("Panel type", "IPS, anti-glare matte coating"),
    ("Resolution", "1920 × 1080 (Full HD)"),
    ("Refresh rate", "100 Hz (native)"),
    ("Response time", "1 ms MPRT"),
    ("Adaptive sync", "AMD FreeSync (48–100 Hz)"),
    ("Color coverage", "99% sRGB"),
    ("Brightness", "300 cd/m² typical"),
    ("Ports", "1 × HDMI 1.4 · 1 × VGA · 3.5 mm audio out"),
    ("Eye comfort", "Flicker-free · low blue light mode"),
    ("Ergonomics", "Tilt −5°/+20° · VESA compatible"),
    ("VESA mount", "100 × 100 mm"),
    ("Power", "AC 100–240 V · max 30 W · standby &lt; 0.5 W"),
    ("Dimensions (with stand)", "540 × 400 × 180 mm"),
    ("Weight", "3.6 kg with stand"),
    ("Box contents", "Monitor, stand, HDMI cable, power cord, quick-start guide"),
],
"FH-195STV": [
    ("Panel size", "18.5″ diagonal (19.5″ class)"),
    ("Panel type", "TN film, slim frame"),
    ("Resolution", "1366 × 768 (HD)"),
    ("Refresh rate", "60 Hz"),
    ("Operating system", "Android 11"),
    ("Wireless", "Wi-Fi dual-band (2.4/5 GHz) · Bluetooth 4.2"),
    ("Tuners (region option)", "EU: DVB-T2/T/C · US: ATSC/NTSC"),
    ("Ports", "2 × HDMI 1.4 · 1 × USB 2.0 · CI+ slot · coaxial out · 3.5 mm headphone"),
    ("Speakers", "2 × 3 W"),
    ("DC input", "12 V DC · car/solar adapter compatible"),
    ("VESA mount", "75 × 75 mm"),
    ("Power", "AC 100–240 V via adapter · max 20 W · standby &lt; 0.5 W"),
    ("Dimensions (with stand)", "446 × 300 × 130 mm"),
    ("Weight", "2.2 kg with stand"),
    ("Box contents", "TV, remote control, stand base, AC adapter, quick-start guide"),
],
"FH-27MQHD": [
    ("Panel size", "27″ diagonal (27″ class)"),
    ("Panel type", "IPS, frameless design (3 sides)"),
    ("Resolution", "2560 × 1440 (QHD)"),
    ("Refresh rate", "75 Hz"),
    ("Color coverage", "100% sRGB · factory calibrated ΔE &lt; 2"),
    ("Brightness", "350 cd/m² typical"),
    ("Ports", "1 × USB-C (DP Alt Mode, 90 W PD) · 2 × HDMI 1.4 · 1 × DisplayPort 1.2 · 2 × USB-A hub · 3.5 mm audio out"),
    ("Ergonomics", "Height adjustable 120 mm · tilt −5°/+20° · swivel ±45° · pivot 90°"),
    ("VESA mount", "100 × 100 mm"),
    ("Power", "AC 100–240 V · max 130 W (incl. PD) · standby &lt; 0.5 W"),
    ("Dimensions (with stand)", "612 × 420 × 220 mm"),
    ("Weight", "5.8 kg with stand"),
    ("Box contents", "Monitor, stand, USB-C cable, HDMI cable, power cord, quick-start guide"),
],
}

FAQ = {
"FH-27M4K": [
    ("Does the USB-C port charge my laptop?", "Yes. The USB-C port supports DisplayPort Alt Mode with 65 W power delivery, so most 13–14 inch laptops run and charge from a single cable. Larger gaming laptops may need their own charger."),
    ("Is this monitor good for photo editing?", "With 99% sRGB coverage and a factory calibration target, the FH-27M4K is well suited for web-standard photo and design work. It covers sRGB, not wide-gamut Adobe RGB or DCI-P3."),
    ("What is the difference between this and the 27″ QHD Pro model?", "The FH-27M4K offers 4K resolution with 65 W USB-C; the FH-27MQHD offers QHD with a fully calibrated panel (ΔE < 2), 90 W USB-C and a pivot stand. Choose 4K for media and detail work, QHD Pro for color-critical design."),
],
"FH-22DTV": [
    ("Do I need a set-top box or satellite receiver?", "No. The FH-22DTV has DVB-T2/T, DVB-S2/S and DVB-C tuners built in. Connect a terrestrial antenna, satellite dish or cable feed directly and run a channel scan."),
    ("Can I record TV shows?", "Yes. Plug any USB drive (FAT32 or NTFS) into the USB port and use the PVR function to record broadcasts or pause and rewind live TV."),
    ("Is this TV suitable for hotel or rental use?", "Absolutely — it's one of our most popular B2B models. Custom boot logo, channel presets and packaged remotes are available for OEM orders of 500 units or more."),
],
"FH-24M100": [
    ("Is 100Hz enough for gaming?", "For casual and esports-style titles on integrated or mid-range graphics, 100 Hz with 1 ms MPRT and FreeSync delivers a visibly smoother experience than 60 Hz. Competitive high-FPS players may prefer a 144 Hz+ panel."),
    ("Does it have built-in speakers?", "The FH-24M100 outputs audio through the 3.5 mm jack for headphones or external speakers; it keeps cost and weight down by omitting onboard speakers."),
    ("Can I connect an older PC with VGA?", "Yes. A dedicated VGA port supports legacy office desktops, POS terminals and industrial PCs alongside the HDMI input."),
],
"FH-195STV": [
    ("Will this work on 12 V power in a camper or boat?", "Yes. The FH-195STV accepts a 12 V DC input directly, so it runs from car batteries, solar setups and marine systems with the included adapter or any regulated 12 V source."),
    ("Which streaming apps are supported?", "YouTube and Prime Video come pre-installed, and the Android 11 app store gives access to thousands more. Availability of specific apps can vary by region and account."),
    ("Is 1366×768 resolution enough?", "For a screen this size — typically watched from 1–2 meters — HD resolution looks clean and keeps power draw low. If you want Full HD, see the 22″ or 24″ models."),
],
"FH-27MQHD": [
    ("What does ΔE < 2 mean?", "Delta E measures how far a displayed color drifts from its intended value. A Delta E below 2 is the threshold where trained eyes stop noticing color error — the standard for professional design and print work."),
    ("Can I use it in portrait orientation?", "Yes. The stand pivots 90° into portrait mode, and the height, tilt and swivel all remain adjustable. It also fits any VESA 100 × 100 mm monitor arm."),
    ("Will USB-C work with a MacBook?", "Yes. USB-C DisplayPort Alt Mode with 90 W power delivery charges and displays from MacBook Pro/Air models and most USB-C laptops over a single cable."),
],
}

# Product records --------------------------------------------------------
PRODUCTS = [
 dict(sku="FH-27M4K", slug="27-4k-monitor", img="product-27-4k-monitor.svg",
      title="27\" 4K UHD Monitor USB-C | Feihe",
      desc="Feihe 27-inch 4K UHD monitor with 99% sRGB, USB-C 65W power delivery and height-adjustable stand. In stock at $219 — factory-direct from Feihe.",
      h1="27″ 4K UHD Monitor — USB-C 65W, 99% sRGB",
      cat="MONITOR", price="219.00", stock="In Stock", stockcls="stock",
      stockline="<span class=\"stock\">In Stock</span> — ships within 48 hours from EU or US warehouse",
      bullets=["3840 × 2160 4K IPS panel with 99% sRGB coverage",
               "USB-C with 65 W power delivery — one cable for laptop, video and charge",
               "HDMI 2.0 + DisplayPort 1.2 for consoles and desktops",
               "Height-adjustable, tilt and swivel stand; VESA 100 ready"],
      jsonld_title="27\" 4K UHD Monitor — USB-C 65W, 99% sRGB",
      jsonld_desc="A 27-inch 4K UHD IPS monitor with 99% sRGB coverage, USB-C 65 W power delivery, HDMI and DisplayPort inputs and an ergonomic height-adjustable stand.",
      rating="4.9", reviews="87"),
 dict(sku="FH-22DTV", slug="22-digital-tv", img="product-22-digital-tv.svg",
      title="22\" Digital TV DVB-T2/S2/C | Feihe",
      desc="Feihe 22-inch digital TV with DVB-T2/S2/C triple tuners, PVR recording and Full HD VA panel. Perfect for EU free-to-air broadcast. $109, in stock.",
      h1="22″ Digital TV — DVB-T2/S2/C Triple Tuner",
      cat="DIGITAL TV", price="109.00", stock="In Stock", stockcls="stock",
      stockline="<span class=\"stock\">In Stock</span> — ships within 48 hours from EU warehouse",
      bullets=["Triple tuner: DVB-T2 terrestrial, DVB-S2 satellite, DVB-C cable",
               "Record and pause live TV with PVR over USB",
               "Full HD 1920×1080 slim-bezel VA panel",
               "CI+ slot for subscription cards; 7-day EPG"],
      jsonld_title="22\" Digital TV — DVB-T2/S2/C Triple Tuner",
      jsonld_desc="A 21.5-inch Full HD digital TV with DVB-T2/T, DVB-S2/S and DVB-C triple tuners, CI+ slot, USB PVR recording and a slim-bezel VA panel.",
      rating="4.7", reviews="214"),
 dict(sku="FH-24M100", slug="24-monitor", img="product-24-monitor.svg",
      title="24\" 100Hz IPS Monitor 1ms | Feihe",
      desc="Feihe 24-inch 100Hz IPS monitor with 1ms MPRT, AMD FreeSync and flicker-free eye comfort. HDMI + VGA. A smooth upgrade for home and office at $129.",
      h1="24″ 100Hz IPS Monitor — 1ms MPRT, FreeSync",
      cat="MONITOR", price="129.00", stock="In Stock", stockcls="stock",
      stockline="<span class=\"stock\">In Stock</span> — ships within 48 hours from EU or US warehouse",
      bullets=["100 Hz refresh with 1 ms MPRT response — noticeably smoother",
               "AMD FreeSync eliminates tearing in games",
               "Flicker-free, low blue light IPS panel, 99% sRGB",
               "HDMI + VGA inputs for new and legacy hardware"],
      jsonld_title="24\" 100Hz IPS Monitor — 1ms MPRT, FreeSync",
      jsonld_desc="A 23.8-inch Full HD IPS monitor with 100 Hz refresh rate, 1 ms MPRT response, AMD FreeSync, flicker-free backlight and both HDMI and VGA inputs.",
      rating="4.8", reviews="156"),
 dict(sku="FH-195STV", slug="19-smart-tv", img="product-19-smart-tv.svg",
      title="19.5\" HD Smart TV Android 11 | Feihe",
      desc="Feihe 19.5-inch compact smart TV with Android 11, YouTube built in, dual HDMI and 12V DC input for campers. The perfect kitchen and bedroom TV at $99.",
      h1="19.5″ HD Smart TV — Compact Android 11",
      cat="SMART TV", price="99.00", stock="In Stock", stockcls="stock",
      stockline="<span class=\"stock\">In Stock</span> — ships within 48 hours from EU or US warehouse",
      bullets=["Compact 19.5″ frame fits kitchens, dorms and RVs",
               "Android 11 with YouTube and Prime Video pre-installed",
               "12 V DC input — ideal for campers, boats and vans",
               "Dual HDMI, USB media playback and Wi-Fi dual-band"],
      jsonld_title="19.5\" HD Smart TV — Compact Android 11",
      jsonld_desc="A 19.5-inch HD smart TV running Android 11 with YouTube and Prime Video pre-installed, dual-band Wi-Fi, dual HDMI inputs and a 12 V DC input for mobile use.",
      rating="4.6", reviews="98"),
 dict(sku="FH-27MQHD", slug="27-qhd-monitor", img="product-27-qhd-monitor.svg",
      title="27\" QHD Pro Monitor USB-C | Feihe",
      desc="Feihe 27-inch QHD professional monitor, factory calibrated to Delta E under 2 with 100% sRGB, USB-C 90W and pivot stand. Built for color-critical work. $249.",
      h1="27″ QHD Pro Monitor — 100% sRGB, USB-C 90W",
      cat="MONITOR", price="249.00", stock="Low Stock", stockcls="stock low",
      stockline="<span class=\"stock low\">Low Stock</span> — order now, next batch ships in 10 days",
      bullets=["2560 × 1440 QHD IPS, factory calibrated to ΔE &lt; 2",
               "100% sRGB coverage for design, print and photography",
               "USB-C 90 W power delivery — one cable for pro laptops",
               "Pivot to portrait, height/tilt/swivel ergonomic stand"],
      jsonld_title="27\" QHD Pro Monitor — 100% sRGB, USB-C 90W",
      jsonld_desc="A 27-inch QHD professional IPS monitor factory calibrated to Delta E under 2 with 100% sRGB coverage, USB-C 90 W power delivery and a pivot-capable ergonomic stand.",
      rating="4.9", reviews="64"),
]

ALL = {
 "FH-24STV": dict(name="24″ Smart TV with Google TV — FHD Frameless", price=139.00, img="product-24-smart-tv.svg", slug="24-smart-tv", cat="Smart TV"),
 "FH-27M4K": dict(name="27″ 4K UHD Monitor — USB-C 65W, 99% sRGB", price=219.00, img="product-27-4k-monitor.svg", slug="27-4k-monitor", cat="Monitor"),
 "FH-22DTV": dict(name="22″ Digital TV — DVB-T2/S2/C Triple Tuner", price=109.00, img="product-22-digital-tv.svg", slug="22-digital-tv", cat="Digital TV"),
 "FH-24M100": dict(name="24″ 100Hz IPS Monitor — 1ms MPRT, FreeSync", price=129.00, img="product-24-monitor.svg", slug="24-monitor", cat="Monitor"),
 "FH-195STV": dict(name="19.5″ HD Smart TV — Compact Android 11", price=99.00, img="product-19-smart-tv.svg", slug="19-smart-tv", cat="Smart TV"),
 "FH-27MQHD": dict(name="27″ QHD Pro Monitor — 100% sRGB, USB-C 90W", price=249.00, img="product-27-qhd-monitor.svg", slug="27-qhd-monitor", cat="Monitor"),
}

TEMPLATE = io.open(os.path.join(BASE, "products", "24-smart-tv.html"), encoding="utf-8").read()

def specs_html(rows):
    return "\n".join('          <tr><th>%s</th><td>%s</td></tr>' % r for r in rows)

def faq_html(pairs):
    return "\n".join(
        '      <details>\n        <summary>%s</summary>\n        <p>%s</p>\n      </details>' % p
        for p in pairs)

def faq_jsonld(pairs):
    return json.dumps({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q,
                        "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in pairs]
    }, ensure_ascii=False, indent=2)

def related_html(sku):
    items = [v for k, v in ALL.items() if k != sku][:4]
    out = []
    for p in items:
        out.append(
'        <article class="product-card">\n'
'          <a href="%s.html" class="thumb"><img src="../assets/img/%s" alt="Feihe %s" loading="lazy" width="800" height="600"></a>\n'
'          <div class="body">\n'
'            <span class="category">%s</span>\n'
'            <h3><a href="%s.html">%s</a></h3>\n'
'            <div class="price-row"><span class="price">$%.2f</span><span class="stock">In Stock</span></div>\n'
'          </div>\n'
'        </article>' % (p["slug"], p["img"], p["name"], p["cat"], p["slug"], p["name"], p["price"]))
    return "\n".join(out)

for prod in PRODUCTS:
    sku = prod["sku"]
    jtitle = prod["jsonld_title"].replace('"', '\\"')
    cat_label = {"MONITOR": "Monitor", "SMART TV": "Smart TV", "DIGITAL TV": "Digital TV"}[prod["cat"]]
    pairs = FAQ[sku]
    html = TEMPLATE
    repl = [
        ('<title>24" Smart TV Google TV FHD | Feihe FH-24STV</title>', '<title>%s</title>' % prod["title"]),
        ('content="The Feihe 24-inch smart TV runs Google TV with Netflix, YouTube and Disney+ built in. Frameless FHD IPS panel, dual-band Wi-Fi, 3× HDMI. $139, in stock."',
         'content="%s"' % prod["desc"]),
        # Product JSON-LD
        ('"name": "Feihe 24\\" Smart TV with Google TV — FHD Frameless",', '"name": "Feihe %s",' % jtitle),
        ('"description": "A 23.8-inch frameless smart TV running Google TV with FHD 1080p IPS panel, dual-band Wi-Fi, Chromecast built-in and three HDMI 2.0 ports.",',
         '"description": "%s",' % prod["jsonld_desc"]),
        ('"sku": "FH-24STV",', '"sku": "%s",' % sku),
        ('"mpn": "FH-24STV",', '"mpn": "%s",' % sku),
        ('"ratingValue": "4.8", "reviewCount": "132"', '"ratingValue": "%s", "reviewCount": "%s"' % (prod["rating"], prod["reviews"])),
        ('"url": "https://www.feihe-display.com/products/24-smart-tv.html",', '"url": "https://www.feihe-display.com/products/%s.html",' % prod["slug"]),
        ('"price": "139.00",', '"price": "%s",' % prod["price"]),
        # FAQ JSON-LD
        ('{ "@type": "Question", "name": "Does the 24\\" smart TV support Netflix and YouTube?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The TV runs Google TV with the Google Play Store pre-installed, so Netflix, YouTube, Disney+ and thousands of other apps are one click away. Some apps require your own subscription." } },\n      { "@type": "Question", "name": "Can I wall-mount this TV?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The FH-24STV has a standard VESA 100×100 mm mount pattern on the back and weighs just 3.4 kg without the stand, so any VESA-compatible bracket up to 32 inches will fit." } },\n      { "@type": "Question", "name": "Does it work in Europe and the US?", "acceptedAnswer": { "@type": "Answer", "text": "The unit ships with a multi-region power adapter (100–240 V) and dual-band Wi-Fi. EU units include a DVB-T2/T/C tuner variant; US units include an ATSC tuner variant. Choose the region at checkout or contact sales." } }',
         faf := faq_jsonld(pairs)[len('{ "mainEntity": '):] if False else faq_jsonld(pairs)),
    ]
    # The FAQ JSON-LD block differs entirely; replace the whole mainEntity array.
    import re
    m = re.search(r'("mainEntity": \[).*?(\]\s*\n  \})', html, re.S)
    array_json = json.dumps(
        [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in pairs],
        ensure_ascii=False, indent=2)
    html = html[:m.start(1)] + '"mainEntity": ' + array_json + '\n  }' + html[m.end(2):]

    for old, new in repl[:-1]:
        if old not in html:
            raise SystemExit("MISSING TOKEN in %s: %r" % (sku, old[:80]))
        html = html.replace(old, new)

    html = html.replace("?product=FH-24STV", "?product=" + sku)

    # Breadcrumb current page (HTML + JSON-LD level 3)
    html = html.replace('<li><span aria-current="page">24″ Smart TV with Google TV</span></li>',
                        '<li><span aria-current="page">%s</span></li>' % prod["jsonld_title"])
    html = html.replace('{ "@type": "ListItem", "position": 3, "name": "24\\" Smart TV with Google TV" }',
                        '{ "@type": "ListItem", "position": 3, "name": "%s" }' % jtitle)
    # Gallery images
    html = html.replace("product-24-smart-tv.svg", prod["img"])
    # Headings & info
    html = html.replace("MODEL FH-24STV · SMART TV", "MODEL %s · %s" % (sku, prod["cat"]))
    html = html.replace('<h1>24″ Smart TV with Google TV™ — FHD Frameless</h1>', '<h1>%s</h1>' % prod["h1"])
    html = html.replace("4.8 · 132 reviews", "%s · %s reviews" % (prod["rating"], prod["reviews"]))
    html = html.replace('<span class="price">$139.00</span>', '<span class="price">$%s</span>' % prod["price"])
    html = html.replace('<span class="stock">In Stock</span> — ships within 48 hours from EU or US warehouse</p>',
                        prod["stockline"] + "</p>")
    # Bullets
    old_bullets = """        <ul class="product-bullets">
          <li>Google TV with Netflix, YouTube and Disney+ ready to stream</li>
          <li>Frameless 23.8″ FHD IPS panel — vivid color from any seat</li>
          <li>Chromecast built-in, dual-band Wi-Fi and Bluetooth 5.0</li>
          <li>3× HDMI 2.0, 2× USB, CI+ slot and optical audio out</li>
        </ul>"""
    new_bullets = '        <ul class="product-bullets">\n' + "\n".join(
        '          <li>%s</li>' % b for b in prod["bullets"]) + "\n        </ul>"
    html = html.replace(old_bullets, new_bullets)
    # Cart button
    html = html.replace('data-id="FH-24STV" data-name="24″ Smart TV with Google TV — FHD Frameless" data-price="139.00"',
                        'data-id="%s" data-name="%s" data-price="%s"' % (sku, ALL[sku]["name"], prod["price"]))
    # Sellpoints
    m2 = re.search(r'<div class="grid-3">\n        <div class="sellpoint">.*?\n      </div>\n    </section>', html, re.S)
    sp = SELLPOINTS[sku].strip()
    html = html[:m2.start()] + '      <div class="grid-3">\n' + sp + '\n      </div>\n    </section>' + html[m2.end():]
    # Specs
    m3 = re.search(r'<tbody>.*?</tbody>', html, re.S)
    html = html[:m3.start()] + '<tbody>\n' + specs_html(SPEC_ROWS[sku]) + '\n        </tbody>' + html[m3.end():]
    # FAQ details
    m4 = re.search(r'(<h2>Frequently Asked Questions</h2>\n).*?(    </section>\n\n    <section class="detail-section">\n      <h2>You May Also Like</h2>)', html, re.S)
    html = html[:m4.start(2)] + '      ' + faq_html(pairs) + '\n\n' + html[m4.start(2):]
    # Related
    m5 = re.search(r'<div class="related-grid">.*?</div>\n    </section>', html, re.S)
    html = html[:m5.start()] + '<div class="related-grid">\n' + related_html(sku) + '\n      </div>\n    </section>' + html[m5.end():]

    out_path = os.path.join(OUT, prod["slug"] + ".html")
    io.open(out_path, "w", encoding="utf-8").write(html)
    print("written:", out_path)

print("done")
