#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Seed the demo content in /content.

Realistic bilingual demo data so the layouts can be judged at real density.
Everything here is editable from /admin — re-running this script overwrites
/content, so do not run it once you have started entering real work.

Run: python3 scripts/seed-content.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "content")


def L(ar, en):
    return {"ar": ar, "en": en}


def img(src, ar, en, w=1600, h=1000, caption=None):
    m = {"src": src, "kind": "image", "alt": L(ar, en), "width": w, "height": h}
    if caption:
        m["caption"] = caption
    return m


_bid = [0]


def bid():
    _bid[0] += 1
    return f"b{_bid[0]:04d}"


# --------------------------------------------------------------------------- #
# Categories                                                                   #
# --------------------------------------------------------------------------- #
CATEGORIES = [
    ("branding", "الهوية البصرية", "Branding"),
    ("graphic-design", "تصميم جرافيك", "Graphic Design"),
    ("arabic-typography", "تايبوغرافي عربي", "Arabic Typography"),
    ("fonts", "خطوط", "Fonts"),
    ("calligraphy", "خط عربي", "Calligraphy"),
    ("motion", "موشن جرافيك", "Motion Graphics"),
    ("digital", "ديجيتال", "Digital"),
    ("print", "مطبوعات", "Print"),
    ("posters", "ملصقات", "Posters"),
    ("editorial", "تصميم تحريري", "Editorial"),
    ("ui-ux", "واجهات وتجربة", "UI/UX"),
    ("art-direction", "إدارة فنية", "Art Direction"),
    ("social-media", "سوشيال ميديا", "Social Media"),
    ("packaging", "تغليف", "Packaging"),
    ("wayfinding", "أنظمة إرشاد", "Wayfinding"),
    ("other", "أخرى", "Other"),
]

categories = [
    {"slug": s, "name": L(ar, en), "order": i} for i, (s, ar, en) in enumerate(CATEGORIES)
]

# --------------------------------------------------------------------------- #
# Services                                                                     #
# --------------------------------------------------------------------------- #
SERVICES = [
    ("brand-identity", "الهوية البصرية", "Brand Identity",
     "بناء هوية متكاملة من الفكرة إلى دليل الاستخدام: الشعار، النظام اللوني، التايبوغرافي، والتطبيقات.",
     "A complete identity from concept to guidelines: mark, colour, typography and the applications that carry them.",
     [("بحث واستراتيجية بصرية", "Research & visual strategy"),
      ("شعار ونظام علامة", "Logo & mark system"),
      ("نظام تايبوغرافي عربي ولاتيني", "Arabic & Latin type system"),
      ("دليل الهوية", "Brand guidelines"),
      ("ملفات جاهزة للإنتاج", "Production-ready files")], True),
    ("logo-design", "تصميم الشعارات", "Logo Design",
     "شعار مبني على معنى، يعمل بالعربية والإنكليزية وبكل المقاسات.",
     "A mark built on meaning that holds up in Arabic and Latin, at every size.",
     [("ثلاثة اتجاهات أولية", "Three initial directions"),
      ("جولتا تعديل", "Two revision rounds"),
      ("نسخ أفقية ورأسية وأيقونية", "Horizontal, vertical & icon lockups"),
      ("ملفات متجهة", "Vector files")], True),
      ("شبكة وتخطيط", "Grid & layout"),
      ("قواعد الاستخدام", "Usage rules")], True),
    ("font-design", "تصميم الخطوط", "Font Design",
     "خط عربي مخصص لعلامتك، من الرسم الأول إلى ملف OpenType مختبَر.",
     "A bespoke Arabic typeface for your brand, from first drawings to a tested OpenType file.",
     [("رسم الحروف والأشكال", "Letterform & shape design"),
      ("أوزان متعددة", "Multiple weights"),
      ("تشكيل وتراكيب", "Vocalisation & ligatures"),
      ("ملفات OTF/TTF/WOFF", "OTF / TTF / WOFF files"),
      ("ترخيص واضح", "A clear licence")], True),
      ("رقمنة ومعالجة", "Digitisation & clean-up"),
      ("ملفات متجهة", "Vector files")], False),
      ("إشراف على التصوير", "Shoot supervision"),
      ("مراجعة التنفيذ", "Execution review")], True),
    ("motion-design", "موشن جرافيك", "Motion Graphics",
     "تحريك الهوية: شعار متحرك، عناوين، ومحتوى قصير للمنصات.",
     "Identity in motion: animated marks, titles and short-form content for platforms.",
     [("شعار متحرك", "Animated logo"),
      ("قوالب عناوين", "Title templates"),
      ("ملفات جاهزة للنشر", "Export-ready files")], False),
      ("تنضيد كامل", "Full typesetting"),
      ("تجهيز للطباعة", "Print preparation")], True),
    ("social-media-design", "تصميم السوشيال ميديا", "Social Media Design",
     "نظام قوالب يحافظ على الهوية ويسهّل الإنتاج اليومي.",
     "A template system that holds the identity together and makes daily output easy.",
     [("نظام قوالب", "Template system"),
      ("ملفات قابلة للتحرير", "Editable source files"),
      ("دليل استخدام مختصر", "A short usage guide")], False),
      ("نظام معلومات", "Information system"),
      ("ملفات دايلاين", "Dieline files")], False),
    ("ui-ux", "واجهات وتجربة المستخدم", "UI/UX",
     "واجهات عربية تُقرأ فعلاً: اتجاه صحيح، تايبوغرافي مضبوط، ونظام واضح.",
     "Arabic interfaces that actually read: correct direction, tuned typography, a clear system.",
     [("نظام تصميم", "Design system"),
      ("شاشات أساسية", "Key screens"),
      ("تسليم للمطوّرين", "Developer handoff")], True),
]

