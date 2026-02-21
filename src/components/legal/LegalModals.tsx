"use client";

import { useLegalModalStore } from "@/store/legalModalStore";
import LegalModal from "./LegalModal";
import {
  Shield,
  FileText,
  HelpCircle,
  Cookie,
  Mail,
  MapPin,
  CreditCard,
  Lock,
  Users,
  Globe,
  Clock,
  AlertCircle,
  BookOpen,
  MessageCircle,
  RefreshCw,
  BanIcon,
} from "lucide-react";

const COMPANY = {
  legal: "Unique Evolution Limited",
  brand: "BookYourHotel",
  email: "sales@uniqevo.co.uk",
  address: "Plaistow, London, United Kingdom",
  country: "United Kingdom",
  jurisdiction: "England and Wales",
};

/* ─────────── Section helper ─────────── */
function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-accent shrink-0" />
        <h3 className="font-semibold text-text-primary text-base">{title}</h3>
      </div>
      <div className="pl-6 space-y-2">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PRIVACY POLICY
   ═══════════════════════════════════════ */
function PrivacyPolicyContent() {
  return (
    <>
      <p className="text-text-muted text-xs">Last updated: February 2026</p>
      <p>
        This Privacy Policy explains how {COMPANY.legal}, trading as{" "}
        {COMPANY.brand} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;),
        collects, uses, and protects your personal information when you use our
        website and services. We are committed to ensuring your privacy is
        protected in accordance with the UK Data Protection Act 2018 and the UK
        General Data Protection Regulation (UK GDPR).
      </p>

      <Section icon={Shield} title="1. Data Controller">
        <p>
          The data controller responsible for your personal data is{" "}
          {COMPANY.legal}, a company registered in the {COMPANY.country},
          with its registered office at {COMPANY.address}.
        </p>
        <p>
          Contact us at{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-accent underline">
            {COMPANY.email}
          </a>{" "}
          for any data protection enquiries.
        </p>
      </Section>

      <Section icon={Users} title="2. Information We Collect">
        <p>We collect and process the following categories of personal data:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>Identity Data:</strong> first name, last name, title.
          </li>
          <li>
            <strong>Contact Data:</strong> email address, phone number.
          </li>
          <li>
            <strong>Booking Data:</strong> travel dates, hotel preferences, guest
            details, special requests.
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, browser type, device
            information, operating system, referring URL.
          </li>
          <li>
            <strong>Usage Data:</strong> pages visited, search queries, click
            patterns, time spent on pages.
          </li>
          <li>
            <strong>Preference Data:</strong> language, currency, and display
            settings saved in your browser.
          </li>
        </ul>
        <div className="bg-accent/5 border border-accent/15 rounded-lg p-3 mt-2">
          <p className="text-xs font-medium text-text-primary mb-1">
            Important: Payment Card Data
          </p>
          <p className="text-xs">
            {COMPANY.brand} does <strong>not</strong> collect, process, store,
            or have access to your payment card information.{" "}
            All payment data is entered directly into a secure payment form
            provided by our third-party booking platform (LiteAPI) and its
            PCI DSS-compliant payment processor (Stripe). Your card details are
            transmitted directly to Stripe and never pass through or are stored
            on {COMPANY.brand} servers.
          </p>
        </div>
      </Section>

      <Section icon={FileText} title="3. How We Use Your Information">
        <p>We use your personal data for the following purposes:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Facilitating hotel bookings on your behalf through our third-party booking platform.</li>
          <li>
            Sending booking confirmations, itinerary updates, and
            post-stay communications.
          </li>
          <li>Providing customer support and responding to enquiries.</li>
          <li>Personalising your experience (currency, language, saved preferences).</li>
          <li>Improving our website, services, and search algorithms.</li>
          <li>
            Sending promotional offers and newsletters (only with your explicit
            consent; you may opt out at any time).
          </li>
          <li>Complying with legal obligations and fraud prevention.</li>
        </ul>
      </Section>

      <Section icon={Globe} title="4. Legal Basis for Processing">
        <p>We process your data based on the following lawful grounds:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>Contract:</strong> processing necessary to facilitate your
            booking through our platform.
          </li>
          <li>
            <strong>Consent:</strong> marketing communications and non-essential
            cookies.
          </li>
          <li>
            <strong>Legitimate Interest:</strong> improving our services, fraud
            prevention, analytics.
          </li>
          <li>
            <strong>Legal Obligation:</strong> regulatory and compliance
            requirements.
          </li>
        </ul>
      </Section>

      <Section icon={Users} title="5. Information Sharing">
        <p>We may share your personal data with:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>Booking Platform (LiteAPI):</strong> our third-party booking
            platform that processes reservations and manages payment
            transactions directly with accommodation providers. LiteAPI acts as
            the merchant of record for all bookings.
          </li>
          <li>
            <strong>Accommodation Providers:</strong> your name, contact details,
            and booking information are shared with hotels to fulfil your
            reservation.
          </li>
          <li>
            <strong>Payment Processor (Stripe):</strong> payment card data is
            processed directly by Stripe on behalf of LiteAPI.{" "}
            {COMPANY.brand} does not process or have access to your card details.
          </li>
          <li>
            <strong>Service Providers:</strong> hosting, analytics, and customer
            support tools that assist in operating our platform.
          </li>
          <li>
            <strong>Legal Authorities:</strong> when required by law or to
            protect our legal rights.
          </li>
        </ul>
        <p>
          We <strong>do not sell</strong> your personal information to third
          parties.
        </p>
      </Section>

      <Section icon={Lock} title="6. Data Security & Payment Processing">
        <p>
          We implement appropriate technical and organisational measures to
          protect your personal data, including:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>SSL/TLS encryption for all data in transit.</li>
          <li>Regular security audits and access controls.</li>
          <li>Data minimisation — we only collect what is necessary.</li>
        </ul>
        <div className="bg-accent/5 border border-accent/15 rounded-lg p-3 mt-2">
          <p className="text-xs font-medium text-text-primary mb-1">
            Payment Security
          </p>
          <p className="text-xs">
            All payments are processed by Stripe (a PCI DSS Level 1 certified
            payment processor) on behalf of our booking platform LiteAPI.
            Payment is collected directly by LiteAPI as the merchant of record
            and remitted to the accommodation provider.{" "}
            {COMPANY.legal} does not collect, process, or store any payment card
            data. Your card details are entered into Stripe&apos;s secure embedded
            payment form and are never transmitted to or accessible by our
            servers. We have no ability to view, access, or retrieve your full
            card number, CVV, or other sensitive payment credentials.
          </p>
        </div>
      </Section>

      <Section icon={Cookie} title="7. Cookies">
        <p>
          We use cookies and similar technologies to remember your preferences
          (language, currency), improve your browsing experience, and analyse
          site traffic. For full details on the cookies we use and how to manage
          them, please see our Cookie Policy (available in the footer).
        </p>
      </Section>

      <Section icon={Shield} title="8. Your Rights">
        <p>
          Under UK GDPR, you have the following rights regarding your personal
          data:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>Access:</strong> request a copy of the personal data we hold
            about you.
          </li>
          <li>
            <strong>Rectification:</strong> request correction of inaccurate
            data.
          </li>
          <li>
            <strong>Erasure:</strong> request deletion of your data (&quot;right to be
            forgotten&quot;).
          </li>
          <li>
            <strong>Restriction:</strong> request limitation of processing.
          </li>
          <li>
            <strong>Portability:</strong> receive your data in a structured,
            machine-readable format.
          </li>
          <li>
            <strong>Objection:</strong> object to processing based on legitimate
            interests.
          </li>
          <li>
            <strong>Withdraw Consent:</strong> withdraw consent at any time for
            consent-based processing.
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-accent underline">
            {COMPANY.email}
          </a>
          . We will respond within 30 days.
        </p>
        <p className="text-xs text-text-muted">
          For rights related to payment data held by Stripe or LiteAPI, you may
          need to contact those providers directly. We will assist you in
          directing your request.
        </p>
      </Section>

      <Section icon={Clock} title="9. Data Retention">
        <p>
          We retain your personal data only for as long as necessary to fulfil
          the purposes for which it was collected:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>Booking references:</strong> 6 years (legal obligations).
          </li>
          <li>
            <strong>Account data:</strong> until you request account deletion.
          </li>
          <li>
            <strong>Marketing preferences:</strong> until you unsubscribe.
          </li>
          <li>
            <strong>Analytics data:</strong> 26 months in anonymised form.
          </li>
        </ul>
        <p className="text-xs text-text-muted">
          Payment transaction records are retained by LiteAPI and Stripe in
          accordance with their own data retention policies and applicable
          financial regulations.
        </p>
      </Section>

      <Section icon={Globe} title="10. International Transfers">
        <p>
          Your data may be transferred to and processed in countries outside the
          UK where our service providers (including LiteAPI and Stripe) operate.
          We ensure appropriate safeguards are in place, including Standard
          Contractual Clauses (SCCs) and adequacy decisions, in compliance with
          UK GDPR.
        </p>
      </Section>

      <Section icon={AlertCircle} title="11. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Material changes
          will be communicated via our website. We encourage you to review this
          policy periodically.
        </p>
      </Section>

      <Section icon={Mail} title="12. Contact Us">
        <p>
          For any privacy-related questions or to exercise your rights, please
          contact:
        </p>
        <div className="bg-bg-cream rounded-lg p-4 space-y-1">
          <p className="font-semibold text-text-primary">{COMPANY.legal}</p>
          <p>{COMPANY.address}</p>
          <p>
            Email:{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-accent underline"
            >
              {COMPANY.email}
            </a>
          </p>
        </div>
        <p className="text-xs text-text-muted mt-2">
          You also have the right to lodge a complaint with the Information
          Commissioner&apos;s Office (ICO) at{" "}
          <span className="text-accent">ico.org.uk</span> if you believe your
          data protection rights have been violated.
        </p>
      </Section>
    </>
  );
}

/* ═══════════════════════════════════════
   TERMS OF SERVICE
   ═══════════════════════════════════════ */
function TermsOfServiceContent() {
  return (
    <>
      <p className="text-text-muted text-xs">Last updated: February 2026</p>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of the {COMPANY.brand}{" "}
        website and services, operated by {COMPANY.legal}, a company registered
        in the {COMPANY.country}. By accessing or using our services, you agree
        to be bound by these Terms.
      </p>

      <Section icon={FileText} title="1. Acceptance of Terms">
        <p>
          By accessing and using {COMPANY.brand}, you confirm that you are at
          least 18 years of age, have the legal capacity to enter into binding
          agreements, and agree to comply with these Terms. If you do not agree
          with any part of these Terms, you must not use our services.
        </p>
      </Section>

      <Section icon={Globe} title="2. Service Description & Our Role">
        <p>
          {COMPANY.brand} provides a hotel search and booking platform operated
          by {COMPANY.legal}. We act solely as an <strong>intermediary</strong>{" "}
          between you and hotel accommodation providers, powered by our
          third-party booking platform (LiteAPI).
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            We display hotel availability, rates, and information sourced from
            our booking platform.
          </li>
          <li>
            We do <strong>not</strong> own, operate, or manage any hotels or
            accommodation properties listed on our platform.
          </li>
          <li>
            We do <strong>not</strong> collect, process, or handle any payments.
            All financial transactions are managed directly between you, our
            booking platform (LiteAPI), and the accommodation provider.
          </li>
          <li>
            All bookings are subject to availability and the terms of the
            accommodation provider.
          </li>
        </ul>
      </Section>

      <Section icon={BookOpen} title="3. Booking Terms">
        <p>
          When you make a booking through {COMPANY.brand}:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            Your booking is processed by our booking platform (LiteAPI), which
            acts as the <strong>merchant of record</strong>. LiteAPI facilitates
            the reservation directly with the accommodation provider.
          </li>
          <li>
            The contractual relationship for the accommodation is between you and
            the hotel provider, facilitated by LiteAPI. {COMPANY.legal} is not a
            party to this contract.
          </li>
          <li>
            Cancellation policies, check-in/check-out times, and property rules
            are set by each accommodation provider and displayed during the
            booking process.
          </li>
          <li>
            You are responsible for ensuring all booking details (dates, guest
            names, special requests) are accurate at the time of booking.
          </li>
          <li>
            Booking confirmations are issued by LiteAPI on behalf of the
            accommodation provider. {COMPANY.brand} may also send you a
            confirmation notification for your convenience.
          </li>
        </ul>
      </Section>

      <Section icon={CreditCard} title="4. Pricing & Payment">
        <p>
          All prices are displayed in the currency you select. Final pricing,
          including applicable taxes and fees, is shown before you confirm your
          booking. Prices are subject to availability and may change until a
          booking is confirmed.
        </p>
        <div className="bg-accent/5 border border-accent/15 rounded-lg p-3 mt-2 space-y-2">
          <p className="text-xs font-medium text-text-primary">
            Payment Processing — Important Notice
          </p>
          <ul className="list-disc pl-4 space-y-1 text-xs">
            <li>
              <strong>{COMPANY.legal} does not collect, process, or receive any
              payment</strong> from you. We are not the merchant of record and do not
              handle any financial transactions.
            </li>
            <li>
              All payments are processed directly by our booking platform,{" "}
              <strong>LiteAPI</strong>, which acts as the merchant of record.
              LiteAPI uses <strong>Stripe</strong> (a PCI DSS Level 1 certified
              payment processor) to securely process your card payment.
            </li>
            <li>
              Your payment card details are entered directly into Stripe&apos;s
              secure embedded payment form. Card data is transmitted directly to
              Stripe and is <strong>never</strong> sent to, stored on, or
              accessible by {COMPANY.brand} servers.
            </li>
            <li>
              The charge on your bank or card statement will appear under
              LiteAPI&apos;s merchant name (or a related descriptor), not under{" "}
              {COMPANY.brand} or {COMPANY.legal}.
            </li>
            <li>
              We accept major credit and debit cards including Visa, Mastercard,
              and American Express, subject to Stripe&apos;s supported payment
              methods.
            </li>
          </ul>
        </div>
        <p className="text-xs text-text-muted mt-2">
          Some accommodation providers may charge additional local fees (e.g.,
          resort fees, city tax, tourist levy) directly at the property. These
          will be noted during the booking process where applicable.
        </p>
      </Section>

      <Section icon={RefreshCw} title="5. Cancellations & Refunds">
        <div className="bg-accent/5 border border-accent/15 rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium text-text-primary">
            Important Disclaimer
          </p>
          <p className="text-xs">
            <strong>{COMPANY.legal} does not handle cancellations or process
            refunds.</strong> All cancellation and refund matters are managed
            entirely by the accommodation provider and our booking platform
            (LiteAPI), which acts as the merchant of record.
          </p>
        </div>
        <p className="mt-2">
          Cancellation policies vary by accommodation and room type and are
          set solely by the hotel provider:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>Free cancellation:</strong> available on selected rates up to
            the deadline specified by the hotel during the booking process.
          </li>
          <li>
            <strong>Non-refundable rates:</strong> clearly marked during the
            booking process; no refund is available after confirmation.
          </li>
          <li>
            Cancellation deadlines and refund eligibility are determined by the
            accommodation provider, not by {COMPANY.brand}.
          </li>
        </ul>
        <p className="mt-2 font-medium text-text-primary text-sm">
          Refund Process
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            Refunds for eligible cancellations are processed by{" "}
            <strong>LiteAPI</strong> (the merchant of record) in coordination
            with the accommodation provider and returned to your original
            payment method.
          </li>
          <li>
            Refunds may take 5–10 business days to appear on your statement,
            depending on your bank.
          </li>
          <li>
            If a pre-authorisation hold was placed on your card but the booking
            was not finalised, the hold will be automatically released within
            1–2 business days by your card issuer.
          </li>
        </ul>
        <p className="mt-2">
          Please review the cancellation policy carefully before confirming
          your booking. If you need assistance, you can contact us at{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-accent underline">
            {COMPANY.email}
          </a>{" "}
          and we will direct your request to the appropriate party, but the
          final decision on cancellations and refunds rests with the
          accommodation provider.
        </p>
      </Section>

      <Section icon={Users} title="6. User Accounts">
        <p>
          You may create an account to manage bookings and save preferences. You
          are responsible for maintaining the confidentiality of your account
          credentials and for all activity under your account. Notify us
          immediately if you suspect unauthorised access.
        </p>
      </Section>

      <Section icon={BanIcon} title="7. Prohibited Conduct">
        <p>You must not:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Use our services for any unlawful purpose.</li>
          <li>
            Attempt to gain unauthorised access to our systems or other
            users&apos; accounts.
          </li>
          <li>
            Scrape, data-mine, or otherwise extract data from our platform
            without permission.
          </li>
          <li>
            Submit false or misleading booking information or use stolen
            payment credentials.
          </li>
          <li>
            Interfere with the proper functioning of our website.
          </li>
        </ul>
      </Section>

      <Section icon={Shield} title="8. Intellectual Property">
        <p>
          All content on {COMPANY.brand}, including text, graphics, logos, and
          software, is the property of {COMPANY.legal} or its licensors and is
          protected by intellectual property laws. You may not reproduce,
          distribute, or create derivative works without our prior written
          consent.
        </p>
      </Section>

      <Section icon={AlertCircle} title="9. Limitation of Liability">
        <p>
          To the fullest extent permitted by law:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            {COMPANY.brand} acts as an intermediary and is <strong>not
            liable</strong> for the quality, safety, legality, or suitability
            of accommodation provided by third-party hotels.
          </li>
          <li>
            {COMPANY.brand} is <strong>not liable</strong> for any payment
            disputes, chargebacks, failed transactions, or refund delays, as
            all financial transactions are processed by LiteAPI and Stripe.
            Payment disputes should be directed to LiteAPI or your card issuer.
          </li>
          <li>
            We are not liable for any indirect, incidental, special, or
            consequential damages arising from your use of our services or
            inability to use them.
          </li>
          <li>
            Our total aggregate liability to you for any claims arising from
            or related to these Terms shall not exceed the fees (if any) paid
            by you directly to {COMPANY.legal} (excluding accommodation costs
            paid to LiteAPI/hotels).
          </li>
          <li>
            Nothing in these Terms excludes or limits liability for fraud,
            death, or personal injury caused by negligence, or any other
            liability that cannot be excluded under the laws of{" "}
            {COMPANY.jurisdiction}.
          </li>
        </ul>
      </Section>

      <Section icon={Globe} title="10. Third-Party Services">
        <p>
          Our platform integrates with the following third-party services, each
          governed by their own terms and privacy policies:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>LiteAPI:</strong> booking platform and merchant of record
            for all reservations and payment transactions.
          </li>
          <li>
            <strong>Stripe:</strong> payment processing on behalf of LiteAPI.
          </li>
          <li>
            <strong>Mapbox:</strong> interactive mapping services for hotel
            locations.
          </li>
        </ul>
        <p>
          {COMPANY.legal} is not responsible for the practices, terms, or
          availability of these third-party services. We recommend reviewing
          their respective terms and privacy policies.
        </p>
      </Section>

      <Section icon={FileText} title="11. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of {COMPANY.jurisdiction}. Any disputes shall be subject to the
          exclusive jurisdiction of the courts of {COMPANY.jurisdiction}.
        </p>
      </Section>

      <Section icon={Clock} title="12. Changes to Terms">
        <p>
          We reserve the right to modify these Terms at any time. Material
          changes will be notified via our website. Continued use of our
          services after changes constitutes acceptance of the updated Terms.
        </p>
      </Section>

      <Section icon={Mail} title="13. Contact">
        <p>For questions about these Terms, please contact:</p>
        <div className="bg-bg-cream rounded-lg p-4 space-y-1">
          <p className="font-semibold text-text-primary">{COMPANY.legal}</p>
          <p>{COMPANY.address}</p>
          <p>
            Email:{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-accent underline"
            >
              {COMPANY.email}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}

/* ═══════════════════════════════════════
   HELP CENTER
   ═══════════════════════════════════════ */
function HelpCenterContent() {
  return (
    <>
      <p>
        Welcome to the {COMPANY.brand} Help Center. Find answers to common
        questions below, or contact our support team for further assistance.
      </p>

      {/* Contact card */}
      <div className="bg-accent/5 border border-accent/15 rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-text-primary flex items-center gap-2">
          <MessageCircle size={16} className="text-accent" />
          Contact Support
        </h3>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <Mail size={14} className="text-accent" />
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-accent underline"
            >
              {COMPANY.email}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={14} className="text-accent" />
            {COMPANY.address}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={14} className="text-accent" />
            Support hours: Monday – Friday, 9:00 AM – 6:00 PM (GMT)
          </p>
        </div>
      </div>

      <Section icon={BookOpen} title="Booking & Reservations">
        <div className="space-y-3">
          <div>
            <p className="font-medium text-text-primary">
              How do I make a booking?
            </p>
            <p>
              Search for your destination, select your dates and number of
              guests, choose a hotel and room type, then complete the checkout
              process with your guest details and payment information.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              How will I receive my booking confirmation?
            </p>
            <p>
              After successful payment, you&apos;ll see a confirmation page with your
              booking reference number. A confirmation email will also be sent to
              the email address provided during checkout.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              Can I book for someone else?
            </p>
            <p>
              Yes. Enter the guest&apos;s name and details during checkout. The booking
              confirmation will be sent to the email address you provide.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              Can I modify my booking after confirmation?
            </p>
            <p>
              Modifications are subject to the accommodation provider&apos;s policy
              and are handled by the hotel and LiteAPI. You can email us at{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-accent underline"
              >
                {COMPANY.email}
              </a>{" "}
              with your booking reference and we&apos;ll forward your request, but
              the final decision rests with the hotel.
            </p>
          </div>
        </div>
      </Section>

      <Section icon={RefreshCw} title="Cancellations & Refunds">
        <div className="bg-accent/5 border border-accent/15 rounded-lg p-3 mb-3">
          <p className="text-xs">
            <strong>Please note:</strong> {COMPANY.brand} does not process
            cancellations or refunds. These are handled entirely by the
            accommodation provider and LiteAPI (our booking platform).
          </p>
        </div>
        <div className="space-y-3">
          <div>
            <p className="font-medium text-text-primary">
              How do I cancel a booking?
            </p>
            <p>
              Cancellations are governed by the hotel&apos;s cancellation policy,
              which is displayed during the booking process. To request a
              cancellation, you can email us at{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-accent underline"
              >
                {COMPANY.email}
              </a>{" "}
              with your booking reference and we will direct your request to
              LiteAPI and the accommodation provider. However, the final
              decision rests with the hotel.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              Who processes my refund?
            </p>
            <p>
              Refunds are processed by LiteAPI (the merchant of record) in
              coordination with the accommodation provider — not by{" "}
              {COMPANY.brand}. Eligible refunds are returned to your original
              payment method and typically take 5–10 business days to appear on
              your statement.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              What if I booked a non-refundable rate?
            </p>
            <p>
              Non-refundable rates cannot be cancelled for a refund as per the
              hotel&apos;s policy. In exceptional circumstances (e.g., natural
              disaster, medical emergency), contact us and we can forward your
              request to the hotel, but we cannot guarantee any outcome.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              My card was charged but the booking wasn&apos;t confirmed. What happens?
            </p>
            <p>
              If a pre-authorisation hold was placed during the booking process
              but the booking was not finalised, the hold will be automatically
              released within 1–2 business days by your card issuer. If the
              charge persists, contact your card issuer or email us for
              assistance.
            </p>
          </div>
        </div>
      </Section>

      <Section icon={CreditCard} title="Payment & Pricing">
        <div className="space-y-3">
          <div>
            <p className="font-medium text-text-primary">
              Who processes my payment?
            </p>
            <p>
              {COMPANY.brand} does not collect or process payments.
              All payments are handled directly by our booking platform (LiteAPI)
              through Stripe, a PCI DSS Level 1 certified payment processor.
              LiteAPI is the merchant of record for your transaction.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              What payment methods do you accept?
            </p>
            <p>
              All major credit and debit cards are accepted (Visa, Mastercard,
              American Express), subject to Stripe&apos;s supported payment methods.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              Is my payment information secure?
            </p>
            <p>
              Yes. Your card details are entered directly into Stripe&apos;s secure
              embedded payment form and are never sent to or stored on{" "}
              {COMPANY.brand} servers. We have no access to your full card
              number, CVV, or other sensitive payment credentials.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              What will the charge appear as on my bank statement?
            </p>
            <p>
              The charge will appear under LiteAPI&apos;s merchant name (or a
              related payment descriptor), not under {COMPANY.brand} or{" "}
              {COMPANY.legal}.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              Can I pay in my local currency?
            </p>
            <p>
              We support multiple currencies. Use the currency selector to view
              prices in your preferred currency. The final charge may vary
              slightly due to exchange rates applied by your bank.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              Are there any hidden fees?
            </p>
            <p>
              No. The total price shown at checkout, including taxes and fees, is
              the amount you&apos;ll be charged. Some properties may charge additional
              fees locally (e.g., resort fees, city tax), which will be noted
              during booking.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              I have a payment dispute. Who should I contact?
            </p>
            <p>
              Contact us at{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-accent underline"
              >
                {COMPANY.email}
              </a>{" "}
              and we&apos;ll liaise with LiteAPI on your behalf. You may also
              contact your card issuer directly for chargeback enquiries.
            </p>
          </div>
        </div>
      </Section>

      <Section icon={Users} title="Account & Preferences">
        <div className="space-y-3">
          <div>
            <p className="font-medium text-text-primary">
              Do I need an account to book?
            </p>
            <p>
              No, you can book as a guest. However, creating an account allows
              you to view booking history, save favourite hotels, and speed up
              future bookings.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              How do I reset my password?
            </p>
            <p>
              Click &quot;Forgot password?&quot; on the sign-in page and enter your email.
              You&apos;ll receive a password reset link.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              How do I delete my account?
            </p>
            <p>
              Contact us at{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-accent underline"
              >
                {COMPANY.email}
              </a>{" "}
              to request account deletion. We&apos;ll process your request within 30
              days in accordance with UK GDPR.
            </p>
          </div>
        </div>
      </Section>

      <Section icon={AlertCircle} title="Issues During Your Stay">
        <div className="space-y-3">
          <div>
            <p className="font-medium text-text-primary">
              What if the hotel is not as described?
            </p>
            <p>
              Please contact us immediately at{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-accent underline"
              >
                {COMPANY.email}
              </a>{" "}
              with your booking reference and details of the issue. We&apos;ll work
              with the property to resolve it.
            </p>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              What if the hotel can&apos;t find my reservation?
            </p>
            <p>
              Show the hotel your booking confirmation email. If the issue
              persists, contact our support team and we&apos;ll verify the booking
              directly with the property.
            </p>
          </div>
        </div>
      </Section>

      <div className="bg-bg-cream rounded-lg p-4 text-center">
        <p className="text-sm text-text-primary font-medium mb-1">
          Still need help?
        </p>
        <p className="text-sm text-text-secondary">
          Email us at{" "}
          <a
            href={`mailto:${COMPANY.email}`}
            className="text-accent underline font-medium"
          >
            {COMPANY.email}
          </a>{" "}
          and we&apos;ll get back to you within 24 hours.
        </p>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   COOKIE POLICY
   ═══════════════════════════════════════ */
function CookiePolicyContent() {
  return (
    <>
      <p className="text-text-muted text-xs">Last updated: February 2026</p>
      <p>
        This Cookie Policy explains how {COMPANY.legal}, trading as{" "}
        {COMPANY.brand} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), uses cookies and similar
        technologies on our website. This policy should be read alongside our
        Privacy Policy.
      </p>

      <Section icon={Cookie} title="1. What Are Cookies?">
        <p>
          Cookies are small text files placed on your device when you visit a
          website. They help the website recognise your device and remember
          information about your visit, such as your preferred language, currency,
          and other settings.
        </p>
      </Section>

      <Section icon={FileText} title="2. Types of Cookies We Use">
        <div className="space-y-3">
          <div className="bg-bg-cream rounded-lg p-3">
            <p className="font-medium text-text-primary mb-1">
              Strictly Necessary Cookies
            </p>
            <p>
              Essential for the website to function properly. These enable core
              features like page navigation, secure areas, and booking
              processes. They cannot be disabled.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 text-xs text-text-muted">
              <li>Session management and authentication</li>
              <li>Security tokens and CSRF protection</li>
              <li>Load balancing</li>
            </ul>
          </div>

          <div className="bg-bg-cream rounded-lg p-3">
            <p className="font-medium text-text-primary mb-1">
              Functional Cookies
            </p>
            <p>
              Allow us to remember your preferences and provide enhanced,
              personalised features.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 text-xs text-text-muted">
              <li>Language and currency preferences</li>
              <li>Search history and recently viewed hotels</li>
              <li>Display preferences (list/map view)</li>
              <li>Saved favourites</li>
            </ul>
          </div>

          <div className="bg-bg-cream rounded-lg p-3">
            <p className="font-medium text-text-primary mb-1">
              Analytics Cookies
            </p>
            <p>
              Help us understand how visitors interact with our website by
              collecting and reporting information anonymously.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 text-xs text-text-muted">
              <li>Pages visited and time spent</li>
              <li>Search queries and click patterns</li>
              <li>Error tracking and performance monitoring</li>
            </ul>
          </div>

          <div className="bg-bg-cream rounded-lg p-3">
            <p className="font-medium text-text-primary mb-1">
              Marketing Cookies
            </p>
            <p>
              Used to track visitors across websites to display relevant
              advertisements. We currently do not use third-party advertising
              cookies but reserve the right to introduce them in the future with
              your consent.
            </p>
          </div>
        </div>
      </Section>

      <Section icon={Lock} title="3. Local Storage">
        <p>
          In addition to cookies, we use browser local storage to persist certain
          preferences across sessions:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Currency and language preferences</li>
          <li>Search parameters (destination, dates, guests)</li>
          <li>Cookie consent preferences</li>
          <li>Shopping/booking session data</li>
        </ul>
        <p>
          Local storage data remains on your device until you clear your browser
          data or it is programmatically removed.
        </p>
      </Section>

      <Section icon={Shield} title="4. Third-Party Cookies">
        <p>Some cookies are placed by third-party services we use:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>Stripe:</strong> payment processing security and fraud
            prevention.
          </li>
          <li>
            <strong>Mapbox:</strong> interactive map functionality for hotel
            locations.
          </li>
        </ul>
        <p>
          These third parties have their own privacy and cookie policies. We
          encourage you to review them.
        </p>
      </Section>

      <Section icon={Users} title="5. Managing Your Cookie Preferences">
        <p>
          When you first visit our website, a cookie consent banner allows you to
          accept or reject non-essential cookies. You can change your preferences
          at any time by:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            Clicking the &quot;Cookie Settings&quot; link in our website footer.
          </li>
          <li>
            Adjusting cookie settings in your browser (note: disabling cookies
            may affect website functionality).
          </li>
          <li>
            Clearing your browser&apos;s cookies and local storage data.
          </li>
        </ul>
      </Section>

      <Section icon={Globe} title="6. Browser-Level Controls">
        <p>
          Most browsers allow you to control cookies through their settings.
          Common options include:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Blocking all or third-party cookies.</li>
          <li>Deleting cookies when you close the browser.</li>
          <li>Receiving notifications when a cookie is set.</li>
        </ul>
        <p className="text-xs text-text-muted">
          Please note that blocking essential cookies may prevent certain
          features of our website from functioning correctly.
        </p>
      </Section>

      <Section icon={Clock} title="7. Cookie Retention">
        <p>
          Cookie lifetimes vary depending on their purpose:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            <strong>Session cookies:</strong> deleted when you close your
            browser.
          </li>
          <li>
            <strong>Persistent cookies:</strong> remain for a set period (e.g.,
            preferences: 1 year; analytics: 26 months).
          </li>
          <li>
            <strong>Consent cookie:</strong> stored for 12 months to remember
            your preference.
          </li>
        </ul>
      </Section>

      <Section icon={AlertCircle} title="8. Changes to This Policy">
        <p>
          We may update this Cookie Policy from time to time to reflect changes
          in technology, legislation, or our business practices. Any changes will
          be posted on this page with an updated revision date.
        </p>
      </Section>

      <Section icon={Mail} title="9. Contact Us">
        <p>
          If you have questions about our use of cookies, please contact:
        </p>
        <div className="bg-bg-cream rounded-lg p-4 space-y-1">
          <p className="font-semibold text-text-primary">{COMPANY.legal}</p>
          <p>{COMPANY.address}</p>
          <p>
            Email:{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-accent underline"
            >
              {COMPANY.email}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}

/* ═══════════════════════════════════════
   ORCHESTRATOR — renders active modal
   ═══════════════════════════════════════ */
export default function LegalModals() {
  const { activeModal, closeModal } = useLegalModalStore();

  return (
    <>
      <LegalModal
        isOpen={activeModal === "privacy"}
        onClose={closeModal}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </LegalModal>

      <LegalModal
        isOpen={activeModal === "terms"}
        onClose={closeModal}
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </LegalModal>

      <LegalModal
        isOpen={activeModal === "help"}
        onClose={closeModal}
        title="Help Center"
      >
        <HelpCenterContent />
      </LegalModal>

      <LegalModal
        isOpen={activeModal === "cookies"}
        onClose={closeModal}
        title="Cookie Policy"
      >
        <CookiePolicyContent />
      </LegalModal>
    </>
  );
}
