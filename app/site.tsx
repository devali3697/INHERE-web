"use client";
/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element, react-hooks/set-state-in-effect */

import {
  createContext,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AdminPanel from "@/components/admin/admin-panel";
import { supabase } from "@/lib/supabase";
import {
  FaFacebookF,
  FaInstagram,
  FaLocationDot,
  FaPhone,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import { SiKakaotalk, SiLine, SiWechat } from "react-icons/si";

type Language = "en" | "vi";

const copy = {
  en: {
    nav: [
      "Home",
      "Services & Pricing",
      "Hội An Experiences",
      "Portfolio",
      "Blog",
      "FAQ & Policies",
      "About",
      "Contact",
    ],
    book: "Book your experience",
    menu: "Menu",
    close: "Close",
    eyebrow: "AO DAI · MAKEUP · PHOTOGRAPHY · HỘI AN",
    titleA: "Complete Hội An Experience:",
    titleB: "Áo Dài, Makeup",
    titleC: "& Photoshoot",
    heroCopy:
      "Professional services for Solo, Couples, Families & Friend Groups.",
    heroBook: "Discover Full Combo",
    explore: "Explore Signature Albums",
    whatsapp: "Chat on WhatsApp",
    scroll: "SCROLL TO DISCOVER",
    badgeTop: "HỘI AN",
    badgeBottom: "VISUAL STORIES",
    chapter: "CHAPTER 01 · THE OLD TOWN",
    introEye: "THE INHERE EXPERIENCE",
    introA: "More than photographs.",
    introB: "A story you can feel.",
    introCopy:
      "From your first styling idea to the final curated album, INHERE brings together Vietnamese fashion, thoughtful guidance and the poetic beauty of Hội An.",
    introLink: "Discover our approach",
  },
  vi: {
    nav: [
      "Trang chủ",
      "Dịch vụ & Bảng giá",
      "Trải nghiệm Hội An",
      "Bộ sưu tập",
      "Bài viết",
      "FAQ & Chính sách",
      "Về INHERE",
      "Liên hệ",
    ],
    book: "Đặt lịch trải nghiệm",
    menu: "Menu",
    close: "Đóng",
    eyebrow: "ÁO DÀI · TRANG ĐIỂM · NHIẾP ẢNH · HỘI AN",
    titleA: "Câu chuyện của bạn,",
    titleB: "được kể thật đẹp",
    titleC: "tại Hội An.",
    heroCopy:
      "Trải nghiệm nhiếp ảnh cao cấp, phong cách Việt và hành trình Hội An được thiết kế riêng cho cặp đôi, khách cá nhân và gia đình.",
    heroBook: "Đặt lịch chụp ảnh",
    explore: "Khám phá album nổi bật",
    whatsapp: "Trò chuyện qua WhatsApp",
    scroll: "CUỘN ĐỂ KHÁM PHÁ",
    badgeTop: "HỘI AN",
    badgeBottom: "CÂU CHUYỆN HÌNH ẢNH",
    chapter: "CHƯƠNG 01 · PHỐ CỔ",
    introEye: "TRẢI NGHIỆM INHERE",
    introA: "Không chỉ là những bức ảnh.",
    introB: "Một câu chuyện bạn có thể cảm nhận.",
    introCopy:
      "Từ ý tưởng trang phục đầu tiên đến album hoàn thiện, INHERE kết hợp thời trang Việt, sự hướng dẫn tận tâm và vẻ đẹp đầy chất thơ của Hội An.",
    introLink: "Khám phá cách chúng tôi thực hiện",
  },
};

const WA = "https://wa.me/84898199099";
const IG = "https://www.instagram.com/inhere.studiohoian/";
const FB = "https://www.facebook.com/ThueAoDaiHoiAn.InHere";
const TIKTOK = "https://www.tiktok.com/@inhere.studiohoian/";
const YOUTUBE = "https://www.youtube.com/@Inhere.studioHoiAn";
const logo = "/inhere-facebook-avatar.jpg";

const images = {
  hero: "https://images.unsplash.com/photo-1768017093068-7d0a34d0add0?auto=format&fit=crop&w=2560&q=94",
  couple:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=86",
  solo: "https://images.unsplash.com/photo-1768017093154-1bfbaa3e3ccf?auto=format&fit=crop&w=1600&q=86",
  family:
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=86",
  lantern:
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=86",
  river:
    "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1600&q=86",
  craft:
    "https://images.unsplash.com/photo-1509023464722-18d996393ca8?auto=format&fit=crop&w=1600&q=86",
  oldtown:
    "https://images.unsplash.com/photo-1780803244219-a21588279fc6?auto=format&fit=crop&w=1600&q=86",
};

const services = [
  {
    id: "01",
    slug: "couple-photoshoot",
    title: "Couple Photoshoot",
    image: images.couple,
    copy: "Celebrate your connection through romantic, natural photographs created across Hội An’s most atmospheric locations.",
  },
  {
    id: "02",
    slug: "solo-photoshoot",
    title: "Solo Photoshoot",
    image: images.solo,
    copy: "A personal portrait experience combining professional guidance, elegant styling and the timeless character of Hội An.",
  },
  {
    id: "03",
    slug: "family-photoshoot",
    title: "Family Photoshoot",
    image: images.family,
    copy: "Relaxed, meaningful photographs created to preserve the warmth and personality of your family journey.",
  },
  {
    id: "04",
    slug: "outfits",
    title: "Outfit Rental",
    image: images.lantern,
    copy: "Explore Vietnamese-inspired outfits and carefully selected styles for your photography experience.",
  },
  {
    id: "05",
    slug: "accessories",
    title: "Accessories Rental",
    image: images.craft,
    copy: "Complete your look with complementary accessories selected for your outfit, location and visual concept.",
  },
];

const albums = [
  {
    n: "01",
    title: "A Love Letter to Hội An",
    meta: "Couple · Old Town",
    image: images.couple,
  },
  {
    n: "02",
    title: "Silk & Lantern Light",
    meta: "Ao Dai · Portrait",
    image: images.solo,
  },
  {
    n: "03",
    title: "Together, Here",
    meta: "Family · Riverside",
    image: images.family,
  },
  {
    n: "04",
    title: "Afterglow",
    meta: "Golden Hour · Hội An",
    image: images.river,
  },
];

const experiences = [
  {
    title: "Lantern-Making Workshop",
    cat: "Cultural Experience",
    image: images.lantern,
    duration: "Duration to be confirmed",
  },
  {
    title: "Riverside Evening Experience",
    cat: "Old Town Activity",
    image: images.river,
    duration: "Details to be confirmed",
  },
  {
    title: "Local Craft Experience",
    cat: "Workshop",
    image: images.craft,
    duration: "Duration to be confirmed",
  },
];

const articles = [
  {
    slug: "best-places-for-a-photoshoot-in-hoi-an",
    title: "Best Places for a Photoshoot in Hội An",
    cat: "Photography Locations",
    image: images.oldtown,
    excerpt:
      "A thoughtful guide to beautiful corners, quieter streets and the changing light of the Old Town.",
  },
  {
    slug: "what-to-wear-for-an-ao-dai-photoshoot",
    title: "What to Wear for an Ao Dai Photoshoot",
    cat: "Ao Dai",
    image: images.solo,
    excerpt:
      "How to choose color, silhouette and accessories that feel personal and photograph beautifully.",
  },
  {
    slug: "golden-hour-photography-in-hoi-an",
    title: "Golden Hour Photography in Hội An",
    cat: "Photoshoot Tips",
    image: images.river,
    excerpt:
      "Plan a relaxed session around soft riverside light and warm lantern-lit streets.",
  },
];

type CmsService = (typeof services)[number];
type CmsAlbum = (typeof albums)[number];
type CmsExperience = (typeof experiences)[number];
type CmsArticle = (typeof articles)[number] & { content?: string; date?: string };
type CmsTestimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  avatarUrl: string;
  rating: number;
};
type CmsReel = {
  id?: string;
  title: string;
  titleVi?: string;
  category: string;
  categoryVi?: string;
  video?: string;
  poster?: string;
  instagramUrl: string;
};
type CmsPage = {
  page_key: string;
  title_en: string;
  title_vi: string;
  subtitle_en: string;
  subtitle_vi: string;
  body_en: string;
  body_vi: string;
  hero_image: string | null;
};
type CmsState = {
  services: CmsService[];
  albums: CmsAlbum[];
  experiences: CmsExperience[];
  articles: CmsArticle[];
  testimonials: CmsTestimonial[];
  reels: CmsReel[];
  pages: Record<string, CmsPage>;
};

const CmsContext = createContext<CmsState>({
  services,
  albums,
  experiences,
  articles,
  testimonials: [],
  reels: [],
  pages: {},
});
const useCms = () => useContext(CmsContext);

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function ScrollExperience() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".section-head, .intro > *, .album, .service-list button, .service-preview, .process-content > *, .process li, .experience-grid article, .post, .reel-card, .reels-title > *, .final-quote > div, .footer-cta > *, .footer-main > *, .footer-main a, .inner-content > *",
      ),
    );
    targets.forEach((element, index) => {
      element.classList.add("reveal-target");
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 4, 3) * 70}ms`,
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((element) => observer.observe(element));
    document.documentElement.classList.add("motion-ready");

    const hero = document.querySelector<HTMLElement>(".hero");
    const heroImage = hero?.querySelector<HTMLElement>("img");
    const progress = document.querySelector<HTMLElement>(".page-progress i");
    let ticking = false;
    const paintScroll = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      progress?.style.setProperty(
        "transform",
        `scaleX(${Math.min(window.scrollY / max, 1)})`,
      );
      heroImage?.style.setProperty(
        "--scroll-shift",
        `${Math.min(window.scrollY * 0.12, 90)}px`,
      );
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(paintScroll);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!hero) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      hero.style.setProperty("--pointer-x", `${x * 12}px`);
      hero.style.setProperty("--pointer-y", `${y * 8}px`);
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--ink-x", `${event.clientX - rect.left}px`);
      hero.style.setProperty("--ink-y", `${event.clientY - rect.top}px`);
    };
    paintScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    hero?.addEventListener("pointermove", onPointer);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      hero?.removeEventListener("pointermove", onPointer);
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);
  return (
    <div className="page-progress" aria-hidden="true">
      <i />
    </div>
  );
}

function StudioCursor() {
  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const cursor = document.querySelector<HTMLElement>(".studio-cursor");
    if (!cursor) return;
    const move = (event: PointerEvent) => {
      cursor.style.setProperty("--cursor-x", `${event.clientX}px`);
      cursor.style.setProperty("--cursor-y", `${event.clientY}px`);
      cursor.classList.add("visible");
      cursor.classList.toggle(
        "focus",
        Boolean((event.target as Element).closest("a,button,input,textarea")),
      );
    };
    const leave = () => cursor.classList.remove("visible");
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);
  return (
    <div className="studio-cursor" aria-hidden="true">
      <i />
      <span />
    </div>
  );
}

function Header({
  onBook,
  lang,
  setLang,
}: {
  onBook: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const c = copy[lang];
  const hrefs = [
    "/",
    "/services",
    "/experiences",
    "/portfolio",
    "/blog",
    "/faq",
    "/about",
    "/contact",
  ];
  const links = c.nav.map((title, index) => [title, hrefs[index]]);
  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <a className="wordmark" href="/" aria-label="INHERE home">
          INHERE<span>HỘI AN</span>
        </a>
        <nav className="desktop-nav">
          {links.slice(1).map(([t, h]) => (
            <a key={t} href={h}>
              {t}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <div className="lang-switch" aria-label="Choose language">
            <button
              className={lang === "en" ? "active" : ""}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <i>/</i>
            <button
              className={lang === "vi" ? "active" : ""}
              onClick={() => setLang("vi")}
            >
              VI
            </button>
          </div>
          <button className="book-small" onClick={onBook}>
            {c.book}
          </button>
          <button
            className="menu-btn"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            {c.menu}
          </button>
        </div>
      </header>
      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="menu-top">
          <span>INHERE · HỘI AN</span>
          <button onClick={() => setOpen(false)}>{c.close} ×</button>
        </div>
        <nav>
          {links.map(([t, h], i) => (
            <a
              key={t}
              href={h}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${i * 35}ms` }}
            >
              {t}
              <Arrow />
            </a>
          ))}
        </nav>
        <div className="menu-bottom">
          <a href={WA} target="_blank">
            WhatsApp +84 898 199 099
          </a>
          <button
            onClick={() => {
              setOpen(false);
              onBook();
            }}
          >
            {c.book}
          </button>
        </div>
      </div>
    </>
  );
}