services = []
for i, (slug, ar, en, dar, den, deliv, feat) in enumerate(SERVICES):
    services.append({
        "id": f"svc_{slug}",
        "slug": slug,
        "published": True,
        "order": i,
        "name": L(ar, en),
        "description": L(dar, den),
        "deliverables": [L(a, e) for a, e in deliv],
        "image": img(f"/media/services/{slug}.svg", ar, en, 1200, 900),
        "featured": feat,
    })

# --------------------------------------------------------------------------- #
# Companies                                                                    #
# --------------------------------------------------------------------------- #
COMPANIES = [
    ("shorouk-studio", "استوديو الشروق", "Shorouk Studio", "studio",
     "استوديو تصميم متعدد التخصصات يعمل مع مؤسسات ثقافية في المنطقة.",
     "A multidisciplinary design studio working with cultural institutions across the region.",
     "مدير فني", "Art Director", "٢٠٢٤ — الآن", "2024 — Present", True, True),
    ("levant-agency", "وكالة المشرق", "Levant Agency", "agency",
     "وكالة إعلانية تغطي حملات إقليمية للعلامات الاستهلاكية.",
     "An advertising agency running regional campaigns for consumer brands.",
     "مصمم جرافيك أول", "Senior Graphic Designer", "٢٠٢٢ — ٢٠٢٤", "2022 — 2024", True, True),
    ("nahda-press", "دار النهضة", "Nahda Press", "organization",
     "دار نشر مستقلة تُعنى بالأدب العربي المعاصر والترجمة.",
     "An independent publishing house for contemporary Arabic literature and translation.",
     "مصمم تحريري", "Editorial Designer", "٢٠٢١ — الآن", "2021 — Present", True, True),
    ("qamar-foods", "أغذية قمر", "Qamar Foods", "client",
     "علامة أغذية إقليمية تعيد بناء حضورها البصري.",
     "A regional food brand rebuilding its visual presence.",
     "مصمم هوية وتغليف", "Identity & Packaging Designer", "٢٠٢٣", "2023", True, False),
    ("aswat-media", "أصوات ميديا", "Aswat Media", "company",
     "منصة محتوى صوتي ومرئي باللغة العربية.",
     "An Arabic-language audio and video content platform.",
     "مدير فني — موشن", "Art Director, Motion", "٢٠٢٣ — ٢٠٢٤", "2023 — 2024", True, False),
    ("madad-tech", "مدد", "Madad Tech", "company",
     "شركة منتجات رقمية تبني أدوات للأعمال الصغيرة.",
     "A product company building tools for small businesses.",
     "مصمم منتج", "Product Designer", "٢٠٢٢", "2022", False, False),
    ("beirut-book-fair-org", "معرض بيروت للكتاب", "Beirut Book Fair", "organization",
     "أحد أقدم معارض الكتاب في المنطقة.",
     "One of the region's longest-running book fairs.",
     "مدير فني للدورة", "Art Director, 2024 edition", "٢٠٢٤", "2024", True, False),
    ("independent", "أعمال مستقلة", "Independent", "personal",
     "مشاريع ذاتية وأبحاث في الحرف العربي خارج إطار العمل المكلَّف.",
     "Self-initiated projects and research into the Arabic letterform, outside commissioned work.",
     "مصمم", "Designer", "مستمر", "Ongoing", False, False),
]

