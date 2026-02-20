"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Mail,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  CheckCircle2,
  X,
  ArrowRight,
  ChevronDown,
  Check,
} from "lucide-react";
import { Link } from "@/i18n/routing";

function SuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-cream flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-border transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-success" />
          </div>
        </div>

        <h3
          className="text-2xl font-bold text-text-primary mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Message Sent!
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          Thank you for reaching out. Our team will review your message and get
          back to you within <strong>24 hours</strong>. We appreciate your
          patience.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-sm font-medium rounded-full border border-border text-text-primary hover:bg-bg-cream transition-colors"
          >
            Send Another
          </button>
          <Link
            href="/"
            className="flex-1 px-6 py-3 text-sm font-medium rounded-full bg-accent text-white hover:bg-accent-hover transition-colors inline-flex items-center justify-center gap-2 group"
          >
            Back to Home
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const t = useTranslations("nav");
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [subjectOpen, setSubjectOpen] = useState(false);
  const subjectRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => setShowModal(false), []);

  const subjectOptions = [
    { value: "booking", label: "Booking Enquiry" },
    { value: "cancellation", label: "Cancellation / Modification" },
    { value: "payment", label: "Payment & Pricing" },
    { value: "account", label: "Account Support" },
    { value: "partnership", label: "Partnership / Business" },
    { value: "other", label: "Other" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    if (!subjectOpen) return;
    const onClick = (e: MouseEvent) => {
      if (subjectRef.current && !subjectRef.current.contains(e.target as Node))
        setSubjectOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [subjectOpen]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    setTimeout(() => {
      setSending(false);
      setShowModal(true);
      form.reset();
      setSubject("");
    }, 1200);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-bg-dark text-white pt-40 pb-20 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-bright/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-bright/3 rounded-full blur-3xl translate-y-1/2" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-accent-bright text-sm font-medium tracking-widest uppercase mb-4">
            Get in Touch
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t("contact")}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Have a question about your booking or need assistance? We&apos;re
            here to help and typically respond within 24 hours.
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Mail,
              label: "Email Us",
              value: "sales@uniqevo.co.uk",
              href: "mailto:sales@uniqevo.co.uk",
            },
            {
              icon: MapPin,
              label: "Our Office",
              value: "Willett House, Queens Road West, London, UK",
              href: null,
            },
            {
              icon: Clock,
              label: "Response Time",
              value: "Within 24 hours",
              href: null,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                  <item.icon size={20} className="text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-text-primary">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left side — context */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-text-primary mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Send Us a Message
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Whether you have questions about a booking, need help finding the
                perfect hotel, or want to learn more about our platform — fill
                out the form and our team will get right back to you.
              </p>
            </div>

            {/* FAQ hints */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
                Common Topics
              </h3>
              {[
                "Booking modifications or cancellations",
                "Payment and pricing enquiries",
                "Account or technical support",
                "Partnership or business enquiries",
              ].map((topic) => (
                <div key={topic} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-bright shrink-0" />
                  <span className="text-sm text-text-secondary">{topic}</span>
                </div>
              ))}
            </div>

            {/* Quick CTA */}
            <div className="p-5 rounded-xl bg-bg-cream border border-border">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary mb-1">
                    Need instant help?
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Use our chat assistant at the bottom-right corner of the page
                    for quick answers to common questions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side — form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-border p-8 sm:p-10 shadow-sm"
            >
              <div className="space-y-5">
                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      First Name <span className="text-error">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      minLength={2}
                      maxLength={50}
                      pattern="^[A-Za-z\u00C0-\u024F\u0600-\u06FF'\-\s]+$"
                      title="Letters, hyphens and apostrophes only (2-50 characters)"
                      autoComplete="given-name"
                      placeholder="John"
                      className="w-full px-4 py-3 text-sm border border-border rounded-xl bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors invalid:not-placeholder-shown:border-error invalid:not-placeholder-shown:focus:ring-error/30"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-text-primary mb-2"
                    >
                      Last Name <span className="text-error">*</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      minLength={2}
                      maxLength={50}
                      pattern="^[A-Za-z\u00C0-\u024F\u0600-\u06FF'\-\s]+$"
                      title="Letters, hyphens and apostrophes only (2-50 characters)"
                      autoComplete="family-name"
                      placeholder="Doe"
                      className="w-full px-4 py-3 text-sm border border-border rounded-xl bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors invalid:not-placeholder-shown:border-error invalid:not-placeholder-shown:focus:ring-error/30"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    title="Please enter a valid email address"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors invalid:not-placeholder-shown:border-error invalid:not-placeholder-shown:focus:ring-error/30"
                  />
                </div>

                {/* Subject — custom dropdown */}
                <div ref={subjectRef} className="relative">
                  <label
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Subject <span className="text-error">*</span>
                  </label>
                  {/* Hidden native input for form validation */}
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={subject}
                    required
                    onChange={() => {}}
                    className="sr-only"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    onClick={() => setSubjectOpen((o) => !o)}
                    className={`w-full px-4 py-3 text-sm border rounded-xl bg-white text-left flex items-center justify-between transition-colors ${
                      subjectOpen
                        ? "border-accent ring-2 ring-accent/30"
                        : "border-border"
                    } ${subject ? "text-text-primary" : "text-text-muted"}`}
                  >
                    {subject
                      ? subjectOptions.find((o) => o.value === subject)?.label
                      : "Select a topic..."}
                    <ChevronDown
                      size={16}
                      className={`text-text-muted transition-transform ${
                        subjectOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {subjectOpen && (
                    <ul className="absolute z-20 mt-1 w-full bg-white border border-border rounded-xl shadow-lg py-1 max-h-60 overflow-auto">
                      {subjectOptions.map((opt) => (
                        <li key={opt.value}>
                          <button
                            type="button"
                            onClick={() => {
                              setSubject(opt.value);
                              setSubjectOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between transition-colors ${
                              subject === opt.value
                                ? "bg-accent/10 text-accent font-medium"
                                : "text-text-primary hover:bg-accent/5"
                            }`}
                          >
                            {opt.label}
                            {subject === opt.value && (
                              <Check size={14} className="text-accent" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Booking reference (optional) */}
                <div>
                  <label
                    htmlFor="bookingRef"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Booking Reference{" "}
                    <span className="text-text-muted font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="bookingRef"
                    name="bookingRef"
                    type="text"
                    maxLength={30}
                    pattern="^[A-Za-z0-9\-_]+$"
                    title="Letters, numbers and hyphens only (max 30 characters)"
                    placeholder="e.g. BYH-123456"
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors invalid:not-placeholder-shown:border-error invalid:not-placeholder-shown:focus:ring-error/30"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-text-primary mb-2"
                  >
                    Message <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    minLength={10}
                    maxLength={2000}
                    title="Please enter at least 10 characters (max 2000)"
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 text-sm border border-border rounded-xl bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none invalid:not-placeholder-shown:border-error invalid:not-placeholder-shown:focus:ring-error/30"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full px-8 py-3.5 text-sm font-medium rounded-full bg-accent text-white hover:bg-accent-hover transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-25"
                        />
                        <path
                          d="M4 12a8 8 0 018-8"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          className="opacity-75"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal open={showModal} onClose={closeModal} />
    </div>
  );
}
