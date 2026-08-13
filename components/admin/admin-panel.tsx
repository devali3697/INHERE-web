"use client";

/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element, react-hooks/set-state-in-effect */

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Field = {
  key: string;
  label: string;
  type?:
    | "text"
    | "textarea"
    | "number"
    | "boolean"
    | "select"
    | "image"
    | "video"
    | "date"
    | "album";
  options?: string[];
  required?: boolean;
};
type Section = {
  table: string;
  label: string;
  description: string;
  titleKey: string;
  order?: string;
  fields: Field[];
  defaults: Record<string, unknown>;
};
type Row = Record<string, unknown> & { id?: string };

const seoDraftTemplates: Row[] = [
  {
    slug: "perfect-one-day-hoi-an-itinerary",
    title_en: "The Perfect 1-Day Hội An Itinerary: Where to Go, What to Eat, and Best Photo Spots",
    category_en: "Hội An Travel Guides",
    excerpt_en: "A practical morning-to-evening Hội An itinerary with local food stops and the best places to photograph along the way.",
    content_en: "# Morning: Ancient Town at its quietest\n[Add itinerary text and a high-resolution morning image here.]\n\n## INHERE Full Combo: Áo Dài & Photoshoot\n[INHERE PROMO BLOCK — Full Combo Áo Dài, makeup and professional photoshoot.]\n\n# Midday: Local flavours and a slower pace\n[Add restaurant, market and café recommendations here.]\n\n# Afternoon: Riverside light and photo spots\n[Add afternoon timeline, map notes and photography tips here.]\n\n# Evening: Lanterns, dinner and the night market\n[Add evening itinerary and final practical tips here.]",
    status: "draft", cover_image: "", title_vi: "", excerpt_vi: "", content_vi: "", category_vi: "", published_at: null, __template: true,
  },
  {
    slug: "where-to-rent-ao-dai-in-hoi-an",
    title_en: "Where to Rent Áo Dài in Hội An? Pricing & Tips for the Best Traditional Outfits",
    category_en: "What to Wear",
    excerpt_en: "A clear Áo Dài rental guide covering prices, fit, accessories and what to check before choosing a traditional outfit.",
    content_en: "# How much does Áo Dài rental cost in Hội An?\n[Add a concise pricing answer and comparison notes here.]\n\n## Outfit Rental Only: 200,000–300,000 VND\n[INHERE RENTAL PROMO BLOCK — outfit and basic matching accessories.]\n\n# What is included with a rental?\n[Add a Q&A answer and supporting image here.]\n\n# How do I choose the right style and size?\n[Add fit, colour and comfort advice here.]\n\n## Want makeup and professional photos too?\n[INHERE UP-SELL BLOCK — link to Full-Combo packages.]",
    status: "draft", cover_image: "", title_vi: "", excerpt_vi: "", content_vi: "", category_vi: "", published_at: null, __template: true,
  },
  {
    slug: "most-beautiful-photo-spots-hoi-an",
    title_en: "Top 7 Most Beautiful Photo Spots in Hội An (Plus Áo Dài Posing Tips)",
    category_en: "Photography Spots",
    excerpt_en: "Seven photogenic Hội An locations with timing, crowd and Áo Dài posing advice for each stop.",
    content_en: "# 1. The Japanese Covered Bridge\n[Add location copy, image and posing tip.]\n\n# 2. The yellow lanes of the Ancient Town\n[Add location copy, image and posing tip.]\n\n# 3. Hội An riverside\n[Add location copy, image and posing tip.]\n\n## 1.5-hour Professional Photoshoot\n[INHERE IN-CONTENT PROMO BLOCK — professional direction and Ancient Town locations.]\n\n# 4. Lantern streets\n[Add location copy, image and posing tip.]\n\n# 5. Old heritage houses\n[Add location copy, image and posing tip.]\n\n# 6. A rooftop café\n[Add location copy, image and posing tip.]\n\n# 7. A quiet riverside lane\n[Add location copy, image and posing tip.]",
    status: "draft", cover_image: "", title_vi: "", excerpt_vi: "", content_vi: "", category_vi: "", published_at: null, __template: true,
  },
  {
    slug: "hoi-an-travel-guide-couples-friend-groups",
    title_en: "Hội An Travel Guide for Couples and Friend Groups: What You Need to Prepare",
    category_en: "Hội An Travel Guides",
    excerpt_en: "A preparation checklist for couples and friends planning outfits, transport, timing and memorable group photographs in Hội An.",
    content_en: "# Choose the right time and meeting point\n[Add practical arrival, weather and timing advice.]\n\n# Coordinate outfits without looking identical\n[Add styling tips for couples and groups.]\n\n## Couple Package\n[INHERE COUPLE PACKAGE BLOCK — highlight outfit, accessories and female makeup.]\n\n# Prepare for comfort in the Ancient Town\n[Add footwear, belongings and hydration advice.]\n\n## Friend Group Package\n[INHERE FRIEND GROUP BLOCK — emphasize makeup is included for all females.]\n\n# Build an easy photo plan\n[Add group posing and location preparation tips.]",
    status: "draft", cover_image: "", title_vi: "", excerpt_vi: "", content_vi: "", category_vi: "", published_at: null, __template: true,
  },
  {
    slug: "best-vintage-cafes-tea-shops-hoi-an",
    title_en: "A Guide to the Best Vintage Cafes & Tea Shops in the Heart of Hội An",
    category_en: "Hội An Travel Guides",
    excerpt_en: "A curated list of atmospheric vintage cafés and tea shops for quiet breaks, local flavours and beautiful Hội An photographs.",
    content_en: "# 1. [Café or tea shop name]\n[Add review, address, price range and high-resolution image.]\n\n# 2. [Café or tea shop name]\n[Add review, best order and atmosphere notes.]\n\n## Turn the café stop into a photograph\n[Rooftop café photoshoots are included in selected INHERE packages — add link/banner here.]\n\n# 3. [Café or tea shop name]\n[Add review, opening times and photography notes.]\n\n# 4. [Café or tea shop name]\n[Add review and local recommendation.]\n\n# Practical café etiquette and timing\n[Add a concise closing guide here.]",
    status: "draft", cover_image: "", title_vi: "", excerpt_vi: "", content_vi: "", category_vi: "", published_at: null, __template: true,
  },
];