companies = []
for i, (slug, nar, nen, ctype, dar, den, rar, ren, par, pen, feat, exp) in enumerate(COMPANIES):
    companies.append({
        "id": f"co_{slug}",
        "slug": slug,
        "published": True,
        "order": i,
        "name": L(nar, nen),
        "logo": {"src": f"/media/companies/{slug}/logo.svg", "kind": "image",
                 "alt": L(f"شعار {nar}", f"{nen} logo"), "width": 320, "height": 120},
        "description": L(dar, den),
        "role": L(rar, ren),
        "period": L(par, pen),
        "type": ctype,
        "services": ["brand-identity", "logo-design"] if ctype in ("studio", "agency") else ["brand-identity"],
        "url": f"https://example.com/{slug}",
        "images": [
            img(f"/media/companies/{slug}/01.svg", f"عمل لـ {nar}", f"Work for {nen}", 1600, 1000),
            img(f"/media/companies/{slug}/02.svg", f"عمل لـ {nar}", f"Work for {nen}", 1400, 1400),
        ],
        "featured": feat,
        "showInExperience": exp,
    })

# --------------------------------------------------------------------------- #
# Fonts                                                                        #
# --------------------------------------------------------------------------- #
FONTS = [
    ("sard", "سرد", "Sard", "نص", "Text",
     "خط نصي عربي مصمم للقراءة الطويلة — كتب، مجلات، وواجهات كثيفة النص. حروف مفتوحة العدادات وارتفاع صاعد معتدل.",
     "An Arabic text face built for long reading — books, magazines and text-heavy interfaces. Open counters, a restrained ascender.",
     [(200, "خفيف جدًا", "Extralight"), (300, "خفيف", "Light"), (400, "عادي", "Regular"),
      (500, "متوسط", "Medium"), (600, "شبه عريض", "Semibold")],
     ["أرقام عربية ولاتينية", "تشكيل كامل", "تراكيب اختيارية", "دعم فارسي وأردي"],
     ["Arabic & Latin numerals", "Full vocalisation", "Optional ligatures", "Persian & Urdu support"],
     "سرد خط للقراءة الطويلة", True),
    ("mizan-kufi", "ميزان كوفي", "Mizan Kufi", "عرض", "Display",
     "كوفي هندسي حديث للعناوين والشعارات. بُني على شبكة صارمة مع زوايا مضبوطة.",
     "A modern geometric Kufi for headlines and marks, built on a strict grid with tuned corners.",
     [(400, "عادي", "Regular"), (600, "عريض", "Bold")],
     ["شبكة هندسية", "بدائل أسلوبية", "مناسب للشعارات"],
     ["Geometric grid", "Stylistic alternates", "Made for logotypes"],
     "ميزان كوفي للعناوين", True),
    ("raqim-text", "رقيم", "Raqim", "نص", "Text",
     "خط نسخي معاصر بروح المخطوط، معدّل للشاشات الحديثة.",
     "A contemporary Naskh with the spirit of the manuscript, adjusted for modern screens.",
     [(300, "خفيف", "Light"), (400, "عادي", "Regular"), (500, "متوسط", "Medium")],
     ["نسخ معاصر", "تشكيل دقيق", "قابل للقراءة عند الأحجام الصغيرة"],
     ["Contemporary Naskh", "Precise vocalisation", "Legible at small sizes"],
     "رقيم بروح المخطوط", False),
    ("nuqta-display", "نقطة", "Nuqta", "عرض", "Display",
     "خط عرض تجريبي يقوم على النقطة كوحدة قياس، للملصقات والأغلفة.",
     "An experimental display face that takes the dot as its unit of measure, for posters and covers.",
     [(400, "عادي", "Regular")],
     ["وحدة قياس نقطية", "أشكال بديلة", "للعناوين الكبيرة"],
     ["Dot-based metrics", "Alternate forms", "For large sizes"],
     "نقطة وحدة القياس", False),
]

fonts = []
for i, (slug, nar, nen, tar, ten, dar, den, weights, far, fen, sample, feat) in enumerate(FONTS):
    fonts.append({
        "id": f"font_{slug}",
        "slug": slug,
        "published": True,
        "order": i,
        "name": L(nar, nen),
        "preview": img(f"/media/fonts/{slug}/preview.svg", f"معاينة خط {nar}", f"{nen} preview", 1600, 1000),
        "description": L(dar, den),
        "type": L(tar, ten),
        "weights": [{"name": L(a, e), "weight": w} for w, a, e in weights],
        "features": [L(a, e) for a, e in zip(far, fen)],
        "specimens": [
            img(f"/media/fonts/{slug}/specimen-{n:02d}.svg", f"نموذج {nar}", f"{nen} specimen", 1600, 1100)
            for n in range(1, 5)
        ],
        "license": L("ترخيص سطح مكتب وويب. الترخيص التجاري حسب حجم الاستخدام.",
                     "Desktop and web licence. Commercial terms scale with usage."),
        "purchaseUrl": f"https://example.com/fonts/{slug}",
        "downloadUrl": f"https://example.com/fonts/{slug}/trial" if i < 2 else None,
        "sample": L(sample, nen.upper() + " — TYPE SPECIMEN"),
        "featured": feat,
    })

