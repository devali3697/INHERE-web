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
import TestimonialsSection, {
  TestimonialsData,
} from "@/components/ui/community-testimonial";
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
      "Photoshoots",
      "Ao Dai & Rentals",
      "Albums",
      "Hội An Experiences",
      "Blog",
      "About",
      "Contact",
    ],
    book: "Book your experience",
    menu: "Menu",
    close: "Close",
    eyebrow: "AO DAI · MAKEUP · PHOTOGRAPHY · HỘI AN",
    titleA: "Your Story,",
    titleB: "Beautifully Told",
    titleC: "in Hội An.",
    heroCopy:
      "Premium photography, Vietnamese styling and carefully curated Hội An experiences for couples, solo travelers and families.",
    heroBook: "Book Your Photoshoot",
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
      "Chụp ảnh",
      "Áo dài & Trang phục",
      "Album",
      "Trải nghiệm Hội An",
      "Bài viết",
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
type CmsArticle = (typeof articles)[number] & { content?: string };
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
    "/rentals/outfits",
    "/albums",
    "/experiences",
    "/blog",
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
          {links.slice(1, 7).map(([t, h]) => (
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

function Hero({ onBook, lang }: { onBook: () => void; lang: Language }) {
  const c = copy[lang];
  const { pages } = useCms();
  const homePage = pages.home;
  const heroCopy = homePage
    ? lang === "vi"
      ? homePage.body_vi || c.heroCopy
      : homePage.body_en || c.heroCopy
    : c.heroCopy;
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
          <button className="button ivory" onClick={onBook}>
            {c.heroBook} <Arrow />
          </button>
          <a className="text-link" href="/albums">
            {c.explore} <Arrow />
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

const testimonialsData: TestimonialsData = {
  title: "Stories our guests carry home",
  subtitle:
    "Kind words shared after slow mornings, lantern-lit walks and meaningful photography experiences in Hội An.",
  rows: [
    {
      id: "row1",
      speed: "48s",
      direction: "left",
      testimonials: [
        {
          id: "t1",
          quote:
            "The whole experience felt calm and personal. We stopped posing and simply enjoyed Hội An together.",
          authorName: "Sophie & Daniel",
          authorTitle: "Couple experience · Guest story",
          avatarUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=85",
        },
        {
          id: "t2",
          quote:
            "I arrived nervous and left feeling completely confident. The styling and gentle direction were wonderful.",
          authorName: "Mina K.",
          authorTitle: "Solo portrait · Guest story",
          avatarUrl:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=85",
        },
        {
          id: "t3",
          quote:
            "Our children could be themselves, and the photographs genuinely feel like our family.",
          authorName: "The Nguyen Family",
          authorTitle: "Family session · Guest story",
          avatarUrl:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=85",
        },
      ],
    },
    {
      id: "row2",
      speed: "42s",
      direction: "right",
      testimonials: [
        {
          id: "t4",
          quote:
            "Every detail—from the Ao Dai to the quiet location—felt thoughtfully chosen for me.",
          authorName: "Amelia R.",
          authorTitle: "Ao Dai portrait · Guest story",
          avatarUrl:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=85",
        },
        {
          id: "t5",
          quote:
            "The lantern light, the movement, the laughter—our album brings the evening back instantly.",
          authorName: "James & Linh",
          authorTitle: "Evening session · Guest story",
          avatarUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=85",
        },
        {
          id: "t6",
          quote:
            "Professional without ever feeling rushed. It became one of our favorite memories in Vietnam.",
          authorName: "Elena M.",
          authorTitle: "Travel portrait · Guest story",
          avatarUrl:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=85",
        },
      ],
    },
  ],
};

function TestimonialsAndMap() {
  const { testimonials } = useCms();
  const liveTestimonials = useMemo<TestimonialsData>(() => {
    if (!testimonials.length) return testimonialsData;
    const cards = testimonials.map(
      ({ id, quote, authorName, authorTitle, avatarUrl }) => ({
        id,
        quote,
        authorName,
        authorTitle,
        avatarUrl,
      }),
    );
    return {
      title: testimonialsData.title,
      subtitle: testimonialsData.subtitle,
      rows: [
        {
          id: "live-row-1",
          speed: "48s",
          direction: "left",
          testimonials: cards,
        },
        {
          id: "live-row-2",
          speed: "42s",
          direction: "right",
          testimonials: [...cards].reverse(),
        },
      ],
    };
  }, [testimonials]);
  return (
    <>
      <section className="testimonials-wrap section">
        <TestimonialsSection data={liveTestimonials} />
      </section>
      <section className="location-section">
        <div className="location-copy">
          <p className="eyebrow light">FIND US IN HỘI AN</p>
          <h2>
            Meet us in the
            <br />
            <em>heart of the story.</em>
          </h2>
          <p>
            Planning your session? Explore Hội An on the map, then message us
            for the exact meeting point selected for your experience.
          </p>
          <a
            className="button ivory"
            href="https://www.google.com/maps/search/?api=1&query=Hoi+An+Vietnam"
            target="_blank"
          >
            Open in Google Maps <Arrow />
          </a>
        </div>
        <div className="map-frame">
          <iframe
            title="Google Map of Hội An, Vietnam"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Hoi+An%2C%20Vietnam&z=14&output=embed"
          />
        </div>
      </section>
    </>
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
      <TestimonialsAndMap />
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
  const [notes, setNotes] = useState("");
  useEffect(() => {
    if (open) setStep(1);
  }, [open]);
  if (!open) return null;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step !== 3) return;
    const msg = `Hello INHERE, I would like to request a photoshoot.\n\nService: ${service}\nPreferred date: ${date || "To discuss"}\nNumber of people: ${people}\nName: ${name}\nAdditional message: ${notes || "—"}`;
    window.open(`${WA}?text=${encodeURIComponent(msg)}`, "_blank");
  };
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
                {[...services.map((x) => x.title), "Custom Request"].map(
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
                disabled={step === 2 && !name.trim()}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setStep((current) => Math.min(current + 1, 3));
                }}
              >
                Continue →
              </button>
            ) : (
              <button key="send" type="submit">
                Send via WhatsApp ↗
              </button>
            )}
          </div>
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
        <div className="footer-booking">
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
  const service = services.find((s) => s.slug === slug) || null;
  const article = articles.find((a) => a.slug === slug);
  const isLanding = segments.length === 1;
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
  const home = path === "/";
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
            <Hero onBook={() => setBooking(true)} lang={lang} />
            <Intro lang={lang} />
            <Albums />
            <ServiceSelector onBook={() => setBooking(true)} />
            <Process />
            <Experiences add={add} />
            <Blog />
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
        ) : (
          <InnerPage path={path} onBook={() => setBooking(true)} add={add} />
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
        <Booking open={booking} close={() => setBooking(false)} />
      </>
    </CmsContext.Provider>
  );
}
