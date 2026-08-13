"use client";

/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */

import {
  FaArrowLeft,
  FaHouse,
  FaRotateRight,
  FaWhatsapp,
} from "react-icons/fa6";

export default function SiteError({ reset }: { reset?: () => void }) {
  const retry = () => {
    if (reset) reset();
    else window.location.reload();
  };

  return (
    <main className="site-error">
      <div className="site-error-glow" aria-hidden="true" />
      <section className="site-error-card">
        <a className="site-error-brand" href="/" aria-label="INHERE home">
          <img src="/inhere-facebook-avatar.jpg" alt="INHERE" />
          <span>
            INHERE<small>HỘI AN</small>
          </span>
        </a>
        <p className="eyebrow">A MOMENTARY PAUSE</p>
        <h1>
          This story needs
          <br />
          <em>one more moment.</em>
        </h1>
        <p className="site-error-copy">
          Something interrupted the page while it was loading. Your booking and
          information are safe—please try again or return to the studio
          homepage.
        </p>
        <div className="site-error-actions">
          <button type="button" onClick={retry}>
            <FaRotateRight /> Try again
          </button>
          <a href="/">
            <FaHouse /> Back to homepage
          </a>
        </div>
        <a
          className="site-error-help"
          href="https://wa.me/84898199099"
          target="_blank"
        >
          <FaWhatsapp /> Need help? Message INHERE on WhatsApp
        </a>
        <span className="site-error-code">
          <FaArrowLeft /> INHERE · HỘI AN
        </span>
      </section>
      <aside className="site-error-art" aria-hidden="true">
        <span>24 ĐÀO DUY TỪ</span>
        <div>
          <i>✦</i>
        </div>
        <p>
          Every beautiful story
          <br />
          finds its way back.
        </p>
      </aside>
    </main>
  );
}