# --------------------------------------------------------------------------- #
# Projects                                                                     #
# --------------------------------------------------------------------------- #
def blocks_for(slug, n_images, texts):
    """Build a varied case study: the shapes repeat, the content does not."""
    # The intro already appears in the project header, so the body opens on image.
    b = []
    b.append({"id": bid(), "type": "imageFull",
              "media": img(f"/media/projects/{slug}/01.svg", texts["alt_ar"], texts["alt_en"], 1600, 1000)})
    b.append({"id": bid(), "type": "heading", "level": 2, "text": texts["h1"]})
    b.append({"id": bid(), "type": "paragraph", "text": texts["body1"]})
    b.append({"id": bid(), "type": "imagePair", "media": [
        img(f"/media/projects/{slug}/02.svg", texts["alt_ar"], texts["alt_en"], 1200, 1500),
        img(f"/media/projects/{slug}/03.svg", texts["alt_ar"], texts["alt_en"], 1600, 900),
    ]})
    b.append({"id": bid(), "type": "quote", "text": texts["quote"], "attribution": texts["quote_by"]})
    b.append({"id": bid(), "type": "heading", "level": 2, "text": texts["h2"]})
    b.append({"id": bid(), "type": "textImage", "heading": texts["h3"], "text": texts["body2"],
              "media": img(f"/media/projects/{slug}/04.svg", texts["alt_ar"], texts["alt_en"], 1400, 1400)})
    if n_images >= 5:
        b.append({"id": bid(), "type": "gallery", "columns": 3, "media": [
            img(f"/media/projects/{slug}/{k:02d}.svg", texts["alt_ar"], texts["alt_en"],
                *[(1600, 1000), (1200, 1500), (1600, 900), (1400, 1400)][k % 4])
            for k in range(1, min(n_images, 6) + 1)
        ]})
    b.append({"id": bid(), "type": "divider"})
    b.append({"id": bid(), "type": "paragraph", "text": texts["outro"]})
    return b


PROJECTS = [
    dict(slug="mizan-identity", ar="هوية ميزان", en="Mizan Identity",
         sar="هوية بصرية لمؤسسة ثقافية مبنية على شبكة كوفية.",
         sen="A cultural institution's identity built on a Kufi grid.",
         year="2025", cats=["branding", "arabic-typography", "art-direction"],
         svcs=["brand-identity", "font-design"],
         co="shorouk-studio", rar="مدير فني ومصمم هوية", ren="Art Director & Identity Designer",
         tools=["Glyphs", "Illustrator", "InDesign"], fonts=["mizan-kufi"], featured=True, n=7),
    dict(slug="sard-typeface-campaign", ar="حملة إطلاق خط سرد", en="Sard Typeface Launch",
         sar="حملة إطلاق لخط نصي عربي، من الملصق إلى الموقع.",
         sen="A launch campaign for an Arabic text face, from poster to website.",
         year="2025", cats=["fonts", "arabic-typography", "posters", "digital"],
         svcs=["font-design", "brand-identity"],
         co="independent", rar="مصمم الخط والحملة", ren="Type & Campaign Designer",
         tools=["Glyphs", "Figma", "After Effects"], fonts=["sard"], featured=True, n=6),
    dict(slug="beirut-book-fair", ar="معرض بيروت للكتاب", en="Beirut Book Fair",
         sar="الهوية ونظام الإرشاد لدورة ٢٠٢٤.",
         sen="Identity and wayfinding for the 2024 edition.",
         year="2024", cats=["branding", "wayfinding", "print", "art-direction"],
         svcs=["brand-identity"],
         co="beirut-book-fair-org", rar="مدير فني", ren="Art Director",
         tools=["Illustrator", "InDesign", "Photoshop"], fonts=["mizan-kufi", "sard"], featured=True, n=6),
    dict(slug="qamar-packaging", ar="تغليف قمر", en="Qamar Packaging",
         sar="نظام تغليف لخط منتجات غذائية إقليمي.",
         sen="A packaging system for a regional food range.",
         year="2023", cats=["packaging", "branding", "print"],
         svcs=["brand-identity"],
         co="qamar-foods", rar="مصمم هوية وتغليف", ren="Identity & Packaging Designer",
         tools=["Illustrator", "Photoshop"], fonts=["raqim-text"], featured=True, n=5),
    dict(slug="nahda-editorial", ar="سلسلة النهضة", en="Nahda Editorial Series",
         sar="نظام تصميم لسلسلة أدبية من ٢٤ كتابًا.",
         sen="A design system for a 24-title literary series.",
         year="2024", cats=["editorial", "print", "arabic-typography"],
         svcs=["brand-identity", "font-design"],
         co="nahda-press", rar="مصمم تحريري", ren="Editorial Designer",
         tools=["InDesign", "Glyphs"], fonts=["sard", "raqim-text"], featured=True, n=6),
    dict(slug="halaqa-social", ar="حلقة — سوشيال", en="Halaqa Social System",
         sar="نظام قوالب سوشيال ميديا لمنصة نقاش عربية.",
         sen="A social template system for an Arabic discussion platform.",
         year="2024", cats=["social-media", "digital", "graphic-design"],
         svcs=["social-media-design", "brand-identity"],
         co="aswat-media", rar="مدير فني", ren="Art Director",
         tools=["Figma", "After Effects"], fonts=["mizan-kufi"], featured=False, n=5),
    dict(slug="tariq-wayfinding", ar="نظام إرشاد طريق", en="Tariq Wayfinding",
         sar="نظام إرشاد ثنائي اللغة لمجمع ثقافي.",
         sen="A bilingual wayfinding system for a cultural complex.",
         year="2023", cats=["wayfinding", "arabic-typography", "print"],
         svcs=["font-design", "brand-identity"],
         co="shorouk-studio", rar="مصمم نظام", ren="Systems Designer",
         tools=["Illustrator", "InDesign"], fonts=["mizan-kufi"], featured=False, n=5),
    dict(slug="aswat-motion", ar="أصوات — هوية متحركة", en="Aswat Motion Identity",
         sar="تحريك هوية منصة صوتية عربية.",
         sen="Putting an Arabic audio platform's identity in motion.",
         year="2024", cats=["motion", "branding", "digital"],
         svcs=["motion-design", "brand-identity"],
         co="aswat-media", rar="مدير فني — موشن", ren="Art Director, Motion",
         tools=["After Effects", "Cinema 4D"], fonts=["mizan-kufi"], featured=False, n=4),
    dict(slug="madad-app", ar="تطبيق مدد", en="Madad App",
         sar="واجهة عربية أولًا لتطبيق إدارة أعمال صغيرة.",
         sen="An Arabic-first interface for a small-business tool.",
         year="2022", cats=["ui-ux", "digital"],
         svcs=["ui-ux", "font-design"],
         co="madad-tech", rar="مصمم منتج", ren="Product Designer",
         tools=["Figma"], fonts=["sard"], featured=False, n=5),
    dict(slug="khatt-poster-series", ar="سلسلة ملصقات خط", en="Khatt Poster Series",
         sar="اثنا عشر ملصقًا حول الحرف العربي كشكل خالص.",
         sen="Twelve posters on the Arabic letterform as pure shape.",
         year="2025", cats=["posters", "calligraphy", "arabic-typography", "print"],
         svcs=["font-design", "brand-identity"],
         co="independent", rar="مصمم", ren="Designer",
         tools=["Ink", "Illustrator", "Risograph"], fonts=["nuqta-display"], featured=True, n=6),
]