const sections: Section[] = [
  {
    table: "booking_requests",
    label: "Booking Requests",
    description: "Review and manage direct booking enquiries from the website.",
    titleKey: "customer_name",
    order: "created_at",
    defaults: {},
    fields: [
      { key: "customer_name", label: "Guest name", required: true },
      { key: "phone", label: "WhatsApp / social contact", required: true },
      { key: "preferred_date", label: "Expected date", type: "date" },
      { key: "service_name", label: "Service of interest", required: true },
      {
        key: "status",
        label: "Booking status",
        type: "select",
        options: ["new", "contacted", "confirmed", "completed", "cancelled"],
      },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
  },
  {
    table: "page_content",
    label: "Pages",
    description: "Hero and page headings, descriptions and images.",
    titleKey: "page_key",
    order: "sort_order",
    defaults: {
      page_key: "",
      title_en: "",
      title_vi: "",
      subtitle_en: "",
      subtitle_vi: "",
      body_en: "",
      body_vi: "",
      hero_image: "",
      is_published: true,
      sort_order: 0,
    },
    fields: [
      { key: "page_key", label: "Page key", required: true },
      { key: "title_en", label: "Title — English", required: true },
      { key: "title_vi", label: "Title — Vietnamese" },
      { key: "subtitle_en", label: "Subtitle — English" },
      { key: "subtitle_vi", label: "Subtitle — Vietnamese" },
      { key: "body_en", label: "Body — English", type: "textarea" },
      { key: "body_vi", label: "Body — Vietnamese", type: "textarea" },
      { key: "hero_image", label: "Hero image", type: "image" },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" },
    ],
  },
  {
    table: "services",
    label: "Photoshoots",
    description: "Photography services, package labels and inclusions.",
    titleKey: "title_en",
    order: "sort_order",
    defaults: {
      slug: "",
      title_en: "",
      title_vi: "",
      description_en: "",
      description_vi: "",
      image_url: "",
      price_label: "",
      inclusions: [],
      is_published: true,
      sort_order: 0,
    },
    fields: [
      { key: "slug", label: "Slug", required: true },
      { key: "title_en", label: "Title — English", required: true },
      { key: "title_vi", label: "Title — Vietnamese" },
      {
        key: "description_en",
        label: "Description — English",
        type: "textarea",
      },
      {
        key: "description_vi",
        label: "Description — Vietnamese",
        type: "textarea",
      },
      { key: "image_url", label: "Main image", type: "image" },
      { key: "price_label", label: "Price/package label" },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" },
    ],
  },
  {
    table: "albums",
    label: "Albums",
    description: "Album covers, categories and descriptions.",
    titleKey: "title_en",
    order: "sort_order",
    defaults: {
      slug: "",
      title_en: "",
      title_vi: "",
      category_en: "",
      category_vi: "",
      description_en: "",
      description_vi: "",
      cover_image: "",
      is_published: true,
      sort_order: 0,
    },
    fields: [
      { key: "slug", label: "Slug", required: true },
      { key: "title_en", label: "Title — English", required: true },
      { key: "title_vi", label: "Title — Vietnamese" },
      { key: "category_en", label: "Category — English" },
      { key: "category_vi", label: "Category — Vietnamese" },
      {
        key: "description_en",
        label: "Description — English",
        type: "textarea",
      },
      {
        key: "description_vi",
        label: "Description — Vietnamese",
        type: "textarea",
      },
      { key: "cover_image", label: "Cover image", type: "image" },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" },
    ],
  },
  {
    table: "album_photos",
    label: "Album Photos",
    description: "Upload and arrange individual photos inside albums.",
    titleKey: "alt_en",
    order: "sort_order",
    defaults: {
      album_id: "",
      image_url: "",
      alt_en: "",
      alt_vi: "",
      sort_order: 0,
    },
    fields: [
      { key: "album_id", label: "Album", type: "album", required: true },
      { key: "image_url", label: "Photo", type: "image", required: true },
      { key: "alt_en", label: "Caption — English" },
      { key: "alt_vi", label: "Caption — Vietnamese" },
      { key: "sort_order", label: "Order", type: "number" },
    ],
  },
  {
    table: "blog_posts",
    label: "Blog",
    description: "Draft, publish and update journal articles.",
    titleKey: "title_en",
    order: "created_at",
    defaults: {
      slug: "",
      title_en: "",
      title_vi: "",
      excerpt_en: "",
      excerpt_vi: "",
      content_en: "",
      content_vi: "",
      category_en: "",
      category_vi: "",
      cover_image: "",
      status: "draft",
      published_at: null,
    },
    fields: [
      { key: "slug", label: "Slug", required: true },
      { key: "title_en", label: "Title — English", required: true },
      { key: "title_vi", label: "Title — Vietnamese" },
      { key: "category_en", label: "Category — English" },
      { key: "category_vi", label: "Category — Vietnamese" },
      { key: "excerpt_en", label: "Excerpt — English", type: "textarea" },
      { key: "excerpt_vi", label: "Excerpt — Vietnamese", type: "textarea" },
      { key: "content_en", label: "Article — English", type: "textarea" },
      { key: "content_vi", label: "Article — Vietnamese", type: "textarea" },
      { key: "cover_image", label: "Cover image", type: "image" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["draft", "published"],
      },
    ],
  },
  {
    table: "testimonials",
    label: "Testimonials",
    description: "Guest reviews, avatars and ratings.",
    titleKey: "author_name",
    order: "sort_order",
    defaults: {
      quote_en: "",
      quote_vi: "",
      author_name: "",
      author_title_en: "",
      author_title_vi: "",
      avatar_url: "",
      rating: 5,
      is_published: true,
      sort_order: 0,
    },
    fields: [
      {
        key: "quote_en",
        label: "Quote — English",
        type: "textarea",
        required: true,
      },
      { key: "quote_vi", label: "Quote — Vietnamese", type: "textarea" },
      { key: "author_name", label: "Guest name", required: true },
      { key: "author_title_en", label: "Guest title — English" },
      { key: "author_title_vi", label: "Guest title — Vietnamese" },
      { key: "avatar_url", label: "Avatar", type: "image" },
      { key: "rating", label: "Rating", type: "number" },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" },
    ],
  },
  {
    table: "rentals",
    label: "Rentals",
    description: "Ao Dai, accessories and makeup options.",
    titleKey: "title_en",
    order: "sort_order",
    defaults: {
      slug: "",
      type: "outfit",
      title_en: "",
      title_vi: "",
      description_en: "",
      description_vi: "",
      image_url: "",
      price_label: "",
      is_published: true,
      sort_order: 0,
    },
    fields: [
      { key: "slug", label: "Slug", required: true },
      {
        key: "type",
        label: "Type",
        type: "select",
        options: ["outfit", "accessory", "makeup"],
      },
      { key: "title_en", label: "Title — English", required: true },
      { key: "title_vi", label: "Title — Vietnamese" },
      {
        key: "description_en",
        label: "Description — English",
        type: "textarea",
      },
      {
        key: "description_vi",
        label: "Description — Vietnamese",
        type: "textarea",
      },
      { key: "image_url", label: "Image", type: "image" },
      { key: "price_label", label: "Price label" },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" },
    ],
  },
  {
    table: "experiences",
    label: "Experiences",
    description: "Hội An cultural activities and add-ons.",
    titleKey: "title_en",
    order: "sort_order",
    defaults: {
      slug: "",
      title_en: "",
      title_vi: "",
      description_en: "",
      description_vi: "",
      category_en: "",
      category_vi: "",
      duration_label: "",
      price_label: "",
      image_url: "",
      is_published: true,
      sort_order: 0,
    },
    fields: [
      { key: "slug", label: "Slug", required: true },
      { key: "title_en", label: "Title — English", required: true },
      { key: "title_vi", label: "Title — Vietnamese" },
      { key: "category_en", label: "Category — English" },
      { key: "category_vi", label: "Category — Vietnamese" },
      {
        key: "description_en",
        label: "Description — English",
        type: "textarea",
      },
      {
        key: "description_vi",
        label: "Description — Vietnamese",
        type: "textarea",
      },
      { key: "duration_label", label: "Duration" },
      { key: "price_label", label: "Price label" },
      { key: "image_url", label: "Image", type: "image" },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" },
    ],
  },
  {
    table: "studio_reels",
    label: "Studio Reels",
    description: "Paste Instagram Reel links for the homepage showcase.",
    titleKey: "title_en",
    order: "sort_order",
    defaults: {
      title_en: "",
      title_vi: "",
      category_en: "",
      category_vi: "",
      instagram_url: "",
      is_published: true,
      sort_order: 0,
    },
    fields: [
      { key: "title_en", label: "Title — English", required: true },
      { key: "title_vi", label: "Title — Vietnamese" },
      { key: "category_en", label: "Category — English" },
      { key: "category_vi", label: "Category — Vietnamese" },
      {
        key: "instagram_url",
        label: "Instagram Reel link",
        required: true,
      },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_published", label: "Published", type: "boolean" },
    ],
  },
];

const adminUserId =
  process.env.NEXT_PUBLIC_ADMIN_USER_ID ||
  "898ab6ad-3306-44ba-bfd4-99a0f3c29d58";

export default function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [active, setActive] = useState(sections[0].table);
  const [rows, setRows] = useState<Row[]>([]);
  const [albums, setAlbums] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isAdmin = Boolean(session && session.user.id === adminUserId);
  const section = useMemo(
    () => sections.find((item) => item.table === active)!,
    [active],
  );
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) =>
      setSession(next),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  const loadMedia = useCallback(async () => {
    const { data } = await supabase.storage.from("inhere-media").list("cms", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });
    setMedia(
      (data || []).map(
        (file) =>
          supabase.storage.from("inhere-media").getPublicUrl(`cms/${file.name}`)
            .data.publicUrl,
      ),
    );
  }, []);
  const loadRows = useCallback(async () => {
    setLoading(true);
    let query = supabase.from(active).select("*");
    if (section.order)
      query = query.order(section.order, {
        ascending: section.order !== "created_at",
      });
    const { data, error } = await query;
    setLoading(false);
    if (error) setMessage(error.message);
    else {
      const records = (data || []) as Row[];
      if (active === "blog_posts") {
        const slugs = new Set(records.map((row) => row.slug));
        setRows([...records, ...seoDraftTemplates.filter((row) => !slugs.has(row.slug))]);
      } else setRows(records);
    }
  }, [active, section.order]);
  useEffect(() => {
    if (!isAdmin) return;
    void loadRows();
    void loadMedia();
    void supabase
      .from("albums")
      .select("id,title_en")
      .order("sort_order")
      .then(({ data }) => setAlbums((data || []) as Row[]));
  }, [isAdmin, loadRows, loadMedia]);
  const login = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setAuthError(error.message);
  };
  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setLoading(true);
    const payload = { ...editing };
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    delete payload.__template;
    if (
      active === "blog_posts" &&
      payload.status === "published" &&
      !payload.published_at
    )
      payload.published_at = new Date().toISOString();
    const result = editing.id
      ? await supabase.from(active).update(payload).eq("id", editing.id)
      : await supabase.from(active).insert(payload);
    setLoading(false);
    if (result.error) setMessage(result.error.message);
    else {
      setMessage("Saved. The live website will update automatically.");
      setEditing(null);
      await loadRows();
    }
  };
  const remove = async (row: Row) => {
    if (!row.id || !window.confirm("Delete this item permanently?")) return;
    const { error } = await supabase.from(active).delete().eq("id", row.id);
    if (error) setMessage(error.message);
    else await loadRows();
  };
  const upload = async (file: File, field: string) => {
    setLoading(true);
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `cms/${Date.now()}-${safe}`;
    const { error } = await supabase.storage
      .from("inhere-media")
      .upload(path, file, { upsert: false });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
    const url = supabase.storage.from("inhere-media").getPublicUrl(path)
      .data.publicUrl;
    setEditing((current) => (current ? { ...current, [field]: url } : current));
    setLoading(false);
    await loadMedia();
  };
  const openAccount = () => {
    setAccountEmail(session?.user.email || "");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    setAccountOpen(true);
  };
  const updateAccount = async (e: FormEvent) => {
    e.preventDefault();
    if (!session) return;
    if (newPassword && newPassword.length < 8) {
      setMessage("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    if (!newPassword) {
      setMessage("Enter a new password first.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Password updated successfully.");
    setNewPassword("");
    setConfirmPassword("");
  };
  if (checking)
    return <div className="admin-loading">Opening INHERE Studio…</div>;
  if (!session)
    return (
      <main className="admin-login">
        <section>
          <a className="admin-login-back" href="/">
            ← Back to website
          </a>
          <div className="admin-login-brand">
            <span>INHERE</span>
            <small>CONTENT STUDIO · HỘI AN</small>
          </div>
          <p>PRIVATE STUDIO ACCESS</p>
          <h1>
            Welcome
            <br />
            <em>back.</em>
          </h1>
          <p className="admin-login-intro">
            Sign in to curate stories, albums, photographs and experiences.
          </p>
          <form onSubmit={login}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                autoComplete="email"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>
            {authError && <span>{authError}</span>}
            <button type="submit">Sign in to Admin →</button>
          </form>
        </section>
        <div>
          <div className="admin-login-visual-copy">
            <p>INHERE / 01</p>
            <h2>
              Stories are
              <br />
              <em>kept here.</em>
            </h2>
            <span>CONTENT · ALBUMS · JOURNAL · EXPERIENCES</span>
          </div>
        </div>
      </main>
    );
  if (!isAdmin)
    return (
      <main className="admin-denied">
        <h1>Access denied.</h1>
        <p>This account is not an INHERE administrator.</p>
        <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      </main>
    );
  return (
    <main className="admin-shell">
      <aside>
        <a className="admin-brand" href="/">
          INHERE<span>CONTENT STUDIO</span>
        </a>
        <nav>
          {sections.map((item) => (
            <button
              className={active === item.table ? "active" : ""}
              onClick={() => {
                setActive(item.table);
                setEditing(null);
                setMessage("");
              }}
              key={item.table}
            >
              <span>{String(sections.indexOf(item) + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          ))}
          <button className="admin-account-link" onClick={openAccount}>
            <span>{String(sections.length + 1).padStart(2, "0")}</span>
            Account Settings
          </button>
        </nav>
        <div>
          <p>{session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()}>Sign out ↗</button>
        </div>
      </aside>
      <section className="admin-workspace">
        <header>
          <div>
            <p>CONTENT MANAGEMENT</p>
            <h1>{section.label}</h1>
            <span>{section.description}</span>
          </div>
          {active !== "booking_requests" && (
            <button onClick={() => setEditing({ ...section.defaults })}>
              + Add new
            </button>
          )}
        </header>
        {message && (
          <div className="admin-message">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}
        <div className="admin-table-head">
          <span>{rows.length} items</span>
          <button onClick={() => void loadRows()}>Refresh ↻</button>
        </div>
        <div className="admin-list">
          {loading && !rows.length ? (
            <p>Loading…</p>
          ) : (
            rows.map((row) => (
              <article
                className={
                  section.fields.some((field) => field.type === "image")
                    ? ""
                    : "no-media"
                }
                key={String(row.id)}
              >
                {section.fields.find((field) => field.type === "image") && (
                  <img
                    src={String(
                      row[
                        section.fields.find((field) => field.type === "image")!
                          .key
                      ] || "",
                    )}
                    alt=""
                  />
                )}
                <div>
                  <p>
                    {String(
                      row.slug ||
                        row.page_key ||
                        row.service_name ||
                        section.label,
                    )}
                  </p>
                  <h3>{String(row[section.titleKey] || "Untitled")}</h3>
                  <span>
                    {active === "booking_requests"
                      ? String(row.status || "new")
                      : row.is_published === false || row.status === "draft"
                        ? "Draft / hidden"
                        : "Published"}
                  </span>
                </div>
                <button onClick={() => setEditing({ ...row })}>Edit</button>
                <button onClick={() => void remove(row)}>Delete</button>
              </article>
            ))
          )}
        </div>
      </section>
      {accountOpen && (
        <div
          className="admin-editor-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setAccountOpen(false);
          }}
        >
          <form className="admin-editor admin-account" onSubmit={updateAccount}>
            <header>
              <div>
                <p>SECURITY &amp; LOGIN</p>
                <h2>Account settings</h2>
              </div>
              <button type="button" onClick={() => setAccountOpen(false)}>
                Close ×
              </button>
            </header>
            {message && <div className="admin-message">{message}</div>}
            <div className="admin-fields">
              <label className="wide">
                Login email
                <input type="email" value={accountEmail} disabled readOnly />
                <small>
                  Email changes are temporarily disabled. Contact the site
                  administrator if this address needs to be updated.
                </small>
              </label>
              <label>
                New password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  placeholder="Minimum 8 characters"
                />
              </label>
              <label>
                Confirm new password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                />
              </label>
            </div>
            <div className="admin-security-note">
              <strong>Security note</strong>
              <p>
                Keep this account private. After changing the password, use the
                new password on your next login.
              </p>
            </div>
            <footer>
              <button type="button" onClick={() => setAccountOpen(false)}>
                Cancel
              </button>
              <button type="submit" disabled={loading}>
                {loading ? "Updating…" : "Update password"}
              </button>
            </footer>
          </form>
        </div>
      )}
      {editing && (
        <div
          className="admin-editor-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditing(null);
          }}
        >
          <form className="admin-editor" onSubmit={save}>
            <header>
              <div>
                <p>{editing.id ? "EDIT CONTENT" : "NEW CONTENT"}</p>
                <h2>{section.label}</h2>
              </div>
              <button type="button" onClick={() => setEditing(null)}>
                Close ×
              </button>
            </header>
            <div className="admin-fields">
              {section.fields.map((field) => (
                <label
                  className={
                    field.type === "textarea" || field.type === "video"
                      ? "wide"
                      : ""
                  }
                  key={field.key}
                >
                  {field.label}
                  {field.type === "textarea" ? (
                    <textarea
                      value={String(editing[field.key] ?? "")}
                      onChange={(e) =>
                        setEditing({ ...editing, [field.key]: e.target.value })
                      }
                      required={field.required}
                    />
                  ) : field.type === "boolean" ? (
                    <input
                      type="checkbox"
                      checked={Boolean(editing[field.key])}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [field.key]: e.target.checked,
                        })
                      }
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={String(editing[field.key] ?? "")}
                      onChange={(e) =>
                        setEditing({ ...editing, [field.key]: e.target.value })
                      }
                    >
                      {field.options?.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === "album" ? (
                    <select
                      value={String(editing[field.key] ?? "")}
                      onChange={(e) =>
                        setEditing({ ...editing, [field.key]: e.target.value })
                      }
                      required
                    >
                      <option value="">Choose album</option>
                      {albums.map((album) => (
                        <option value={String(album.id)} key={String(album.id)}>
                          {String(album.title_en)}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "video" ? (
                    <div className="admin-image-field admin-video-field">
                      {editing[field.key] && (
                        <video
                          src={String(editing[field.key])}
                          controls
                          muted
                          playsInline
                        />
                      )}
                      <input
                        type="url"
                        value={String(editing[field.key] ?? "")}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            [field.key]: e.target.value,
                          })
                        }
                        placeholder="Direct MP4/WebM URL"
                        required={field.required}
                      />
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          void upload(e.target.files[0], field.key)
                        }
                      />
                      <small>
                        For fast loading, use a vertical MP4 under 25 MB.
                      </small>
                    </div>
                  ) : field.type === "image" ? (
                    <div className="admin-image-field">
                      {editing[field.key] && (
                        <img src={String(editing[field.key])} alt="Preview" />
                      )}
                      <input
                        type="url"
                        value={String(editing[field.key] ?? "")}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            [field.key]: e.target.value,
                          })
                        }
                        placeholder="Image URL"
                      />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          void upload(e.target.files[0], field.key)
                        }
                      />
                    </div>
                  ) : (
                    <input
                      type={
                        field.type === "number"
                          ? "number"
                          : field.type === "date"
                            ? "date"
                            : "text"
                      }
                      value={String(editing[field.key] ?? "")}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [field.key]:
                            field.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        })
                      }
                      required={field.required}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="admin-media-strip">
              <p>Recent uploads — click to use in the first image field</p>
              <div>
                {media.slice(0, 8).map((url) => (
                  <button
                    type="button"
                    key={url}
                    onClick={() => {
                      const field = section.fields.find(
                        (item) => item.type === "image",
                      );
                      if (field) setEditing({ ...editing, [field.key]: url });
                    }}
                  >
                    <img src={url} alt="Media" />
                  </button>
                ))}
              </div>
            </div>
            <footer>
              <button type="button" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" disabled={loading}>
                {loading ? "Saving…" : "Save & publish changes"}
              </button>
            </footer>
          </form>
        </div>
      )}
    </main>
  );
}