function Hero({ lang }: { lang: Language }) {
  const c = copy[lang];
  const { pages } = useCms();
  const homePage = pages.home;
  const heroCopy = c.heroCopy;
  const heroImage = homePage?.hero_image || images.hero;
  return (
    <section className="hero">
      <picture>
        <source
          media="(max-width: 700px)"
          srcSet="https://images.unsplash.com/photo-1768017093068-7d0a34d0add0?auto=format&fit=crop&w=1200&q=92"
        />
        <img
          src={heroImage}
          alt="Lantern-lit architecture in Hội An"
          fetchPriority="high"
          data-placeholder-image="Replace with INHERE portfolio hero"
        />
      </picture>
      <div className="hero-shade" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-orbit" aria-hidden="true">
        <span>{c.badgeTop}</span>
        <i>✦</i>
        <span>{c.badgeBottom}</span>
      </div>
      <div className="hero-side">
        <span>01</span>
        <i />
        <span>03</span>
      </div>
      <div className="hero-content">
        <p className="eyebrow light">{c.eyebrow}</p>
        <div
          className="hero-title-reveal"
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            event.currentTarget.style.setProperty(
              "--title-x",
              `${event.clientX - rect.left}px`,
            );
            event.currentTarget.style.setProperty(
              "--title-y",
              `${event.clientY - rect.top}px`,
            );
          }}
        >
          <h1>
            <span>{c.titleA}</span>
            <br />
            <em>{c.titleB}</em>
            <br />
            <span>{c.titleC}</span>
          </h1>
          <h1 className="hero-title-ink" aria-hidden="true">
            <span>{c.titleA}</span>
            <br />
            <em>{c.titleB}</em>
            <br />
            <span>{c.titleC}</span>
          </h1>
          <span className="hero-title-hint">Move across the title</span>
        </div>
        <p className="hero-copy">{heroCopy}</p>
        <div className="hero-buttons">
          <a
            className="button ivory hero-primary-cta"
            href="#full-combo"
            onClick={(event) => {
              event.preventDefault();
              window.history.pushState({}, "", "#full-combo");
              document
                .getElementById("full-combo")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <span className="cta-label">{c.heroBook}</span>
            <span className="cta-icon" aria-hidden="true"><Arrow /></span>
          </a>
        </div>
      </div>
      <div className="hero-chapter">{c.chapter}</div>
      <a className="hero-whatsapp" href={WA} target="_blank">
        {c.whatsapp} <Arrow />
      </a>
      <div className="scroll-cue">
        <span>{c.scroll}</span>
        <i />
      </div>
    </section>
  );
}

function Intro({ lang }: { lang: Language }) {
  const c = copy[lang];
  return (
    <section className="intro section">
      <p className="eyebrow">{c.introEye}</p>
      <div>
        <h2>
          {c.introA}
          <br />
          <em>{c.introB}</em>
        </h2>
        <p>{c.introCopy}</p>
        <a href="/about" className="text-link dark">
          {c.introLink} <Arrow />
        </a>
      </div>
    </section>
  );
}

function FullCombo({ onBook }: { onBook: () => void }) {
  return (
    <section id="full-combo" className="full-combo section">
      <div className="full-combo-visual">
        <img
          src={images.solo}
          alt="Complete Áo Dài, makeup and photoshoot experience in Hội An"
        />
        <span>THE SIGNATURE EXPERIENCE</span>
      </div>
      <div className="full-combo-content">
        <div className="full-combo-topline">
          <p className="eyebrow">INHERE · HỘI AN</p>
          <span>Most Booked</span>
        </div>
        <h2>
          The Complete
          <br />
          <em>Full Combo.</em>
        </h2>
        <p className="full-combo-lead">
          One seamless experience bringing together Áo Dài, professional makeup
          and a guided photoshoot across Hội An.
        </p>
        <div className="full-combo-includes" aria-label="Package includes">
          <span>Áo Dài styling</span>
          <span>Professional makeup</span>
          <span>Guided photoshoot</span>
        </div>
        <div className="full-combo-facts">
          <article>
            <span>01</span>
            <small>Total experience</small>
            <strong>3 hours</strong>
          </article>
          <article>
            <span>02</span>
            <small>Complete gallery</small>
            <strong>All raw photos</strong>
          </article>
          <article>
            <span>03</span>
            <small>Professionally finished</small>
            <strong>15–40 edited photos</strong>
          </article>
        </div>
        <button className="button dark-button combo-book-cta" onClick={onBook}>
          <span className="cta-label">Book Full Combo</span>
          <span className="cta-icon" aria-hidden="true"><Arrow /></span>
        </button>
      </div>
    </section>
  );
}

const customerCategories = [
  {
    title: "Solo",
    slug: "solo-photoshoot",
    image: images.solo,
    label: "A portrait experience centred on you",
  },
  {
    title: "Couple",
    slug: "couple-photoshoot",
    image: images.couple,
    label: "A shared story in Hội An",
  },
  {
    title: "Family",
    slug: "family-photoshoot",
    image: images.family,
    label: "Natural memories across generations",
  },
  {
    title: "Group",
    slug: "group-photoshoot",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=88",
    label: "Friends, laughter and a day together",
  },
];