projects = []
for i, p in enumerate(PROJECTS):
    texts = {
        "alt_ar": f"من مشروع {p['ar']}", "alt_en": f"From {p['en']}",
        "intro": L(
            f"{p['sar']} بدأ العمل من سؤال واحد: كيف يبدو هذا المحتوى حين يُصمَّم بالعربية أولًا، لا حين يُترجم بعد الانتهاء؟",
            f"{p['sen']} The work started from one question: what does this look like when it is designed in Arabic first, rather than translated after the fact?"),
        "h1": L("نقطة الانطلاق", "Where it started"),
        "body1": L(
            "قبل أي رسم، جمعنا المواد الموجودة وقرأناها كما يقرأها المستخدم: بالعربية، من اليمين، وعلى شاشة صغيرة قبل أي شيء آخر.\nكشف ذلك مشكلتين: نظام تايبوغرافي مستعار من اللاتيني، وتسلسل معلومات لا يصمد عند الاختصار.",
            "Before any drawing we gathered what already existed and read it the way a reader does: in Arabic, from the right, on a small screen before anything else.\nThat surfaced two problems — a type system borrowed from Latin, and an information hierarchy that collapsed the moment it was condensed."),
        "quote": L("الحرف العربي لا يحتاج إلى أن يُجمَّل. يحتاج إلى أن يُفهم أولًا.",
                   "The Arabic letter does not need to be prettified. It needs to be understood first."),
        "quote_by": L("من ملاحظات المشروع", "From the project notes"),
        "h2": L("النظام", "The system"),
        "h3": L("قواعد قليلة، تطبيق واسع", "Few rules, wide application"),
        "body2": L(
            "بُني النظام على عدد صغير من القرارات: مقياس تايبوغرافي واحد للعربي واللاتيني، شبكة تعمل في الاتجاهين، ومجموعة ضيقة من الأحجام.\nكل ما جاء بعد ذلك اشتُقّ من هذه القواعد بدل أن يُصمَّم من جديد في كل مرة.",
            "The system rests on a small number of decisions: one type scale shared by Arabic and Latin, a grid that works in both directions, and a deliberately narrow set of sizes.\nEverything after that is derived from those rules rather than designed again from scratch."),
        "outro": L(
            "النتيجة نظام يمكن لغير المصمم أن يشغّله: قوالب واضحة، قواعد مكتوبة، وملفات مرتبة. هذا هو الفرق بين هوية تُسلَّم وهوية تُستخدم.",
            "The result is a system someone who is not a designer can actually run: clear templates, written rules, tidy files. That is the difference between an identity that is delivered and one that gets used."),
    }
    projects.append({
        "id": f"prj_{p['slug']}",
        "slug": p["slug"],
        "published": True,
        "order": i,
        "title": L(p["ar"], p["en"]),
        "cover": img(f"/media/projects/{p['slug']}/cover.svg", f"غلاف {p['ar']}", f"{p['en']} cover", 1600, 1200),
        "shortDescription": L(p["sar"], p["sen"]),
        "fullDescription": texts["intro"],
        "year": p["year"],
        "categories": p["cats"],
        "services": p["svcs"],
        "company": None if p["co"] == "independent" else p["co"],
        "role": L(p["rar"], p["ren"]),
        "tools": p["tools"],
        "fonts": p["fonts"],
        "projectUrl": f"https://example.com/work/{p['slug']}",
        "links": [{"label": L("على بيهانس", "On Behance"), "href": f"https://behance.net/{p['slug']}"}],
        "featured": p["featured"],
        "blocks": blocks_for(p["slug"], p["n"], texts),
    })

