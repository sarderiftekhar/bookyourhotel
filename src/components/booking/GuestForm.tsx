"use client";

import { useTranslations } from "next-intl";
import { Info, AlertTriangle } from "lucide-react";
import Input from "@/components/ui/Input";
import { GuestInfo } from "@/types/booking";

const COUNTRY_CODES = [
  { code: "+44", label: "UK (+44)" },
  { code: "+1", label: "US (+1)" },
  { code: "+33", label: "FR (+33)" },
  { code: "+49", label: "DE (+49)" },
  { code: "+971", label: "AE (+971)" },
  { code: "+34", label: "ES (+34)" },
  { code: "+39", label: "IT (+39)" },
  { code: "+81", label: "JP (+81)" },
  { code: "+86", label: "CN (+86)" },
  { code: "+91", label: "IN (+91)" },
  { code: "+61", label: "AU (+61)" },
  { code: "+55", label: "BR (+55)" },
  { code: "+52", label: "MX (+52)" },
  { code: "+7", label: "RU (+7)" },
  { code: "+82", label: "KR (+82)" },
  { code: "+31", label: "NL (+31)" },
  { code: "+46", label: "SE (+46)" },
  { code: "+41", label: "CH (+41)" },
  { code: "+90", label: "TR (+90)" },
  { code: "+966", label: "SA (+966)" },
  { code: "+20", label: "EG (+20)" },
  { code: "+234", label: "NG (+234)" },
  { code: "+27", label: "ZA (+27)" },
  { code: "+65", label: "SG (+65)" },
  { code: "+60", label: "MY (+60)" },
  { code: "+66", label: "TH (+66)" },
  { code: "+62", label: "ID (+62)" },
  { code: "+63", label: "PH (+63)" },
  { code: "+48", label: "PL (+48)" },
  { code: "+351", label: "PT (+351)" },
];

interface GuestFormProps {
  guestInfo: GuestInfo;
  onChange: (info: GuestInfo) => void;
  errors?: Partial<Record<keyof GuestInfo, string>>;
  isNonRefundable?: boolean;
}

export default function GuestForm({ guestInfo, onChange, errors, isNonRefundable }: GuestFormProps) {
  const t = useTranslations("booking");

  function update(field: keyof GuestInfo, value: string) {
    onChange({ ...guestInfo, [field]: value });
  }

  // Extract country code and local number from phone
  const phoneMatch = guestInfo.phone.match(/^(\+\d{1,4})\s*(.*)/);
  const selectedCode = phoneMatch ? phoneMatch[1] : "+44";
  const localPhone = phoneMatch ? phoneMatch[2] : guestInfo.phone;

  function handleCodeChange(code: string) {
    onChange({ ...guestInfo, phone: `${code} ${localPhone}` });
  }

  function handleLocalPhoneChange(value: string) {
    onChange({ ...guestInfo, phone: `${selectedCode} ${value}` });
  }

  return (
    <div className="space-y-6">
      {/* Non-refundable warning */}
      {isNonRefundable && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-warning">Non-Refundable Booking</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              This rate is non-refundable. You will not receive a refund if you cancel or modify this booking.
              Please make sure all details are correct before proceeding.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border p-6">
        <h2
          className="text-xl font-bold text-text-primary mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("guestDetails")}
        </h2>

        {/* Guest name = ID notice */}
        <div className="flex items-start gap-2 mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            The guest name must match the ID or passport presented at check-in.
            Please ensure the name is spelled correctly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="firstName"
            label={t("firstName")}
            value={guestInfo.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            error={errors?.firstName}
            placeholder="As shown on ID"
            required
          />
          <Input
            id="lastName"
            label={t("lastName")}
            value={guestInfo.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            error={errors?.lastName}
            placeholder="As shown on ID"
            required
          />
          <Input
            id="email"
            label={t("email")}
            type="email"
            value={guestInfo.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors?.email}
            required
          />

          {/* Phone with country code */}
          <div className="w-full">
            <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1.5">
              {t("phone")}
            </label>
            <div className="flex gap-2">
              <select
                value={selectedCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-28 shrink-0 px-2 py-2.5 text-sm border border-border rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors duration-200"
              >
                {COUNTRY_CODES.map((cc) => (
                  <option key={cc.code} value={cc.code}>
                    {cc.label}
                  </option>
                ))}
              </select>
              <input
                id="phone"
                type="tel"
                value={localPhone}
                onChange={(e) => handleLocalPhoneChange(e.target.value)}
                placeholder="Phone number"
                className={`flex-1 px-4 py-2.5 text-sm border border-border rounded-lg bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors duration-200 ${errors?.phone ? "border-error focus:ring-error/30 focus:border-error" : ""}`}
              />
            </div>
            {errors?.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="specialRequests" className="block text-sm font-medium text-text-primary mb-1.5">
              {t("specialRequests")}
            </label>
            <textarea
              id="specialRequests"
              value={guestInfo.specialRequests || ""}
              onChange={(e) => update("specialRequests", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
              placeholder="Any special requests or requirements..."
            />
          </div>
        </div>

        {/* Email confirmation notice */}
        {guestInfo.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email) && (
          <div className="flex items-start gap-2 mt-4 p-3 bg-accent/5 border border-accent/10 rounded-lg">
            <Info size={14} className="text-accent shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary leading-relaxed">
              A booking confirmation will be sent to <strong>{guestInfo.email}</strong>.
              Please ensure this email address is correct.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