function CustomerCategories() {
  return (
    <section className="customer-categories section">
      <div className="category-heading">
        <div>
          <p className="eyebrow">DESIGNED AROUND YOUR STORY</p>
          <h2>Who are you creating memories with?</h2>
        </div>
        <p>
          Choose your category to view the experience details and package
          information.
        </p>
      </div>
      <div className="category-grid">
        {customerCategories.map((category, index) => (
          <a
            href={`/services/${category.slug}`}
            className="category-card"
            key={category.title}
          >
            <img
              src={category.image}
              alt={`${category.title} photoshoot in Hội An`}
            />
            <div className="category-shade" />
            <span>0{index + 1}</span>
            <div>
              <p>{category.label}</p>
              <h3>{category.title}</h3>
              <b>
                View pricing &amp; details <Arrow />
              </b>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Albums() {
  const { albums } = useCms();
  return (
    <section className="section albums">
      <div className="section-head">
        <div>
          <p className="eyebrow">SELECTED STORIES</p>
          <h2>
            Signature <em>Albums</em>
          </h2>
        </div>
        <p>
          A collection of personal stories photographed across timeless streets,
          riverside light and the cultural beauty of Hội An.
        </p>
      </div>
      <div className="album-grid">
        {albums.map((a, i) => (
          <a
            href={`/albums/${a.title.toLowerCase().replaceAll(" ", "-")}`}
            className={`album a${i + 1}`}
            key={a.title}
          >
            <img
              src={a.image}
              alt={a.title}
              data-placeholder-image="Replace with INHERE album"
            />
            <span className="album-num">{a.n}</span>
            <div>
              <p>{a.meta}</p>
              <h3>{a.title}</h3>
              <span>
                View story <Arrow />
              </span>
            </div>
          </a>
        ))}
      </div>
      <a className="button outline center" href="/albums">
        View All Albums <Arrow />
      </a>
    </section>
  );
}

function ServiceSelector({ onBook }: { onBook: () => void }) {
  const { services } = useCms();
  const [active, setActive] = useState(0);
  const s = services[active];
  return (
    <section className="service-section section">
      <div className="section-head">
        <div>
          <p className="eyebrow">TAILORED FOR YOU</p>
          <h2>
            Choose Your
            <br />
            <em>INHERE Experience.</em>
          </h2>
        </div>
        <p>
          Photography, styling and details brought together with calm guidance
          and a personal point of view.
        </p>
      </div>
      <div className="service-selector">
        <div className="service-list">
          {services.map((x, i) => (
            <button
              className={active === i ? "active" : ""}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              key={x.title}
            >
              <span>{x.id}</span>
              {x.title}
              <Arrow />
            </button>
          ))}
        </div>
        <div className="service-preview" key={s.title}>
          <img src={s.image} alt={s.title} />
          <div>
            <p>{s.copy}</p>
            <a
              href={
                s.slug === "outfits" || s.slug === "accessories"
                  ? `/rentals/${s.slug}`
                  : `/services/${s.slug}`
              }
            >
              Explore experience <Arrow />
            </a>
          </div>
        </div>
      </div>
      <div className="request-line">
        <span>Not sure what suits your story?</span>
        <button onClick={onBook}>
          Request Package Details <Arrow />
        </button>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    "Choose Your Experience",
    "Select Styling and Add-Ons",
    "Confirm Date and Preferences",
    "Enjoy Your Hội An Photoshoot",
    "Receive Your Curated Memories",
  ];
  return (
    <section className="process">
      <div className="process-photo">
        <img src={images.oldtown} alt="A quiet historic street in Hội An" />
      </div>
      <div className="process-content">
        <p className="eyebrow light">A SIMPLE, PERSONAL JOURNEY</p>
        <h2>
          From Your Idea to
          <br />
          <em>Your Final Album.</em>
        </h2>
        <ol>
          {steps.map((x, i) => (
            <li key={x}>
              <span>0{i + 1}</span>
              <div>
                <h3>{x}</h3>
                {i === 0 && (
                  <p>
                    Tell us what you imagine. We’ll guide you toward the
                    experience that best fits your story, group and time in Hội
                    An.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Experiences({ add }: { add: (x: string) => void }) {
  const { experiences } = useCms();
  return (
    <section className="section experience">
      <div className="section-head">
        <div>
          <p className="eyebrow">BEYOND THE PHOTOSHOOT</p>
          <h2>
            Complete Your
            <br />
            <em>Hội An Story.</em>
          </h2>
        </div>
        <p>
          Discover locally inspired experiences that can complement your visit,
          photography session or day in Hội An. Demo experiences shown pending
          provider confirmation.
        </p>
      </div>
      <div className="experience-grid">
        {experiences.map((x, i) => (
          <article key={x.title} className={i === 1 ? "raised" : ""}>
            <div className="image-wrap">
              <img src={x.image} alt={x.title} />
              <span>0{i + 1}</span>
            </div>
            <p className="eyebrow">{x.cat}</p>
            <h3>{x.title}</h3>
            <p>{x.duration} · Price to be confirmed</p>
            <div>
              <a
                href={`/experiences/${x.title.toLowerCase().replaceAll(" ", "-")}`}
              >
                View Experience <Arrow />
              </a>
              <button onClick={() => add(x.title)}>+ Add to plan</button>
            </div>
          </article>
        ))}
      </div>
      <a className="text-link dark section-link" href="/experiences">
        Discover all experiences <Arrow />
      </a>
    </section>
  );
}

function Blog() {
  const { articles } = useCms();
  return (
    <section className="blog section">
      <div className="section-head">
        <div>
          <p className="eyebrow">THE INHERE JOURNAL</p>
          <h2>
            Stories and Guides
            <br />
            <em>from Hội An.</em>
          </h2>
        </div>
        <a className="text-link dark" href="/blog">
          Visit the journal <Arrow />
        </a>
      </div>
      <div className="blog-grid">
        {articles.map((x, i) => (
          <a
            href={`/blog/${x.slug}`}
            key={x.title}
            className={`post p${i + 1}`}
          >
            <img src={x.image} alt={x.title} />
            <p className="eyebrow">
              {x.cat} · 0{i + 1}
            </p>
            <h3>{x.title}</h3>
            <p>{x.excerpt}</p>
            <span>
              Read story <Arrow />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function JournalIndex() {
  const { articles } = useCms();
  const [featured, setFeatured] = useState(0);
  const [category, setCategory] = useState("All");
  const categories = ["All", "Hội An Travel Guides", "Photography Spots", "What to Wear"];
  const visible = category === "All"
    ? articles
    : articles.filter((article) => {
        const value = `${article.cat} ${article.title}`.toLowerCase();
        if (category === "Photography Spots") return value.includes("photo") || value.includes("location");
        if (category === "What to Wear") return value.includes("wear") || value.includes("ao dai") || value.includes("áo dài");
        return value.includes("guide") || value.includes("hội an");
      });
  const lead = articles[featured % Math.max(articles.length, 1)];

  useEffect(() => {
    if (articles.length < 2) return;
    const timer = window.setInterval(() => setFeatured((current) => (current + 1) % articles.length), 6500);
    return () => window.clearInterval(timer);
  }, [articles.length]);

  return (
    <main className="journal-index">
      <header className="journal-index-head">
        <p>THE INHERE JOURNAL · HỘI AN</p>
        <h1>Travel slowly.<br /><em>See more beautifully.</em></h1>
        <span>Practical local guides, thoughtful photography advice and considered ideas for your time in Hội An.</span>
      </header>
      {lead && <section className="journal-featured" aria-label="Featured travel guides">
        <img src={lead.image} alt={lead.title} />
        <div className="journal-featured-shade" />
        <div className="journal-featured-copy">
          <p>FEATURED GUIDE · {lead.cat}</p>
          <h2>{lead.title}</h2>
          <span>{lead.excerpt}</span>
          <a href={`/blog/${lead.slug}`}>Read the guide <Arrow /></a>
        </div>
        {articles.length > 1 && <div className="journal-featured-controls">
          <button onClick={() => setFeatured((featured - 1 + articles.length) % articles.length)} aria-label="Previous featured article">←</button>
          <span>{String(featured + 1).padStart(2, "0")} / {String(articles.length).padStart(2, "0")}</span>
          <button onClick={() => setFeatured((featured + 1) % articles.length)} aria-label="Next featured article">→</button>
        </div>}
      </section>}
      <section className="journal-library">
        <div className="journal-library-head"><div><p>EXPLORE THE JOURNAL</p><h2>Guides for a better<br /><em>Hội An journey.</em></h2></div>
          <div className="journal-categories" aria-label="Article categories">
            {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
        </div>
        <div className="journal-article-grid">
          {visible.map((article) => <a href={`/blog/${article.slug}`} key={article.slug} className="journal-article-card">
            <div><img src={article.image} alt={article.title} loading="lazy" /><span>{article.cat}</span></div>
            <time>{article.date ? new Date(article.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "INHERE Journal"}</time>
            <h2>{article.title}</h2><p>{article.excerpt}</p><b>Read article <Arrow /></b>
          </a>)}
        </div>
      </section>
    </main>
  );
}

function JournalArticle({ article }: { article: CmsArticle }) {
  const { articles } = useCms();
  const rawSections = (article.content || "").split(/\n(?=#{1,3}\s)/).map((part) => part.trim()).filter(Boolean);
  const sections = rawSections.length > 1 ? rawSections.map((part, index) => {
    const lines = part.split("\n");
    const heading = lines[0].replace(/^#{1,3}\s*/, "") || `Travel note ${index + 1}`;
    return { id: heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), heading, body: lines.slice(1).join("\n").trim() || "Add your detailed English article copy and supporting images here." };
  }) : [
    { id: "why-this-guide-matters", heading: "Why this guide matters", body: article.content || article.excerpt },
    { id: "planning-your-time", heading: "Planning your time in Hội An", body: "Use this section for practical timings, locations, prices and first-hand recommendations. Keep each paragraph focused so travelers can scan the guide easily." },
    { id: "local-photography-tips", heading: "Local photography tips", body: "Add useful, experience-led advice about light, clothing, crowds and the best way to move through the Ancient Town comfortably." },
  ];
  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 3);
  return <main className="journal-single">
    <header className="journal-single-hero"><img src={article.image} alt={article.title} /><div /><p>{article.cat} · INHERE JOURNAL</p><h1>{article.title}</h1><span>{article.excerpt}</span></header>
    <div className="journal-reading-layout">
      <article className="journal-reading">
        <nav className="article-toc" aria-label="Table of contents"><p>IN THIS GUIDE</p><h2>Table of Contents</h2><ol>{sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}</a></li>)}</ol></nav>
        {sections.map((section, index) => <section id={section.id} key={section.id}><p className="article-section-number">0{index + 1}</p><h2>{section.heading}</h2>{section.body.split("\n").map((text, i) => <p key={i}>{text}</p>)}{index === 0 && <div className="article-promo"><span>THE COMPLETE HỘI AN EXPERIENCE</span><h3>Áo Dài, makeup and a professional photoshoot—planned as one seamless experience.</h3><a href="/services">Explore Full-Combo Packages <Arrow /></a></div>}</section>)}
        <aside className="journal-author"><div>IN</div><span><b>About the INHERE Team</b><p>Local photographers and stylists sharing practical Hội An knowledge, Vietnamese aesthetics and thoughtful ways to preserve your journey.</p></span></aside>
      </article>
      <aside className="journal-sticky-promo"><img src={images.solo} alt="Full-Combo Áo Dài and photoshoot" /><p>INHERE SIGNATURE</p><h2>Full-Combo Áo Dài &amp; Photoshoot</h2><span>3 hours · outfit · makeup · photoshoot · edited photographs</span><a href="/services">View Pricing &amp; Book <Arrow /></a></aside>
    </div>
    <section className="journal-related"><p>CONTINUE READING</p><h2>Related travel stories</h2><div>{related.map((item) => <a href={`/blog/${item.slug}`} key={item.slug}><img src={item.image} alt={item.title} loading="lazy" /><span>{item.cat}</span><h3>{item.title}</h3></a>)}</div></section>
  </main>;
}

type GoogleReview = {
  id: string;
  author: string;
  authorUri: string | null;
  avatar: string | null;
  rating: number;
  text: string;
  published: string;
  googleMapsUri: string;
};
type GoogleReviewData = {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  googleMapsUri: string;
  reviews: GoogleReview[];
};

function GoogleReviews() {
  const [data, setData] = useState<GoogleReviewData | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    void fetch("/api/google-reviews")
      .then((response) => {
        if (!response.ok) throw new Error("Reviews unavailable");
        return response.json() as Promise<GoogleReviewData>;
      })
      .then((reviews) => active && setData(reviews))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, []);
  const profile =
    data?.googleMapsUri || "https://share.google/f9N75ZoAa9r6lJhJ1";
  return (
    <section
      className="google-reviews section"
      aria-labelledby="google-reviews-title"
    >
      <div className="google-review-heading">
        <div>
          <p className="eyebrow">AUTHENTIC GOOGLE REVIEWS</p>
          <h2 id="google-reviews-title">
            Loved by guests from around the world.
          </h2>
        </div>
        <a
          href={profile}
          target="_blank"
          rel="noreferrer"
          className="google-rating"
        >
          <span className="google-g">G</span>
          <div>
            <strong>{data ? data.rating.toFixed(1) : "5.0"}</strong>
            <span
              className="google-stars"
              aria-label={`${data?.rating || 5} out of 5 stars`}
            >
              ★★★★★
            </span>
            <small>
              {data ? `${data.reviewCount} Google reviews` : "Google Reviews"}
            </small>
          </div>
          <b>View profile ↗</b>
        </a>
      </div>
      {!data && !failed ? (
        <div className="google-review-loading">
          Loading live Google reviews…
        </div>
      ) : data?.reviews.length ? (
        <div className="google-review-grid">
          {data.reviews.map((review) => (
            <article className="google-review-card" key={review.id}>
              <div className="google-review-author">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{review.author.slice(0, 1)}</span>
                )}
                <div>
                  <strong>{review.author}</strong>
                  <small>{review.published}</small>
                </div>
                <b>G</b>
              </div>
              <div
                className="google-stars"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {"★".repeat(Math.round(review.rating))}
              </div>
              <p>{review.text}</p>
              <a
                href={review.googleMapsUri || profile}
                target="_blank"
                rel="noreferrer"
              >
                Read on Google ↗
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="google-review-fallback">
          <p>
            Explore verified guest experiences directly on our Google profile.
          </p>
          <a
            className="button dark-button"
            href={profile}
            target="_blank"
            rel="noreferrer"
          >
            Read Google Reviews <Arrow />
          </a>
        </div>
      )}
      <p className="google-attribution">
        Reviews and ratings provided by Google Maps.
      </p>
    </section>
  );
}

const studioReels = [
  {
    title: "Silk in motion",
    category: "Áo Dài Portrait",
    video:
      "https://videos.pexels.com/video-files/3015510/3015510-hd_1080_1920_24fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=900&q=88",
    instagramUrl: "https://www.instagram.com/",
  },
  {
    title: "Old Town light",
    category: "Golden Hour",
    video:
      "https://videos.pexels.com/video-files/4763824/4763824-hd_1080_1920_24fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=88",
    instagramUrl: "https://www.instagram.com/",
  },
  {
    title: "A quiet love story",
    category: "Couple Session",
    video:
      "https://videos.pexels.com/video-files/4065218/4065218-hd_1080_1920_25fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=88",
    instagramUrl: "https://www.instagram.com/",
  },
  {
    title: "Lantern evenings",
    category: "Hội An After Dark",
    video:
      "https://videos.pexels.com/video-files/3571264/3571264-hd_1080_1920_30fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=88",
    instagramUrl: "https://www.instagram.com/",
  },
];

function ReelCard({
  reel,
  index,
}: {
  reel: (typeof studioReels)[number];
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const instagramCode = reel.instagramUrl.match(
    /instagram\.com\/(?:reel|p|tv)\/([^/?#]+)/i,
  )?.[1];
  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    void video
      .play()
      .then(() => setPlaying(true))
      .catch(() => undefined);
  };
  const pause = () => {
    videoRef.current?.pause();
    setPlaying(false);
  };
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !window.matchMedia("(max-width: 700px)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.65) play();
        else pause();
      },
      { threshold: [0.2, 0.65, 0.9] },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return (
    <article
      className={`reel-card${playing ? " is-playing" : ""}${instagramCode ? " is-instagram" : ""}`}
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
    >
      {reel.video ? (
        <video
          ref={videoRef}
          src={reel.video}
          poster={reel.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={reel.title}
        />
      ) : instagramCode ? (
        <div className="instagram-reel-shell">
          <iframe
            className="instagram-reel-embed"
            src={`https://www.instagram.com/reel/${instagramCode}/embed/`}
            title={reel.title}
            loading="lazy"
            scrolling="no"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </div>
      ) : (
        <img src={reel.poster || images.solo} alt={reel.title} />
      )}
      {instagramCode ? (
        <div className="reel-instagram-meta">
          <div>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{reel.category}</p>
            <h3>{reel.title}</h3>
          </div>
          <a href={reel.instagramUrl} target="_blank" rel="noreferrer">
            Open Reel ↗
          </a>
        </div>
      ) : (
        <>
          <div className="reel-wash" />
          <span className="reel-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="reel-play" aria-hidden="true">
            {playing ? "II" : "▶"}
          </span>
          <div className="reel-copy">
            <p>{reel.category}</p>
            <h3>{reel.title}</h3>
            <a href={reel.instagramUrl} target="_blank" rel="noreferrer">
              Watch on Instagram ↗
            </a>
          </div>
        </>
      )}
    </article>
  );
}

function Reels() {
  const { reels } = useCms();
  const visibleReels = reels.length ? reels : studioReels;
  return (
    <>
      <section className="reels section" aria-label="INHERE studio reels">
        <div className="reels-title">
          <div>
            <p className="eyebrow">BEHIND THE FRAME · STUDIO REELS</p>
            <h2>
              Stories that move
              <br />
              <em>beyond the photograph.</em>
            </h2>
          </div>
          <div>
            Explore recent stories from our studio. Use the Instagram play
            control inside each frame, or open the original Reel in one tap.
          </div>
        </div>
        <div className="reels-track">
          {visibleReels.map((reel, index) => (
            <ReelCard key={reel.title} reel={reel} index={index} />
          ))}
        </div>
        <div className="reels-marquee" aria-hidden="true">
          <span>
            Portraits in motion · Hội An stories · Behind the frame ·{" "}
          </span>
          <span>
            Portraits in motion · Hội An stories · Behind the frame ·{" "}
          </span>
        </div>
      </section>
      <GoogleReviews />
    </>
  );
}

function Booking({
  open,
  close,
  preset,
}: {
  open: boolean;
  close: () => void;
  preset?: string;
}) {
  const { services } = useCms();
  const [step, setStep] = useState(1);
  const [service, setService] = useState(preset || "Couple Photoshoot");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  useEffect(() => {
    if (open) {
      setStep(1);
      setService(preset || "Couple Photoshoot");
      setResultMessage("");
    }
  }, [open, preset]);
  if (!open) return null;
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;
    setSubmitting(true);
    setResultMessage("");
    const selectedPackage = pricingPackages.find((pkg) => pkg.title === service);
    const packageContext = selectedPackage
      ? `Selected package price: ${selectedPackage.price}. Package inclusion: ${selectedPackage.short}; ${selectedPackage.makeup}.`
      : "Submitted through the guided booking form.";
    const { error } = await supabase.from("booking_requests").insert({
      customer_name: name.trim(),
      phone: contact.trim(),
      preferred_date: date || null,
      service_name: service,
      guest_count: Number(people) || 1,
      notes: `${packageContext} Customer notes: ${notes.trim() || "None."}`,
    });
    setSubmitting(false);
    if (error) {
      setResultMessage("We couldn't send your request. Please contact us on WhatsApp.");
      return;
    }
    setResultMessage("Thank you — your booking request has been received.");
  };
  const bookingChoices = Array.from(
    new Set([
      ...pricingPackages.map((pkg) => pkg.title),
      ...services.map((item) => item.title),
      "Custom Request",
    ]),
  );
  return (
    <div
      className="booking"
      role="dialog"
      aria-modal="true"
      aria-label="Booking request"
    >
      <button className="booking-close" onClick={close}>
        Close ×
      </button>
      <div className="booking-mark">
        INHERE <span>BOOKING REQUEST</span>
      </div>
      <div className="booking-body">
        <p className="eyebrow">STEP 0{step} OF 03</p>
        <div className="booking-progress">
          <i style={{ width: `${(step / 3) * 100}%` }} />
        </div>
        <form onSubmit={submit}>
          {step === 1 && (
            <>
              <h2>
                What would you like to <em>experience?</em>
              </h2>
              <div className="choice-grid">
                {bookingChoices.map(
                  (x) => (
                    <button
                      type="button"
                      onClick={() => setService(x)}
                      className={service === x ? "selected" : ""}
                      key={x}
                    >
                      {x}
                      <span>{service === x ? "✓" : "+"}</span>
                    </button>
                  ),
                )}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <h2>
                When are you visiting <em>Hội An?</em>
              </h2>
              <label>
                Preferred date
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
              <label>
                Number of guests
                <input
                  type="number"
                  min="1"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                />
              </label>
              <label>
                Your name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                />
              </label>
              <label>
                WhatsApp / Social contact
                <input
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Number, username or profile link"
                />
              </label>
            </>
          )}
          {step === 3 && (
            <>
              <h2>
                Review your <em>request.</em>
              </h2>
              <div className="summary">
                <p>
                  <span>Experience</span>
                  {service}
                </p>
                <p>
                  <span>Date</span>
                  {date || "To discuss"}
                </p>
                <p>
                  <span>Guests</span>
                  {people}
                </p>
              </div>
              <label>
                Anything else we should know?
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Styling, timing or location ideas…"
                />
              </label>
              <small>
                This is a booking request. Your appointment is confirmed only
                after INHERE responds.
              </small>
            </>
          )}
          <div className="booking-nav">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)}>
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                key="continue"
                type="button"
                disabled={step === 2 && (!name.trim() || !contact.trim())}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setStep((current) => Math.min(current + 1, 3));
                }}
              >
                Continue →
              </button>
            ) : (
              <button key="send" type="submit" disabled={submitting || Boolean(resultMessage && resultMessage.startsWith("Thank"))}>
                {submitting ? "Sending…" : "Send Booking Request"} <Arrow />
              </button>
            )}
          </div>
          {resultMessage && <p className="booking-result" role="status">{resultMessage}</p>}
        </form>
      </div>
    </div>
  );
}

function Footer({ onBook }: { onBook: () => void }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [service, setService] = useState("Rental Ao Dai");
  const [submitting, setSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  const submitBooking = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setBookingMessage("");
    const { error } = await supabase.from("booking_requests").insert({
      customer_name: name.trim(),
      phone: contact.trim(),
      preferred_date: date,
      service_name: service,
      guest_count: 1,
      notes: "Submitted from the footer booking form",
    });
    setSubmitting(false);
    if (error) {
      setBookingMessage(
        "We couldn't send your request. Please contact us on WhatsApp.",
      );
      return;
    }
    setName("");
    setContact("");
    setDate("");
    setService("Rental Ao Dai");
    setBookingMessage("Thank you — your booking request has been received.");
  };

  return (
    <footer>
      <div className="footer-cta">
        <div className="footer-orbit" aria-hidden="true">
          ✦
        </div>
        <p className="eyebrow light">LET’S CREATE SOMETHING BEAUTIFUL</p>
        <h2>
          Your Hội An story
          <br />
          <em>starts here.</em>
        </h2>
        <button className="button ivory" onClick={onBook}>
          Book Your Experience <Arrow />
        </button>
      </div>
      <div className="footer-main">
        <div className="footer-logo">
          <div className="footer-avatar">
            <img src={logo} alt="INHERE Ao Dai, makeup and photoshoot" />
          </div>
          <p>
            Premium photography, Vietnamese styling and curated cultural
            experiences in Hội An.
          </p>
          <iframe
            className="footer-map"
            title="INHERE Studio at 24 Đào Duy Từ, Hội An"
            src="https://www.google.com/maps?q=24%20%C4%90%C3%A0o%20Duy%20T%E1%BB%AB%2C%20H%E1%BB%99i%20An&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="footer-connect">
          <p className="eyebrow light">CONNECT &amp; CONTACT</p>
          <a
            className="footer-address"
            href="https://www.google.com/maps/search/?api=1&query=24%20%C4%90%C3%A0o%20Duy%20T%E1%BB%AB%2C%20H%E1%BB%99i%20An"
            target="_blank"
          >
            <FaLocationDot /> 24 Đào Duy Từ, Hội An
          </a>
          <div className="footer-contact-list">
            <a href="tel:+84898199099">
              <span className="footer-channel-icon">
                <FaPhone />
              </span>
              <span className="footer-channel-copy">
                <small>Phone / Hotline</small>
                <b>+84 898 199 099</b>
              </span>
            </a>
            <a href={WA} target="_blank">
              <span className="footer-channel-icon whatsapp">
                <FaWhatsapp />
              </span>
              <span className="footer-channel-copy">
                <small>WhatsApp</small>
                <b>+84 898 199 099</b>
              </span>
            </a>
            <a
              href="line://ti/p/+84898199099"
              aria-label="Open LINE and contact INHERE at +84 898 199 099"
            >
              <span className="footer-channel-icon line">
                <SiLine />
              </span>
              <span className="footer-channel-copy">
                <small>LINE</small>
                <b>+84 898 199 099</b>
              </span>
            </a>
            <a
              href="kakaotalk://"
              aria-label="Open KakaoTalk to contact INHERE at +84 898 199 099"
            >
              <span className="footer-channel-icon kakao">
                <SiKakaotalk />
              </span>
              <span className="footer-channel-copy">
                <small>KakaoTalk</small>
                <b>+84 898 199 099</b>
              </span>
            </a>
            <a
              href="weixin://"
              aria-label="Open WeChat to contact INHERE at +84 898 199 099"
            >
              <span className="footer-channel-icon wechat">
                <SiWechat />
              </span>
              <span className="footer-channel-copy">
                <small>WeChat</small>
                <b>+84 898 199 099</b>
              </span>
            </a>
          </div>
          <div className="footer-social-icons" aria-label="Social media">
            <a href={IG} target="_blank" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href={FB} target="_blank" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href={TIKTOK} target="_blank" aria-label="TikTok">
              <FaTiktok />
            </a>
            <a href={YOUTUBE} target="_blank" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
          <span className="footer-status">
            <i /> Currently accepting bookings
          </span>
        </div>
        <div className="footer-booking" id="footer-booking-form">
          <p className="eyebrow light">DIRECT BOOKING</p>
          <h3>Book Your Experience</h3>
          <form onSubmit={submitBooking}>
            <label>
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
              />
            </label>
            <label>
              WhatsApp / Social App link
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                placeholder="Number, username or profile link"
              />
            </label>
            <label>
              Expected Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
            <label>
              Service of Interest
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {[
                  "Rental Ao Dai",
                  "Full Combo",
                  "Solo",
                  "Couple",
                  "Family",
                  "Group",
                ].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Send Booking Request"} <Arrow />
            </button>
            {bookingMessage && (
              <p className="footer-form-message" role="status">
                {bookingMessage}
              </p>
            )}
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 INHERE. All rights reserved.</span>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Back to top ↑
        </button>
        <span>AO DAI · MAKEUP · PHOTOSHOOT</span>
      </div>
    </footer>
  );
}

const pageProfiles: Record<
  string,
  {
    kicker: string;
    heading: string;
    lead: string;
    features: string[];
    image: string;
  }
> = {
  services: {
    kicker: "PHOTOGRAPHY, DESIGNED AROUND YOU",
    heading: "A session that feels like your story.",
    lead: "Choose a quiet portrait, a romantic walk through the Old Town or an easy family experience. Every session begins with your pace, personality and vision.",
    features: [
      "Couple, solo and family direction",
      "Location and light planning",
      "Curated final image selection",
    ],
    image: images.solo,
  },
  rentals: {
    kicker: "VIETNAMESE STYLE, THOUGHTFULLY CURATED",
    heading: "Find the look that feels entirely yours.",
    lead: "Explore Ao Dai silhouettes, tones and accessories selected to complement Hội An’s architecture, light and your personal style.",
    features: [
      "Ao Dai styling guidance",
      "Accessories selected for your concept",
      "Makeup inquiry available",
    ],
    image: images.lantern,
  },
  albums: {
    kicker: "A LIVING ARCHIVE OF HỘI AN",
    heading: "Every album holds a different atmosphere.",
    lead: "Wander through love stories, quiet portraits and family journeys photographed in the changing colors of Hội An.",
    features: [
      "Editorial couple stories",
      "Ao Dai portrait studies",
      "Family and riverside sessions",
    ],
    image: images.couple,
  },
  experiences: {
    kicker: "BEYOND THE PHOTOGRAPH",
    heading: "Make the whole day worth remembering.",
    lead: "Pair your session with locally inspired workshops, lantern-lit walks and slow cultural moments shaped around your visit.",
    features: [
      "Locally inspired activities",
      "Easy additions to your photo plan",
      "Flexible itinerary guidance",
    ],
    image: images.craft,
  },
  blog: {
    kicker: "NOTES FROM THE OLD TOWN",
    heading: "Local light, thoughtful guides and visual ideas.",
    lead: "Read practical photography advice, styling notes and considered recommendations for experiencing Hội An beautifully.",
    features: [
      "Location guides",
      "Styling and Ao Dai advice",
      "Golden-hour planning",
    ],
    image: images.oldtown,
  },
  about: {
    kicker: "THE POINT OF VIEW BEHIND INHERE",
    heading: "We photograph feeling, not performance.",
    lead: "INHERE brings calm direction, Vietnamese aesthetics and a deep affection for Hội An into every frame we create.",
    features: [
      "A personal, unhurried approach",
      "Cultural detail with modern restraint",
      "Memories designed to feel timeless",
    ],
    image: images.river,
  },
  contact: {
    kicker: "START A CONVERSATION",
    heading: "Tell us what you want to remember.",
    lead: "Share your dates, group and visual ideas. We’ll help shape a clear, personal plan for your time in Hội An.",
    features: [
      "WhatsApp planning",
      "English and Vietnamese support",
      "Personal package guidance",
    ],
    image: images.river,
  },
  book: {
    kicker: "YOUR EXPERIENCE BEGINS HERE",
    heading: "A few details, then we shape the story together.",
    lead: "Choose your experience, preferred date and group size. Your request is reviewed personally before anything is confirmed.",
    features: [
      "No-pressure booking request",
      "Clear confirmation by WhatsApp",
      "Flexible concept planning",
    ],
    image: images.solo,
  },
};

const pricingPackages = [
  {
    title: "Solo Package",
    price: "1,800,000 VND",
    short: "1 outfit & full accessories",
    makeup: "1 makeup & hair session (female)",
  },
  {
    title: "Couple Package",
    price: "2,700,000 VND",
    short: "2 outfits & full accessories",
    makeup: "1 makeup & hair session (female)",
  },
  {
    title: "Family Package",
    price: "Starts from 3,500,000 VND",
    short: "Outfits & accessories for all",
    makeup: "Makeup & hair based on selection",
  },
  {
    title: "Friend Group",
    price: "Starts from 2,900,000 VND",
    short: "Outfits & accessories for all",
    makeup: "Makeup & hair for all females",
  },
];

const galleryFallback = [
  { src: images.solo, category: "Solo", alt: "Solo portrait in Hội An" },
  { src: `${images.oldtown}&crop=faces`, category: "Solo", alt: "Áo Dài portrait in the Ancient Town" },
  { src: `${images.lantern}&crop=faces`, category: "Solo", alt: "Hội An lantern portrait" },
  { src: `${images.solo}&sat=-10`, category: "Solo", alt: "Editorial solo portrait" },
  { src: `${images.oldtown}&fit=crop&crop=top`, category: "Solo", alt: "Traditional styling in Hội An" },
  { src: `${images.river}&fit=crop&crop=top`, category: "Solo", alt: "Riverside solo portrait" },
  { src: images.couple, category: "Couple", alt: "Couple photography in Hội An" },
  { src: `${images.river}&crop=faces`, category: "Couple", alt: "Couple story by the Hội An riverside" },
  { src: `${images.hero}&crop=faces`, category: "Couple", alt: "Couple experience in the Ancient Town" },
  { src: `${images.couple}&sat=-8`, category: "Couple", alt: "Romantic Hội An couple session" },
  { src: `${images.hero}&fit=crop&crop=top`, category: "Couple", alt: "Couple walk through Hội An" },
  { src: `${images.lantern}&fit=crop&crop=center`, category: "Couple", alt: "Lantern-lit couple photographs" },
  { src: images.family, category: "Family & Group", alt: "Family photoshoot in Hội An" },
  { src: `${images.craft}&crop=faces`, category: "Family & Group", alt: "Friend group cultural portrait" },
  { src: `${images.family}&crop=entropy`, category: "Family & Group", alt: "Group photographs in Hội An" },
  { src: `${images.family}&sat=-10`, category: "Family & Group", alt: "Relaxed family portraits" },
  { src: `${images.craft}&fit=crop&crop=top`, category: "Family & Group", alt: "Friends sharing a Hội An experience" },
  { src: `${images.oldtown}&fit=crop&crop=center`, category: "Family & Group", alt: "Family in the Ancient Town" },
];

const lookbookFallback = [
  { src: images.oldtown, category: "Classic Áo Dài", alt: "Classic Áo Dài portrait in Hội An Ancient Town" },
  { src: `${images.solo}&crop=faces`, category: "Classic Áo Dài", alt: "Traditional Áo Dài outdoors in Hội An" },
  { src: `${images.craft}&crop=faces`, category: "Historical Costumes", alt: "Vietnamese historical costume portrait" },
  { src: `${images.oldtown}&crop=top`, category: "Historical Costumes", alt: "Cổ Phục styling in the Ancient Town" },
  { src: `${images.river}&sat=-8`, category: "Morning Serenity", alt: "Quiet early morning portrait by the Hội An river" },
  { src: `${images.solo}&sat=-12`, category: "Morning Serenity", alt: "Soft morning portrait in Hội An" },
  { src: images.lantern, category: "Lantern Night Vibe", alt: "Lantern night photography in Hội An" },
  { src: `${images.lantern}&crop=faces`, category: "Lantern Night Vibe", alt: "Portrait beneath Hội An lanterns" },
  { src: `${images.river}&crop=top`, category: "Golden Hour & Rooftops", alt: "Golden hour portrait over Hội An rooftops" },
  { src: `${images.hero}&sat=-5`, category: "Golden Hour & Rooftops", alt: "Warm rooftop photography in Hội An" },
  { src: images.solo, category: "The Solo Muse", alt: "Solo muse portrait in Hội An" },
  { src: `${images.oldtown}&crop=faces`, category: "The Solo Muse", alt: "Outdoor solo portrait beside bougainvillea streets" },
  { src: images.couple, category: "Couples & Romance", alt: "Romantic couple photography in Hội An" },
  { src: `${images.hero}&crop=faces`, category: "Couples & Romance", alt: "Couple walking through Hội An Ancient Town" },
  { src: `${images.river}&crop=faces`, category: "Couples & Romance", alt: "Riverside couple portrait at golden hour" },
];

function LookbookPage() {
  const { albums } = useCms();
  const categories = [
    ["All", "Tất cả"],
    ["Classic Áo Dài", "Áo Dài truyền thống"],
    ["Historical Costumes", "Việt Phục/Cổ Phục"],
    ["Morning Serenity", "Chụp sáng sớm"],
    ["Lantern Night Vibe", "Đêm Phố Cổ"],
    ["Golden Hour & Rooftops", "Hoàng hôn & Cafe Sân Thượng"],
    ["The Solo Muse", "Chân dung Nàng thơ"],
    ["Couples & Romance", "Ảnh Cặp đôi"],
  ];
  const [filter, setFilter] = useState("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const cmsImages = albums.map((album, index) => {
    const meta = `${album.meta} ${album.title}`.toLowerCase();
    const category = meta.includes("couple") || meta.includes("love")
      ? "Couples & Romance"
      : meta.includes("lantern") || meta.includes("night")
        ? "Lantern Night Vibe"
        : meta.includes("golden") || meta.includes("rooftop")
          ? "Golden Hour & Rooftops"
          : meta.includes("family") || meta.includes("group")
            ? "Classic Áo Dài"
            : "The Solo Muse";
    return { src: album.image, category, alt: `${album.title} — outdoor photography in Hội An`, key: `cms-${index}` };
  });
  const allImages = [...cmsImages, ...lookbookFallback.map((item, index) => ({ ...item, key: `fallback-${index}` }))]
    .filter((item, index, all) => all.findIndex((candidate) => candidate.src === item.src) === index);
  const visible = filter === "All" ? allImages : allImages.filter((item) => item.category === filter);
  const active = activeIndex === null ? null : visible[activeIndex];
  const move = useCallback((direction: number) => {
    setActiveIndex((current) => current === null || !visible.length ? current : (current + direction + visible.length) % visible.length);
  }, [visible.length]);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [active, move]);

  return <main className="lookbook-page">
    <section className="lookbook-hero">
      <img src={images.lantern} alt="Vibrant lantern night photography in Hội An" />
      <div />
      <p>OUTDOOR STORIES · HỘI AN</p>
      <h1>The INHERE <em>Lookbook</em></h1>
      <span>Timeless moments captured in the heart of Hội An.</span>
      <a href="#lookbook-gallery">Explore the stories <span>↓</span></a>
    </section>
    <section className="lookbook-gallery-section" id="lookbook-gallery">
      <header><p>ANCIENT TOWN · NATURAL LIGHT · REAL MOMENTS</p><h2>Photographed entirely<br /><em>outdoors in Hội An.</em></h2></header>
      <nav className="lookbook-filters" aria-label="Filter portfolio">
        {categories.map(([en, vi]) => <button key={en} className={filter === en ? "active" : ""} onClick={() => { setFilter(en); setActiveIndex(null); }}><b>{en}</b><span>{vi}</span></button>)}
      </nav>
      <div className="lookbook-grid">
        {visible.map((item, index) => <button key={item.key} onClick={() => setActiveIndex(index)} aria-label={`Open ${item.alt}`}>
          <img src={item.src} alt={item.alt} loading="lazy" />
          <span><b>{String(index + 1).padStart(2, "0")}</b>{item.category}</span>
        </button>)}
      </div>
      {!visible.length && <p className="lookbook-empty">More outdoor stories for this collection are coming soon.</p>}
    </section>
    <section className="lookbook-cta"><p>YOUR HỘI AN STORY</p><h2>Inspired by these stories?<br /><em>Let us capture yours.</em></h2><a href="/#footer-booking-form">Book Your Experience <Arrow /></a></section>
    {active && <div className="lookbook-lightbox" role="dialog" aria-modal="true" aria-label="Portfolio image viewer">
      <button className="lookbook-close" onClick={() => setActiveIndex(null)} aria-label="Close lightbox">Close ×</button>
      <button className="lookbook-prev" onClick={() => move(-1)} aria-label="Previous image">←</button>
      <figure><img src={active.src} alt={active.alt} /><figcaption><span>{active.category}</span><b>{String((activeIndex || 0) + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}</b></figcaption></figure>
      <button className="lookbook-next" onClick={() => move(1)} aria-label="Next image">→</button>
    </div>}
  </main>;
}

const faqGroups = [
  {
    title: "Booking & Weather",
    note: "Planning your outdoor experience",
    items: [
      ["What happens if it rains on the day of my photoshoot?", "Since we shoot exclusively outdoors in the Ancient Town, weather is a factor. In case of light rain, we offer clear umbrellas for a cinematic concept. If it rains heavily, we will work with you to reschedule the shoot during your stay in Hội An."],
      ["Do I need to book in advance?", "Yes, especially for Full Combo packages. We recommend booking at least 1–2 weeks in advance. For standalone outfit rentals, walk-ins at our store are welcome."],
    ],
  },
  {
    title: "Photos & Edits",
    note: "Delivery, selection and timing",
    items: [
      ["When will I receive my photos?", "We will send you a Google Drive link containing all the raw photos on the same day of your shoot."],
      ["How many edited photos do I get?", "You will select your favorites, and we will return 15 to 40 professionally edited photos within 3 to 7 days after you make your selection."],
      ["How long is the photoshoot?", "The outdoor photoshoot itself lasts for 1.5 hours, giving us plenty of time to explore iconic spots. The total experience is 3 hours, including outfit selection and makeup."],
    ],
  },
  {
    title: "Outfits & Makeup",
    note: "Rental flexibility and care",
    items: [
      ["Can I just rent an outfit without the photoshoot or makeup?", "Absolutely. We offer a standalone outfit rental service starting from 200,000 VND, which includes matching accessories such as a conical hat and wooden fan."],
      ["What if I damage the rented outfit?", "Minor wear and tear is expected. However, for significant damage—such as burns, large tears or tough stains—a repair or replacement fee will apply based on the specific item."],
    ],
  },
];

const fullPackagePrices = [
  ["1", "1-Person Package", "Gói 1 người", "1,800,000 VND"],
  ["2", "Couple Package", "Gói couple / Cặp đôi", "2,700,000 VND"],
  ["3", "2-Person Package (2 Females)", "Gói 2 người – 2 nữ", "2,900,000 VND"],
  ["4", "3-Person Package (3 Females)", "Gói 3 người – 3 nữ", "3,900,000 VND"],
  ["5", "4-Person Package (4 Females)", "Gói 4 người – 4 nữ", "4,600,000 VND"],
  ["6", "5-Person Package (5 Females)", "Gói 5 người – 5 nữ", "5,250,000 VND"],
  ["7", "6-Person Package (6 Females)", "Gói 6 người – 6 nữ", "6,000,000 VND"],
  ["8", "Family: 3 Persons / 1 Young Child", "Gói gđ 3 người / 1 bé nhỏ", "3,500,000 VND"],
  ["9", "Family: 4 Persons / 2 Young Children", "Gói gđ 4 người / 2 bé nhỏ", "4,000,000 VND"],
  ["10", "Family: 5 Persons / 3 Young Children", "Gói gđ 5 người / 3 bé nhỏ", "4,500,000 VND"],
  ["11", "Family: 6 Persons / 4 Young Children", "Gói gđ 6 người / 4 bé nhỏ", "5,000,000 VND"],
];

const packageDetails = [
  { number: "01", name: "Solo Package", price: "1,800,000 VND", intro: "Full package for 1 person", items: ["Photoshoot for 1 person", "1 makeup and hairstyling session for a female guest", "1 outfit of your choice", "All accessories: heels, conical hat, handbag, headpiece, earrings, necklace, shawl, transparent umbrella and wooden fan"] },
  { number: "02", name: "Couple Package", price: "2,700,000 VND", intro: "Full package for 2 persons", items: ["Photoshoot for 2 persons", "1 makeup and hairstyling session for a female guest", "2 outfits of your choice — 1 per person", "All accessories included for both guests"] },
  { number: "03", name: "Family Package", price: "From 3,500,000 VND", intro: "Price varies with the exact number of family members", items: ["Photoshoot for the whole family", "Makeup and hairstyling for the mother/adult females based on the selected package", "Outfits of your choice for all family members", "All accessories included"] },
  { number: "04", name: "Friend Group Package", price: "From 2,900,000 VND", intro: "For 2 or more persons; price varies by group size", items: ["Photoshoot for the whole group", "Makeup and hairstyling for all female group members", "Outfits of your choice for every group member", "All accessories included"] },
];

function FaqPoliciesPage() {
  return <main className="faq-page">
    <section className="faq-hero"><img src={images.oldtown} alt="Outdoor INHERE photography experience in Hội An" /><div /><p>BEFORE YOUR EXPERIENCE · INHERE</p><h1>Frequently Asked <em>Questions</em></h1><span>Everything you need to know before your Hội An experience with INHERE.</span><a href="#faq-questions">Find your answer <span>↓</span></a></section>
    <section className="faq-intro" id="faq-questions"><div><p>QUICK ANSWERS</p><h2>Plan with confidence.<br /><em>Arrive ready to enjoy.</em></h2></div><p>Our experiences take place outdoors across Hội An’s Ancient Town. These answers explain weather planning, delivery times, outfits, makeup and how each package works.</p></section>
    <section className="faq-accordions">
      {faqGroups.map((group, groupIndex) => <article key={group.title} className="faq-group"><header><span>0{groupIndex + 1}</span><div><p>{group.note}</p><h2>{group.title}</h2></div></header><div>{group.items.map(([question, answer], index) => <details key={question} open={groupIndex === 0 && index === 0}><summary><span>{question}</span><i aria-hidden="true">+</i></summary><p>{answer}</p></details>)}</div></article>)}
    </section>
    <section className="faq-price-section"><header><p>FULL PACKAGE PRICE · BẢNG GIÁ TRỌN GÓI</p><h2>Clear pricing for<br /><em>every kind of story.</em></h2></header>
      <div className="faq-price-table-wrap"><table className="faq-price-table"><thead><tr><th>No.<small>STT</small></th><th>Full Package Services<small>Dịch vụ trọn gói</small></th><th>Price<small>Giá</small></th></tr></thead><tbody>{fullPackagePrices.map(([number, name, vi, price]) => <tr key={number}><td>{number}</td><td><strong>{name}</strong><span>{vi}</span></td><td>{price}</td></tr>)}</tbody></table></div>
      <div className="faq-mobile-prices">{fullPackagePrices.map(([number, name, vi, price]) => <article key={number}><span>{number}</span><div><h3>{name}</h3><p>{vi}</p><b>{price}</b></div></article>)}</div>
    </section>
    <section className="faq-package-details"><header><p>WHAT EACH PACKAGE INCLUDES</p><h2>Choose the experience<br /><em>that fits your group.</em></h2></header><div>{packageDetails.map((pkg) => <article key={pkg.name}><span>{pkg.number}</span><p>{pkg.intro}</p><h3>{pkg.name}</h3><strong>{pkg.price}</strong><ul>{pkg.items.map((item) => <li key={item}>{item}</li>)}</ul><a href={`/services?package=${encodeURIComponent(pkg.name)}`}>View &amp; Book Package <Arrow /></a></article>)}</div></section>
    <section className="faq-shared-details"><div><p>APPLIES TO EVERY FULL PACKAGE</p><h2>Your outdoor photoshoot,<br /><em>from start to finish.</em></h2></div><ol>
      <li><span>01</span><p><b>Iconic Hội An locations</b>The approximately 1.5-hour shoot may cover the Japanese Bridge, bougainvillea streets, lantern streets, yellow-wall alleys and other beautiful Ancient Town spots.</p></li>
      <li><span>02</span><p><b>Optional rooftop café</b>A panoramic rooftop café can be included. You only need to purchase a drink for access and photography there.</p></li>
      <li><span>03</span><p><b>Local guidance</b>Our Hội An photographer knows the most photogenic routes and will guide your posing throughout the session.</p></li>
      <li><span>04</span><p><b>Unlimited photographs</b>There is no limit on photos taken. All originals arrive through Google Drive the same day, followed by 15–40 edited selections.</p></li>
      <li><span>05</span><p><b>A flexible pace</b>If crowds slow the route, we are happy to extend shooting time when needed so you can visit multiple spots comfortably.</p></li>
      <li><span>06</span><p><b>Everything included</b>Your package already includes outfit, makeup, hairstyling and photoshoot. Choose any available outfit from our collection without restriction.</p></li>
    </ol></section>
    <section className="faq-bottom-cta"><p>READY TO PLAN YOUR DAY?</p><h2>Choose your package.<br /><em>We’ll shape the rest.</em></h2><div><a href="/services">Explore Packages <Arrow /></a><a href="/#footer-booking-form">Book Your Experience <Arrow /></a></div></section>
  </main>;
}

function ServicesPricingPage({ onBook }: { onBook: (pkg: string) => void }) {
  const { albums } = useCms();
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const cmsGallery = albums.map((album, index) => {
    const meta = album.meta.toLowerCase();
    const category = meta.includes("couple")
      ? "Couple"
      : meta.includes("family") || meta.includes("group")
        ? "Family & Group"
        : "Solo";
    return { src: album.image, category, alt: album.title, index };
  });
  const gallery = [...cmsGallery, ...galleryFallback]
    .filter((item, index, all) => all.findIndex((x) => x.src === item.src) === index);
  const visible = filter === "All" ? gallery.slice(0, 9) : gallery.filter((item) => item.category === filter).slice(0, 9);
  const shared = [
    "3 hours total experience",
    "1.5 hours outfit selection & makeup",
    "1.5 hours photoshoot in the Ancient Town",
    "1 Áo Dài outfit per person",
    "Unlimited studio accessories",
    "All raw photos + 15–40 edited photos",
  ];

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <main className="pricing-page">
      <section className="pricing-hero">
        <img src={images.oldtown} alt="Hội An Ancient Town" />
        <div />
        <p>INHERE · HỘI AN</p>
        <h1>Services <em>&amp; Pricing</em></h1>
        <span>Premium Full-Combo Packages in Hội An. Everything you need in one seamless experience.</span>
        <a href="#packages">Explore packages <b>↓</b></a>
      </section>

      <section className="pricing-section" id="packages">
        <div className="pricing-intro">
          <p>FULL-COMBO EXPERIENCES</p>
          <h2>Choose the experience<br /><em>made for your story.</em></h2>
        </div>
        <div className="pricing-card-grid">
          {pricingPackages.map((pkg, index) => (
            <article className="pricing-card" key={pkg.title}>
              <div className="pricing-card-top"><span>0{index + 1}</span><small>FULL COMBO</small></div>
              <h3>{pkg.title}</h3>
              <strong>{pkg.price}</strong>
              <div className="pricing-primary"><p>{pkg.short}</p><p>{pkg.makeup}</p></div>
              <ul>{shared.map((item) => <li key={item}>{item}</li>)}</ul>
              <button className="pricing-book-button" onClick={() => onBook(pkg.title)}>Book Now <Arrow /></button>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-breakdown">
        <div className="pricing-section-head"><p>AT A GLANCE</p><h2>Detailed Pricing Breakdown</h2></div>
        <div className="pricing-table-wrap">
          <table>
            <thead><tr><th>Full Package Services</th>{pricingPackages.map((pkg) => <th key={pkg.title}>{pkg.title.replace(" Package", "")}</th>)}</tr></thead>
            <tbody>
              <tr><th>Price</th>{pricingPackages.map((pkg) => <td key={pkg.title}>{pkg.price}</td>)}</tr>
              <tr><th>Outfits</th>{pricingPackages.map((pkg) => <td key={pkg.title}>{pkg.short}</td>)}</tr>
              <tr><th>Makeup &amp; hair</th>{pricingPackages.map((pkg) => <td key={pkg.title}>{pkg.makeup}</td>)}</tr>
              <tr><th>Total duration</th>{pricingPackages.map((pkg) => <td key={pkg.title}>3 hours</td>)}</tr>
              <tr><th>Photoshoot</th>{pricingPackages.map((pkg) => <td key={pkg.title}>1.5 hours · Ancient Town</td>)}</tr>
              <tr><th>Accessories</th>{pricingPackages.map((pkg) => <td key={pkg.title}>Unlimited studio selection</td>)}</tr>
              <tr><th>Photographs</th>{pricingPackages.map((pkg) => <td key={pkg.title}>All raw + 15–40 edited</td>)}</tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rental-banner">
        <div><p>STANDALONE SERVICE</p><h2>Outfit Rental Only</h2><strong>200,000 – 300,000 VND <small>/ outfit</small></strong></div>
        <p>1 traditional outfit (Áo Dài/Cổ phục), including basic matching accessories: conical hat, wooden fan, hair flower and fabric tote bag.</p>
        <a href="/services/outfit-rental">Rent an Outfit <Arrow /></a>
      </section>

      <section className="portfolio-section">
        <div className="pricing-section-head"><p>VISUAL PROOF</p><h2>Albums of <em>Hội An</em></h2></div>
        <div className="gallery-filters" role="tablist" aria-label="Filter albums">
          {["All", "Solo", "Couple", "Family & Group"].map((tab) => <button key={tab} className={filter === tab ? "active" : ""} onClick={() => setFilter(tab)}>{tab}</button>)}
        </div>
        <div className="masonry-gallery">
          {visible.map((item, index) => <button key={`${item.src}-${index}`} onClick={() => setLightbox(item)} aria-label={`Open ${item.alt}`}><img src={item.src} alt={item.alt} loading="lazy" /></button>)}
        </div>
        <div className="instagram-gallery-cta">
          <p>Want to see more of our daily Hội An stories and behind-the-scenes?</p>
          <a href="https://www.instagram.com/inhere.studiohoian/" target="_blank" rel="noreferrer"><FaInstagram /> Explore more on Instagram @inhere_trangphuchoian</a>
        </div>
      </section>
      {lightbox && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Album photo"><button onClick={() => setLightbox(null)} aria-label="Close image">Close ×</button><img src={lightbox.src} alt={lightbox.alt} onClick={() => setLightbox(null)} /></div>}
    </main>
  );
}

function OutfitRentalPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(1);
  const [outfit, setOutfit] = useState("Áo Dài");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const submitRental = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const { error } = await supabase.from("booking_requests").insert({
      customer_name: name.trim(),
      phone: contact.trim(),
      preferred_date: date,
      service_name: "Outfit Rental Only",
      guest_count: people,
      notes: `Preferred outfit: ${outfit}. ${notes.trim() || "No additional notes."}`,
    });
    setSubmitting(false);
    if (error) {
      setMessage("We couldn't send your request. Please contact us on WhatsApp.");
      return;
    }
    setName("");
    setContact("");
    setDate("");
    setPeople(1);
    setOutfit("Áo Dài");
    setNotes("");
    setMessage("Thank you — your outfit rental request has been received.");
  };

  return (
    <main className="outfit-rental-page">
      <section className="outfit-rental-hero">
        <div className="outfit-rental-copy">
          <p>STANDALONE COSTUME RENTAL · HỘI AN</p>
          <h1>Wear a piece of<br /><em>Vietnamese tradition.</em></h1>
          <span>Choose your look in our studio, complete it with matching accessories and explore Hội An in your own time.</span>
          <a href="#rental-request">Reserve an Outfit <Arrow /></a>
        </div>
        <img src={images.solo} alt="Traditional Áo Dài outfit rental in Hội An" />
      </section>

      <section className="outfit-rental-overview">
        <div className="outfit-price-block"><p>OUTFIT RENTAL ONLY</p><strong>200,000 – 300,000 VND</strong><span>per outfit</span></div>
        <div className="outfit-overview-copy"><h2>Everything you need<br /><em>for a complete look.</em></h2><p>Each rental includes one traditional outfit — Áo Dài or Cổ phục — plus a thoughtful set of basic matching accessories.</p></div>
      </section>

      <section className="outfit-inclusions">
        {[
          ["01", "Traditional Outfit", "Choose one Áo Dài or Cổ phục from our available studio collection."],
          ["02", "Conical Hat", "A classic nón lá selected to complement your outfit."],
          ["03", "Finishing Details", "Wooden fan and hair flower included for a polished traditional look."],
          ["04", "Fabric Tote Bag", "A practical matching tote to carry your personal items while exploring."],
        ].map(([number, title, copyText]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copyText}</p></article>)}
      </section>

      <section className="outfit-process">
        <div><p>HOW IT WORKS</p><h2>Simple from selection<br /><em>to return.</em></h2></div>
        <ol>
          <li><b>01</b><span><strong>Send your request</strong>Share your date, number of guests and preferred outfit style.</span></li>
          <li><b>02</b><span><strong>Visit the studio</strong>Our team will help you choose the right size, color and matching details.</span></li>
          <li><b>03</b><span><strong>Enjoy Hội An</strong>Wear your complete look and return it according to the confirmed rental time.</span></li>
        </ol>
      </section>

      <section className="rental-request-section" id="rental-request">
        <div className="rental-request-intro"><p>DIRECT BOOKING</p><h2>Reserve your<br /><em>outfit.</em></h2><span>Your request will be reviewed personally. We will contact you to confirm availability, sizing and collection time.</span></div>
        <form className="rental-request-form" onSubmit={submitRental}>
          <label>Full Name<input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" /></label>
          <label>WhatsApp / Social Contact<input value={contact} onChange={(e) => setContact(e.target.value)} required placeholder="Number, username or profile link" /></label>
          <div><label>Expected Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label><label>Number of Guests<input type="number" min="1" max="20" value={people} onChange={(e) => setPeople(Number(e.target.value))} required /></label></div>
          <label>Preferred Outfit<select value={outfit} onChange={(e) => setOutfit(e.target.value)}><option>Áo Dài</option><option>Cổ phục</option><option>Help me choose</option></select></label>
          <label>Notes <small>(optional)</small><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Sizes, colors, collection time or any special request" rows={3} /></label>
          <button type="submit" disabled={submitting}>{submitting ? "Sending Request…" : "Send Rental Request"} <Arrow /></button>
          {message && <p className="rental-form-message" role="status">{message}</p>}
        </form>
      </section>
    </main>
  );
}

function DestinationShowcase({
  type,
  onBook,
  add,
}: {
  type: string;
  onBook: () => void;
  add: (x: string) => void;
}) {
  const { services, albums, experiences, articles } = useCms();
  if (type === "services")
    return (
      <div className="destination-grid photoshoot-showcase">
        {services.slice(0, 3).map((item, index) => (
          <article className="destination-card" key={item.slug}>
            <div className="destination-image">
              <img src={item.image} alt={item.title} />
              <span>0{index + 1}</span>
            </div>
            <p>INHERE PHOTOSHOOT</p>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
            <div>
              <a href={`/services/${item.slug}`}>
                View details <Arrow />
              </a>
              <button onClick={onBook}>Book</button>
            </div>
          </article>
        ))}
      </div>
    );
  if (type === "albums")
    return (
      <div className="album-page-grid">
        {albums.map((album, index) => (
          <a
            href={`/albums/${album.title.toLowerCase().replaceAll(" ", "-")}`}
            className={`album-page-card album-page-${index + 1}`}
            key={album.title}
          >
            <img src={album.image} alt={album.title} />
            <div>
              <span>
                {album.n} · {album.meta}
              </span>
              <h3>{album.title}</h3>
              <b>
                Open album <Arrow />
              </b>
            </div>
          </a>
        ))}
      </div>
    );
  if (type === "blog")
    return (
      <div className="journal-page-grid">
        {articles.map((article, index) => (
          <a
            href={`/blog/${article.slug}`}
            className={`journal-page-card journal-${index + 1}`}
            key={article.slug}
          >
            <img src={article.image} alt={article.title} />
            <div>
              <p>
                {article.cat} · 0{index + 1}
              </p>
              <h3>{article.title}</h3>
              <span>{article.excerpt}</span>
              <b>
                Read the story <Arrow />
              </b>
            </div>
          </a>
        ))}
      </div>
    );
  if (type === "experiences")
    return (
      <div className="destination-grid experience-page-grid">
        {experiences.map((item, index) => (
          <article className="destination-card" key={item.title}>
            <div className="destination-image">
              <img src={item.image} alt={item.title} />
              <span>0{index + 1}</span>
            </div>
            <p>{item.cat}</p>
            <h3>{item.title}</h3>
            <p>
              {item.duration}. Add this local moment to your photography
              itinerary.
            </p>
            <div>
              <a
                href={`/experiences/${item.title.toLowerCase().replaceAll(" ", "-")}`}
              >
                Explore <Arrow />
              </a>
              <button onClick={() => add(item.title)}>+ Add to plan</button>
            </div>
          </article>
        ))}
      </div>
    );
  if (type === "rentals")
    return (
      <div className="rental-collection">
        <article>
          <img src={images.solo} alt="Ao Dai styling collection" />
          <div>
            <span>01 · SIGNATURE</span>
            <h3>Ao Dai Collection</h3>
            <p>
              Elegant silhouettes and colors selected for portrait sessions
              across Hội An.
            </p>
            <a href="/rentals/outfits">
              Explore outfits <Arrow />
            </a>
          </div>
        </article>
        <article>
          <img src={images.craft} alt="Accessories collection" />
          <div>
            <span>02 · DETAILS</span>
            <h3>Accessories & Finishing</h3>
            <p>
              Headpieces, fans and considered details that complete your visual
              story.
            </p>
            <a href="/rentals/accessories">
              Explore accessories <Arrow />
            </a>
          </div>
        </article>
      </div>
    );
  if (type === "about")
    return (
      <div className="about-story">
        <div className="about-number">01</div>
        <div>
          <p className="eyebrow light">OUR PHILOSOPHY</p>
          <h3>
            Direction when you need it.
            <br />
            <em>Space when the moment is real.</em>
          </h3>
          <p>
            We believe the best photographs hold both beauty and truth. Our work
            combines editorial composition with an easy, human experience so
            your images feel considered without feeling staged.
          </p>
        </div>
        <img src={images.couple} alt="INHERE photography philosophy" />
      </div>
    );
  if (type === "contact")
    return (
      <div className="contact-page-grid">
        <div>
          <a href={WA} target="_blank">
            <span>01</span>
            <div>
              <p>FASTEST RESPONSE</p>
              <h3>WhatsApp</h3>
              <b>+84 898 199 099 ↗</b>
            </div>
          </a>
          <a href="mailto:hello@inhere.vn">
            <span>02</span>
            <div>
              <p>WRITE TO US</p>
              <h3>Email inquiry</h3>
              <b>hello@inhere.vn ↗</b>
            </div>
          </a>
          <button className="button dark-button" onClick={onBook}>
            Start booking request <Arrow />
          </button>
        </div>
        <iframe
          title="INHERE location in Hội An"
          loading="lazy"
          src="https://www.google.com/maps?q=Hoi+An%2C%20Vietnam&z=14&output=embed"
        />
      </div>
    );
  if (type === "book")
    return (
      <div className="book-page-callout">
        <span>01</span>
        <h3>Ready when you are.</h3>
        <p>
          Open the guided three-step request and tell us what kind of Hội An
          memory you want to create.
        </p>
        <button className="button dark-button" onClick={onBook}>
          Begin booking request <Arrow />
        </button>
      </div>
    );
  return null;
}

function InnerPage({
  path,
  onBook,
  add,
}: {
  path: string;
  onBook: () => void;
  add: (x: string) => void;
}) {
  const { services, articles } = useCms();
  const segments = path.split("/").filter(Boolean);
  const type = segments[0] || "";
  const slug = segments[segments.length - 1] || "";
  const service =
    services.find((s) => s.slug === slug) ||
    (slug === "group-photoshoot"
      ? {
          id: "04",
          slug: "group-photoshoot",
          title: "Group Photoshoot",
          image: customerCategories[3].image,
          copy: "A relaxed, energetic photoshoot for friend groups who want to remember their time together in Hội An.",
        }
      : null);
  const article = articles.find((a) => a.slug === slug);
  const isLanding = segments.length === 1;
  if (type === "faq" && isLanding) return <FaqPoliciesPage />;
  if (type === "portfolio" && isLanding) return <LookbookPage />;
  if (type === "blog" && isLanding) return <JournalIndex />;
  if (type === "blog" && article) return <JournalArticle article={article} />;
  const profile = pageProfiles[type] || pageProfiles.services;
  const title =
    article?.title ||
    service?.title ||
    (
      {
        albums: "Signature Albums",
        experiences: "Hội An Experiences",
        blog: "The INHERE Journal",
        about: "The Art of Remembering",
        contact: "Let’s Create Together",
        book: "Book Your Experience",
        rentals: "Ao Dai & Styling",
        services: "Photography Experiences",
      } as Record<string, string>
    )[type] ||
    "INHERE";
  const heroImage =
    article?.image ||
    service?.image ||
    (type === "experiences"
      ? images.lantern
      : type === "albums"
        ? images.couple
        : type === "contact"
          ? images.river
          : profile.image);
  return (
    <main className={`inner inner-${type}`}>
      <section className="inner-hero">
        <img src={heroImage} alt={title} />
        <div />
        <p className="eyebrow light">INHERE · HỘI AN</p>
        <h1>
          {title.split(" ").slice(0, -1).join(" ")}{" "}
          <em>{title.split(" ").slice(-1)}</em>
        </h1>
        <a href="#discover">
          Discover <span>↓</span>
        </a>
      </section>
      <section id="discover" className="inner-content">
        <p className="eyebrow">
          {article ? "THE INHERE JOURNAL" : profile.kicker}
        </p>
        <h2>
          {article
            ? "A local guide, thoughtfully written."
            : service?.title || profile.heading}
        </h2>
        <p className="lead">
          {article?.excerpt || service?.copy || profile.lead}
        </p>
        {isLanding ? (
          <DestinationShowcase type={type} onBook={onBook} add={add} />
        ) : article ? (
          <div className="article-body">
            <h3>Finding your perfect Hội An setting</h3>
            <p>
              Hội An changes character throughout the day. Early mornings feel
              intimate and quiet, while late afternoon brings gentle warmth to
              ochre walls, river reflections and lantern-lined lanes. The best
              setting is the one that supports your story rather than competing
              with it.
            </p>
            <h3>Plan for comfort and natural moments</h3>
            <p>
              Choose clothing you can move in, leave space in your schedule, and
              trust the experience to unfold. INHERE can help shape the visual
              direction around your preferred mood, group and time of year.
            </p>
          </div>
        ) : (
          <div className="detail-grid">
            <div>
              <h3>
                {service
                  ? "What your experience may include"
                  : "What you’ll discover"}
              </h3>
              <ul>
                {(service
                  ? [
                      "Pre-session concept and location guidance",
                      "Gentle posing and movement direction",
                      "Optional Ao Dai, accessories and makeup inquiry",
                      "Professionally curated final photographs",
                    ]
                  : profile.features
                ).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <img src={profile.image} alt={`${title} visual story`} />
          </div>
        )}
        <div className="inner-actions">
          <button className="button dark-button" onClick={onBook}>
            Request Package Details <Arrow />
          </button>
          <button className="button outline" onClick={() => add(title)}>
            + Add to My Hội An Plan
          </button>
        </div>
      </section>
      {!isLanding && <Blog />}
    </main>
  );
}

export default function InhereSite({
  initialPath = "/",
}: {
  initialPath?: string;
}) {
  const [booking, setBooking] = useState(false);
  const [bookingPreset, setBookingPreset] = useState<string>();
  const [plan, setPlan] = useState<string[]>([]);
  const [showPlan, setShowPlan] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const [path, setPath] = useState(initialPath);
  const [cms, setCms] = useState<CmsState>({
    services,
    albums,
    experiences,
    articles,
    testimonials: [],
    reels: [],
    pages: {},
  });
  const loadCms = useCallback(async () => {
    const [
      serviceResult,
      albumResult,
      experienceResult,
      articleResult,
      testimonialResult,
      reelResult,
      pageResult,
    ] = await Promise.all([
      supabase
        .from("services")
        .select("*")
        .eq("is_published", true)
        .order("sort_order"),
      supabase
        .from("albums")
        .select("*")
        .eq("is_published", true)
        .order("sort_order"),
      supabase
        .from("experiences")
        .select("*")
        .eq("is_published", true)
        .order("sort_order"),
      supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("sort_order"),
      supabase
        .from("studio_reels")
        .select("*")
        .eq("is_published", true)
        .order("sort_order"),
      supabase
        .from("page_content")
        .select("*")
        .eq("is_published", true)
        .order("sort_order"),
    ]);
    setCms((current) => ({
      services: serviceResult.data?.length
        ? [
            ...serviceResult.data.map((row, index) => ({
              id: String(index + 1).padStart(2, "0"),
              slug: row.slug,
              title: row.title_en,
              image: row.image_url || images.solo,
              copy: row.description_en,
            })),
            ...services.filter(
              (item) => item.slug === "outfits" || item.slug === "accessories",
            ),
          ]
        : current.services,
      albums: albumResult.data?.length
        ? albumResult.data.map((row, index) => ({
            n: String(index + 1).padStart(2, "0"),
            title: row.title_en,
            meta: row.category_en,
            image: row.cover_image || images.couple,
          }))
        : current.albums,
      experiences: experienceResult.data?.length
        ? experienceResult.data.map((row) => ({
            title: row.title_en,
            cat: row.category_en,
            image: row.image_url || images.lantern,
            duration: row.duration_label || "Details to be confirmed",
          }))
        : current.experiences,
      articles: articleResult.data?.length
        ? articleResult.data.map((row) => ({
            slug: row.slug,
            title: row.title_en,
            cat: row.category_en,
            image: row.cover_image || images.oldtown,
            excerpt: row.excerpt_en,
            content: row.content_en,
            date: row.published_at,
          }))
        : current.articles,
      testimonials:
        testimonialResult.data?.map((row) => ({
          id: row.id,
          quote: row.quote_en,
          authorName: row.author_name,
          authorTitle: row.author_title_en,
          avatarUrl: row.avatar_url || logo,
          rating: row.rating,
        })) || current.testimonials,
      reels:
        reelResult.data?.map((row) => ({
          id: row.id,
          title: row.title_en,
          titleVi: row.title_vi,
          category: row.category_en,
          categoryVi: row.category_vi,
          video: undefined,
          poster: row.poster_url || images.solo,
          instagramUrl: row.instagram_url || "https://www.instagram.com/",
        })) || current.reels,
      pages: Object.fromEntries(
        (pageResult.data || []).map((row) => [row.page_key, row as CmsPage]),
      ),
    }));
  }, []);
  useEffect(() => {
    void loadCms();
    const channel = supabase.channel("inhere-live-content");
    [
      "services",
      "albums",
      "experiences",
      "blog_posts",
      "testimonials",
      "studio_reels",
      "page_content",
    ].forEach((table) =>
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          void loadCms();
        },
      ),
    );
    channel.subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadCms]);
  useEffect(() => {
    const saved = window.localStorage.getItem("inhere-language");
    if (saved === "vi") setLang("vi");
  }, []);
  useEffect(() => {
    const navigate = (next: string, replace = false) => {
      if (next === window.location.pathname) return;
      window.history[replace ? "replaceState" : "pushState"]({}, "", next);
      setPath(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element).closest("a");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    };
    const onPop = () => {
      setPath(
        `${window.location.pathname}${window.location.search}${window.location.hash}`,
      );
      window.scrollTo({ top: 0 });
    };
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, []);
  const changeLanguage = (next: Language) => {
    setLang(next);
    window.localStorage.setItem("inhere-language", next);
    document.documentElement.lang = next;
  };
  const routePath = path.split("#")[0] || "/";
  const home = routePath === "/";
  useEffect(() => {
    if (!home || !["#full-combo", "#footer-booking-form"].includes(window.location.hash)) return;
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(window.location.hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [home]);
  const add = (x: string) => {
    setPlan((p) => (p.includes(x) ? p : [...p, x]));
    setShowPlan(true);
  };
  const message = useMemo(
    () =>
      encodeURIComponent(
        `Hello INHERE, I would like to ask about my Hội An plan:\n${plan.map((x) => `• ${x}`).join("\n")}`,
      ),
    [plan],
  );
  if (path.startsWith("/admin")) return <AdminPanel />;
  return (
    <CmsContext.Provider value={cms}>
      <>
        <ScrollExperience />
        <StudioCursor />
        <Header
          onBook={() => setBooking(true)}
          lang={lang}
          setLang={changeLanguage}
        />
        {home ? (
          <main>
            <Hero lang={lang} />
            <FullCombo
              onBook={() => {
                setBookingPreset("Full Combo");
                setBooking(true);
              }}
            />
            <CustomerCategories />
            <Reels />
            <section className="final-quote">
              <img src={images.river} alt="Hội An at dusk" />
              <div>
                <p className="eyebrow light">MEMORIES, STYLED WITH INTENTION</p>
                <blockquote>
                  “Some places stay with you.
                  <br />
                  Let Hội An be one of them.”
                </blockquote>
                <button
                  className="button ivory"
                  onClick={() => setBooking(true)}
                >
                  Begin Your Story <Arrow />
                </button>
              </div>
            </section>
          </main>
        ) : routePath === "/services/outfit-rental" || routePath === "/rentals/outfits" ? (
          <OutfitRentalPage />
        ) : routePath === "/services" || routePath === "/rentals" || routePath === "/albums" ? (
          <ServicesPricingPage
            onBook={(pkg) => {
              setBookingPreset(pkg);
              setBooking(true);
            }}
          />
        ) : (
          <InnerPage
            path={routePath}
            onBook={() => setBooking(true)}
            add={add}
          />
        )}
        <Footer onBook={() => setBooking(true)} />
        <button
          className="plan-fab"
          aria-label="Open your saved Hội An plan"
          onClick={() => setShowPlan(true)}
        >
          <b>View My Plan</b>
          <small>Saved experiences</small>
          <span>{plan.length}</span>
        </button>
        <div className={`plan-panel ${showPlan ? "open" : ""}`}>
          <button className="plan-close" onClick={() => setShowPlan(false)}>
            Close ×
          </button>
          <p className="eyebrow">YOUR CURATED VISIT</p>
          <h2>
            My Hội An <em>Plan</em>
          </h2>
          {plan.length ? (
            plan.map((x) => (
              <div className="plan-item" key={x}>
                <span>{x}</span>
                <button
                  onClick={() => setPlan((p) => p.filter((y) => y !== x))}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="empty">
              Add a photoshoot, styling detail or local experience to build your
              inquiry.
            </p>
          )}
          <a
            className={`button dark-button ${!plan.length ? "disabled" : ""}`}
            href={plan.length ? `${WA}?text=${message}` : "#"}
            target={plan.length ? "_blank" : undefined}
          >
            Send Complete Inquiry <Arrow />
          </a>
        </div>
        {showPlan && (
          <button
            aria-label="Close plan"
            className="plan-backdrop"
            onClick={() => setShowPlan(false)}
          />
        )}
        <Booking
          open={booking}
          close={() => {
            setBooking(false);
            setBookingPreset(undefined);
          }}
          preset={bookingPreset}
        />
      </>
    </CmsContext.Provider>
  );
}
