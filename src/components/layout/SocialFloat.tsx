"use client";

import { useEffect, useState, useCallback } from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bookyourhotel.online";
const SHARE_TEXT = "Search over 2 million hotels worldwide. Simple booking, perfect stays.";

function openShareWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
}

const socials = [
  {
    label: "Share on Facebook",
    share: () =>
      openShareWindow(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`,
      ),
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.09.042 1.587.084V7.98h-1.264c-1.24 0-1.628.59-1.628 1.696v2.349h2.745l-.472 3.667h-2.273v8z" />
      </svg>
    ),
  },
  {
    label: "Share on X",
    share: () =>
      openShareWindow(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`,
      ),
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Share on LinkedIn",
    share: () =>
      openShareWindow(
        `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(SITE_URL)}&title=${encodeURIComponent("BookYourHotel - Simple Booking, Perfect Stays.")}`,
      ),
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Share on Instagram",
    share: async () => {
      // Instagram has no web share URL — use Web Share API or copy link
      if (navigator.share) {
        try {
          await navigator.share({ title: "BookYourHotel", text: SHARE_TEXT, url: SITE_URL });
        } catch {
          // user cancelled — ignore
        }
      } else {
        await navigator.clipboard.writeText(SITE_URL);
        alert("Link copied! Paste it on Instagram.");
      }
    },
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

export default function SocialFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-4 pointer-events-none"
      }`}
    >
      {socials.map((s) => (
        <button
          key={s.label}
          onClick={s.share}
          aria-label={s.label}
          title={s.label}
          className="w-9 h-9 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-text-muted hover:bg-accent hover:text-white hover:border-accent hover:shadow-md hover:scale-110 transition-all duration-200 cursor-pointer"
        >
          {s.icon}
        </button>
      ))}
    </div>
  );
}