# Give two projects real motion so video and GIF blocks are exercised.
projects[1]["blocks"].insert(4, {
    "id": bid(), "type": "video",
    "media": {"src": "/media/motion/reel.webm", "kind": "video",
              "alt": L("مقطع من حملة الإطلاق", "A clip from the launch campaign"),
              "poster": "/media/motion/reel-poster.png", "width": 960, "height": 540,
              "autoplay": True, "loop": True, "muted": True, "controls": False,
              "caption": L("الشعار المتحرك", "The animated mark")},
})
projects[7]["blocks"].insert(3, {
    "id": bid(), "type": "gif",
    "media": {"src": "/media/motion/loop.gif", "kind": "gif",
              "alt": L("حلقة متحركة من نظام الهوية", "An animated loop from the identity system"),
              "width": 480, "height": 270,
              "caption": L("حلقة قصيرة للمنصات", "A short loop for platforms")},
})

# --------------------------------------------------------------------------- #
# Workshops & courses                                                          #
# --------------------------------------------------------------------------- #
WORKSHOPS = [
    ("arabic-type-foundations", "workshop", "أساسيات التايبوغرافي العربي", "Arabic Type Foundations",
     "ورشة مكثفة في قراءة الحرف العربي وضبط النص: التناسب، الإيقاع، والفراغ.",
     "An intensive workshop on reading the Arabic letter and setting text: proportion, rhythm and space.",
     "2026-11-14", "2026-11-15", "يومان — ١٢ ساعة", "Two days — 12 hours",
     "بيروت، لبنان", "Beirut, Lebanon", "offline", "٢٥٠ دولار", "$250", 18, True),
    ("identity-sprint", "workshop", "سبرنت الهوية البصرية", "Identity Sprint",
     "ثلاثة أيام لبناء هوية كاملة من الاستراتيجية إلى دليل مختصر.",
     "Three days to build a complete identity, from strategy to a short guideline.",
     "2027-02-06", "2027-02-08", "ثلاثة أيام", "Three days",
     "عن بُعد", "Online", "online", "٣٢٠ دولار", "$320", 24, True),
    ("calligraphy-to-type", "workshop", "من الخط إلى الحرف", "From Calligraphy to Type",
     "كيف يتحول العمل الخطي إلى نظام حروف قابل للإنتاج.",
     "How a piece of calligraphy becomes a producible letter system.",
     "2025-04-12", "2025-04-12", "يوم واحد — ٦ ساعات", "One day — 6 hours",
     "عمّان، الأردن", "Amman, Jordan", "offline", "١٢٠ دولار", "$120", 20, False),
    ("editorial-systems", "workshop", "أنظمة التصميم التحريري", "Editorial Systems",
     "بناء شبكة وأنماط صفحات لمطبوعة عربية.",
     "Building a grid and page styles for an Arabic publication.",
     "2025-09-20", "2025-09-21", "يومان", "Two days",
     "الدوحة، قطر", "Doha, Qatar", "offline", "٢٠٠ دولار", "$200", 16, False),
    ("type-design-course", "course", "تصميم الخط العربي — كورس كامل", "Arabic Type Design — Full Course",
     "كورس من ثمانية أسابيع: من الرسم الأول إلى ملف OpenType مختبَر وجاهز للنشر.",
     "An eight-week course: from first drawings to a tested, shippable OpenType file.",
     "2027-01-10", "2027-03-07", "ثمانية أسابيع — لقاء أسبوعي", "Eight weeks — weekly sessions",
     "عن بُعد", "Online", "online", "٧٥٠ دولار", "$750", 30, True),
    ("brand-systems-course", "course", "أنظمة الهوية البصرية", "Brand Systems",
     "كورس من ستة أسابيع في بناء أنظمة هوية تعمل بالعربية واللاتينية.",
     "A six-week course on building identity systems that work in Arabic and Latin.",
     "2025-05-05", "2025-06-16", "ستة أسابيع", "Six weeks",
     "عن بُعد", "Online", "hybrid", "٥٨٠ دولار", "$580", 25, False),
]

