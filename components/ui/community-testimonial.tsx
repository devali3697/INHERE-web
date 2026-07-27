import React, { CSSProperties, ReactNode } from "react";
/* eslint-disable @next/next/no-img-element */

export type Testimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  avatarUrl: string;
};

type TestimonialCardProps = Omit<Testimonial, "id">;

export const TestimonialCard = ({
  quote,
  authorName,
  authorTitle,
  avatarUrl,
}: TestimonialCardProps) => (
  <article className="testimonial-card">
    <header className="testimonial-card-head">
      <span className="testimonial-quote-mark" aria-hidden="true">
        “
      </span>
      <div className="testimonial-stars" aria-label="Five-star review">
        ★ ★ ★ ★ ★
      </div>
    </header>
    <blockquote>{quote}</blockquote>
    <footer className="testimonial-author">
      <div className="testimonial-avatar">
        <img src={avatarUrl} alt={authorName} />
      </div>
      <div className="testimonial-author-copy">
        <span>Verified guest</span>
        <h4>{authorName}</h4>
        <p>{authorTitle}</p>
      </div>
      <span className="testimonial-card-flourish" aria-hidden="true">
        ↗
      </span>
    </footer>
    <div className="testimonial-card-line" aria-hidden="true" />
  </article>
);

type HorizontalScrollerProps = {
  children: ReactNode;
  speed?: string;
  direction?: "left" | "right";
};

export const HorizontalScroller = ({
  children,
  speed = "40s",
  direction = "left",
}: HorizontalScrollerProps) => {
  const animationClass =
    direction === "right"
      ? "animate-scroll-horizontal-reverse"
      : "animate-scroll-horizontal";
  return (
    <div className="mask-fade group relative w-full overflow-hidden">
      <div
        className={`flex ${animationClass}`}
        style={{ "--scroll-duration": speed } as CSSProperties}
      >
        <div className="flex items-stretch justify-center gap-8 px-4">
          {children}
        </div>
        <div
          className="flex items-stretch justify-center gap-8 px-4"
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export type TestimonialsData = {
  title: string;
  subtitle: string;
  rows: Array<{
    id: string;
    speed: string;
    direction: "left" | "right";
    testimonials: Testimonial[];
  }>;
};

export default function TestimonialsSection({
  data,
}: {
  data: TestimonialsData;
}) {
  return (
    <section className="testimonials-section relative flex w-full max-w-7xl flex-col items-center gap-12 p-10">
      <div className="z-10 flex max-w-2xl flex-col items-center gap-6 text-center">
        <p className="eyebrow">WORDS FROM OUR GUESTS</p>
        <h2
          style={{
            opacity: 0,
            animation: "fadeInUp .7s ease-out .2s forwards",
          }}
        >
          {data.title}
        </h2>
        <p
          className="text-lg text-gray-700"
          style={{
            opacity: 0,
            animation: "fadeInUp .7s ease-out .4s forwards",
          }}
        >
          {data.subtitle}
        </p>
      </div>
      <div className="z-10 flex w-full max-w-6xl flex-col gap-8">
        {data.rows.map((row) => (
          <HorizontalScroller
            key={row.id}
            speed={row.speed}
            direction={row.direction}
          >
            {row.testimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                quote={t.quote}
                authorName={t.authorName}
                authorTitle={t.authorTitle}
                avatarUrl={t.avatarUrl}
              />
            ))}
          </HorizontalScroller>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 85% 67% at 50% 100%, rgba(216,197,165,.5) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />
    </section>
  );
}
