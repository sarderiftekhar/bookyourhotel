"use client";

import {
  Shield,
  Globe,
  Users,
  Building2,
  CreditCard,
  BadgeCheck,
  Handshake,
  Server,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-bg-dark text-white pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-accent-bright text-sm font-medium tracking-widest uppercase mb-4">
            Who We Are
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            About Us
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A modern hotel booking platform connecting travellers directly with
            over 2 million properties worldwide — powered by trusted
            technology, backed by transparency.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        {/* Our Story */}
        <section>
          <h2
            className="text-2xl sm:text-3xl font-bold text-text-primary mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Our Story
          </h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              BookYourHotel was created with a straightforward purpose: to give
              travellers access to the same hotels they already know and love,
              but at genuinely better prices. We believe that finding and
              booking accommodation should be simple, transparent, and free
              from hidden markups or confusing pricing tricks.
            </p>
            <p>
              Unlike traditional online travel agencies that layer fees and
              commissions on top of room rates, BookYourHotel operates as a
              modern digital storefront — a streamlined interface that connects
              you directly with a vast global inventory of hotels. From
              boutique guesthouses in Lisbon to five-star resorts in Dubai, our
              platform searches, compares, and presents the best available
              rates across more than 2 million properties in over 190
              countries.
            </p>
            <p>
              We do not own or manage any hotels ourselves. Instead, we partner
              with industry-leading technology providers to source wholesale
              rates from hotels around the world and pass those savings on to
              you. The result is the same room, the same dates, the same
              experience — just at a better price.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2
            className="text-2xl sm:text-3xl font-bold text-text-primary mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            How It Works
          </h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              When you search for a hotel on BookYourHotel, our platform
              queries a global network of hotel suppliers in real time. We
              aggregate rates from thousands of direct hotel contracts and
              wholesale channels, then present them to you in a clean,
              easy-to-compare format. There are no hidden fees — the price
              displayed is the price you pay.
            </p>
            <p>
              Once you select a room, the booking and payment process is
              handled securely through our technology partner&apos;s
              infrastructure. Your payment card details are processed by
              Stripe, a globally recognised payment processor trusted by
              millions of businesses. BookYourHotel never stores, accesses, or
              processes your card information directly — your financial data
              remains protected at every step.
            </p>
            <p>
              After payment is confirmed, your reservation is sent directly to
              the hotel. You receive a booking confirmation with all the
              details you need, and the hotel handles your stay, any
              modifications, cancellations, and refunds according to their own
              policies.
            </p>
          </div>
        </section>

        {/* Values Grid */}
        <section>
          <h2
            className="text-2xl sm:text-3xl font-bold text-text-primary mb-8"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                title: "Trust & Transparency",
                desc: "No hidden fees, no bait-and-switch pricing. What you see is exactly what you pay — every time.",
              },
              {
                icon: Globe,
                title: "Global Reach",
                desc: "Access over 2 million hotels across 190+ countries, from budget stays to luxury resorts.",
              },
              {
                icon: CreditCard,
                title: "Secure Payments",
                desc: "All transactions are processed through Stripe with bank-level encryption. We never touch your card data.",
              },
              {
                icon: Users,
                title: "Traveller-First Design",
                desc: "A clean, intuitive interface built for real people — search, compare, and book in minutes.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-5 rounded-xl bg-bg-card border border-border"
              >
                <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <item.icon size={22} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Managed By */}
        <section>
          <h2
            className="text-2xl sm:text-3xl font-bold text-text-primary mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Managed by Unique Evolution Limited
          </h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              BookYourHotel is owned and operated by{" "}
              <strong className="text-text-primary">
                Unique Evolution Limited
              </strong>
              , a company registered in the United Kingdom. We are responsible
              for the development, maintenance, and day-to-day operations of
              the platform, ensuring that every feature — from hotel search to
              booking confirmation — meets the highest standards of quality and
              reliability.
            </p>
            <p>
              Our team is dedicated to building technology that makes travel
              more accessible and affordable. We continuously improve our
              platform based on user feedback and emerging industry trends,
              with a focus on performance, security, and ease of use.
            </p>
          </div>
          <div className="mt-6 p-5 rounded-xl bg-bg-cream border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Building2 size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">
                    Unique Evolution Limited
                  </p>
                  <p className="text-xs text-text-muted">
                    Plaistow, London, UK
                  </p>
                </div>
              </div>
              <a
                href="mailto:sales@uniqevo.co.uk"
                className="text-sm text-accent font-medium hover:text-accent-hover transition-colors sm:ml-auto"
              >
                sales@uniqevo.co.uk
              </a>
            </div>
          </div>
        </section>

        {/* LiteAPI / Nuitée Section */}
        <section>
          <h2
            className="text-2xl sm:text-3xl font-bold text-text-primary mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Powered by LiteAPI &amp; Nuitée
          </h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Behind every search result and booking on BookYourHotel is{" "}
              <a
                href="https://www.liteapi.travel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-medium hover:text-accent-hover transition-colors underline underline-offset-2"
              >
                LiteAPI
              </a>
              , a world-class travel technology platform developed by{" "}
              <a
                href="https://nuitee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-medium hover:text-accent-hover transition-colors underline underline-offset-2"
              >
                Nuitée
              </a>
              . Founded in 2017 and headquartered in Dublin, Ireland, Nuitée
              has grown into one of the most trusted names in B2B hotel
              distribution, serving over 50,000 developers and powering more
              than $1 billion in annual booking volume.
            </p>
            <p>
              LiteAPI provides the infrastructure that connects our platform to
              a global inventory of over 2.6 million properties. Their
              technology handles the entire booking lifecycle — from real-time
              availability and rate aggregation to secure payment processing
              and booking fulfilment — ensuring a seamless experience for every
              traveller.
            </p>
            <p>
              All payment processing is managed entirely through LiteAPI&apos;s
              infrastructure, using Stripe as the payment processor. This means
              your card details are handled to the highest security standards
              without BookYourHotel ever accessing or storing sensitive
              financial data.
            </p>
          </div>

          {/* Nuitée Trust Indicators */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Server,
                title: "2.6M+ Properties",
                desc: "Global inventory across 190+ countries with major chains like Hilton, Marriott, and Accor",
              },
              {
                icon: BadgeCheck,
                title: "$48M Series A",
                desc: "Backed by Accel and advised by the Chairman of Booking.com and former CEO of Priceline",
              },
              {
                icon: Handshake,
                title: "Trusted Partners",
                desc: "Partnerships with Revolut (60M+ users), Google, and leading global travel brands",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl bg-bg-dark text-white border border-border-dark"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-bright/15 flex items-center justify-center mb-3">
                  <item.icon size={20} className="text-accent-bright" />
                </div>
                <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Security & Compliance */}
          <div className="mt-8 p-6 rounded-xl bg-accent/5 border border-accent/10">
            <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
              <Shield size={18} className="text-accent" />
              Security &amp; Compliance
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>
                  <strong>GDPR Compliant</strong> — Full Data Processing
                  Agreement aligned with UK and EU data protection regulations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>
                  <strong>Stripe Payment Security</strong> — PCI DSS Level 1
                  certified payment processing, the highest level of security
                  certification
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>
                  <strong>SSL/TLS Encryption</strong> — All data transmitted
                  between your browser and our servers is fully encrypted
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">&#10003;</span>
                <span>
                  <strong>Comprehensive Security Framework</strong> —
                  Authentication controls, infrastructure monitoring, incident
                  response protocols, and vulnerability management
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <h2
            className="text-2xl sm:text-3xl font-bold text-text-primary mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to Find Your Next Stay?
          </h2>
          <p className="text-text-secondary mb-8 max-w-lg mx-auto">
            Search over 2 million hotels worldwide and discover why travellers
            trust BookYourHotel for better prices on the same great stays.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white font-medium rounded-full hover:bg-accent-hover transition-colors duration-300 group"
          >
            Start Searching
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </section>
      </div>
    </div>
  );
}