CONTENT_AR = ["قراءة الحرف وتحليل الشكل", "التناسب والإيقاع", "ضبط النص الطويل",
              "العلاقة بين العربي واللاتيني", "التطبيق العملي ومراجعة الأعمال"]
CONTENT_EN = ["Reading the letter, analysing the shape", "Proportion and rhythm",
              "Setting long text", "Arabic and Latin together", "Practical work and critique"]

workshops = []
for i, (slug, kind, tar, ten, dar, den, date, end, durar, duren, locar, locen, mode, par, pen, seats, feat) in enumerate(WORKSHOPS):
    workshops.append({
        "id": f"ws_{slug}",
        "slug": slug,
        "published": True,
        "order": i,
        "kind": kind,
        "title": L(tar, ten),
        "description": L(dar, den),
        "cover": img(f"/media/workshops/{slug}/cover.svg", tar, ten, 1600, 1000),
        "date": date,
        "endDate": end,
        "duration": L(durar, duren),
        "location": L(locar, locen),
        "mode": mode,
        "price": L(par, pen),
        "seats": seats,
        "content": [L(a, e) for a, e in zip(CONTENT_AR, CONTENT_EN)],
        "media": [img(f"/media/workshops/{slug}/01.svg", tar, ten, 1400, 1000)],
        "registrationUrl": f"https://example.com/register/{slug}",
        "relatedProjects": ["sard-typeface-campaign", "nahda-editorial"] if "type" in slug or kind == "course" else ["mizan-identity"],
        "relatedServices": ["font-design"] if "type" in slug else ["brand-identity"],
        "featured": feat,
    })

# --------------------------------------------------------------------------- #
# Settings                                                                     #
# --------------------------------------------------------------------------- #
settings = {
    "name": L("عبد المالك", "Abdulmalek"),
    "role": L("مصمم جرافيك ومصمم خطوط عربية", "Graphic Designer & Arabic Type Designer"),
    "tagline": L("أصمّم الهويات والخطوط العربية.", "I design identities and Arabic typefaces."),
    "heroStatement": L(
        "أبني أنظمة بصرية تبدأ من الحرف العربي — هويات وخطوط ومطبوعات تُقرأ قبل أن تُعجب.",
        "I build visual systems that start from the Arabic letter — identities, typefaces and print that read before they impress."),
    "shortBio": L(
        "مصمم جرافيك ومصمم خطوط. أعمل مع المؤسسات الثقافية والعلامات على الهوية والتايبوغرافي العربي.",
        "Graphic and type designer. I work with cultural institutions and brands on identity and Arabic typography."),
    "about": {
        "portrait": img("/media/about/portrait.svg", "صورة شخصية", "Portrait", 1200, 1500),
        "intro": L(
            "أصمّم منذ أكثر من عشر سنوات، ومعظم عملي يدور حول سؤال واحد: كيف يُصمَّم المحتوى العربي بالعربية، لا كترجمة متأخرة لتصميم لاتيني؟",
            "I have been designing for over a decade, and most of my work circles one question: how do you design Arabic content in Arabic, rather than as a late translation of a Latin layout?"),
        "body": [
            L("بدأت من الخط اليدوي قبل أن أنتقل إلى التصميم الرقمي، وهذا ما زال يظهر في طريقة عملي: أبدأ من الشكل، لا من الشبكة.",
              "I started with hand lettering before moving to digital design, and it still shows in how I work: I start from the shape, not the grid."),
            L("اليوم أقسم وقتي بين ثلاثة أشياء — هويات بصرية لمؤسسات ثقافية، خطوط عربية أطوّرها وأنشرها، وتدريس ما تعلّمته في ورش وكورسات.",
              "Today I split my time three ways — identities for cultural institutions, Arabic typefaces I develop and release, and teaching what I have learned through workshops and courses."),
            L("أفضّل المشاريع التي فيها نص حقيقي وقيود حقيقية. الأنظمة التي تصمد هي التي اختُبرت على محتوى صعب، لا على نص وهمي.",
              "I prefer projects with real text and real constraints. The systems that hold up are the ones tested against difficult content, not against placeholder copy."),
        ],
        "approach": [
            {"title": L("اقرأ قبل أن ترسم", "Read before drawing"),
             "text": L("أقرأ المحتوى الفعلي أولًا. القرارات التايبوغرافية تأتي من النص، لا من المزاج.",
                       "I read the actual content first. Typographic decisions come from the text, not from a mood board.")},
            {"title": L("قواعد قليلة", "Few rules"),
             "text": L("النظام الجيد يُشرح في صفحة واحدة. إذا احتاج إلى دليل من مئة صفحة، فهو لم يُحلّ بعد.",
                       "A good system explains itself in a page. If it needs a hundred-page manual, it has not been solved yet.")},
            {"title": L("سلّم ما يُستخدم", "Ship what gets used"),
             "text": L("أسلّم ملفات وقوالب يستطيع الفريق تشغيلها بنفسه بعد انتهاء المشروع.",
                       "I hand over files and templates the team can actually run once the project ends.")},
        ],
        "tools": ["Glyphs", "Illustrator", "InDesign", "Photoshop", "Figma", "After Effects", "RoboFont", "Risograph"],
        "interests": [
            L("المخطوطات العربية", "Arabic manuscripts"),
            L("الطباعة بالريزوغراف", "Risograph printing"),
            L("لافتات الشوارع", "Street signage"),
            L("أرشفة الحرف", "Letterform archives"),
        ],
        "achievements": [
            {"year": "2025", "text": L("إطلاق خط «سرد» بخمسة أوزان.", "Released Sard in five weights.")},
            {"year": "2024", "text": L("الإدارة الفنية لدورة معرض بيروت للكتاب.", "Art directed the Beirut Book Fair edition.")},
            {"year": "2023", "text": L("جائزة التميّز في التايبوغرافي العربي.", "Award of excellence in Arabic typography.")},
            {"year": "2022", "text": L("أول ورشة عامة في تصميم الخط.", "First public type design workshop.")},
        ],
        "cvUrl": None,
    },
    "contact": {
        "email": "hello@example.com",
        "phone": "+961 70 000 000",
        "whatsapp": "+961 70 000 000",
        "location": L("بيروت، لبنان — أعمل عن بُعد", "Beirut, Lebanon — working remotely"),
        "availability": L("متاح لمشاريع تبدأ من الربع القادم.", "Taking on projects starting next quarter."),
        "projectTypes": [
            L("هوية بصرية", "Brand identity"),
            L("خط مخصص", "Custom typeface"),
            L("تصميم تحريري", "Editorial design"),
            L("إدارة فنية", "Art direction"),
            L("ورشة أو كورس", "Workshop or course"),
            L("أخرى", "Something else"),
        ],
        "budgets": [
            L("أقل من ٥٠٠٠ دولار", "Under $5,000"),
            L("٥٬٠٠٠ — ١٥٬٠٠٠ دولار", "$5,000 — $15,000"),
            L("١٥٬٠٠٠ — ٤٠٬٠٠٠ دولار", "$15,000 — $40,000"),
            L("أكثر من ٤٠٬٠٠٠ دولار", "Over $40,000"),
            L("غير محدد بعد", "Not sure yet"),
        ],
    },
    "social": [
        {"icon": "instagram", "label": "Instagram", "href": "https://instagram.com/"},
        {"icon": "behance", "label": "Behance", "href": "https://behance.net/"},
        {"icon": "linkedin", "label": "LinkedIn", "href": "https://linkedin.com/"},
        {"icon": "x", "label": "X", "href": "https://x.com/"},
        {"icon": "youtube", "label": "YouTube", "href": "https://youtube.com/"},
        {"icon": "telegram", "label": "Telegram", "href": "https://t.me/"},
    ],
    "seo": {
        "siteUrl": "https://example.com",
        "title": L("عبد المالك — مصمم جرافيك ومصمم خطوط عربية",
                   "Abdulmalek — Graphic & Arabic Type Designer"),
        "description": L(
            "أعمال في الهوية البصرية والتايبوغرافي العربي وتصميم الخطوط، مع ورش وكورسات.",
            "Work in brand identity, Arabic typography and type design, plus workshops and courses."),
    },
}


def dump(name, data):
    path = os.path.join(OUT, f"{name}.json")
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    print(f"  {name}.json  ({os.path.getsize(path) // 1024} KB)")


def main():
    os.makedirs(OUT, exist_ok=True)
    print("seeding demo content:")
    dump("settings", settings)
    dump("categories", categories)
    dump("projects", projects)
    dump("companies", companies)
    dump("fonts", fonts)
    dump("services", services)
    dump("workshops", workshops)


if __name__ == "__main__":
    main()
