"use client";

import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import { GuestInfo } from "@/types/booking";

interface GuestFormProps {
  guestInfo: GuestInfo;
  onChange: (info: GuestInfo) => void;
  errors?: Partial<Record<keyof GuestInfo, string>>;
}

export default function GuestForm({ guestInfo, onChange, errors }: GuestFormProps) {
  const t = useTranslations("booking");

  function update(field: keyof GuestInfo, value: string) {
    onChange({ ...guestInfo, [field]: value });
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2
        className="text-xl font-bold text-text-primary mb-6"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {t("guestDetails")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="firstName"
          label={t("firstName")}
          value={guestInfo.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          error={errors?.firstName}
          required
        />
        <Input
          id="lastName"
          label={t("lastName")}
          value={guestInfo.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          error={errors?.lastName}
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
        <Input
          id="phone"
          label={t("phone")}
          type="tel"
          value={guestInfo.phone}
          onChange={(e) => update("phone", e.target.value)}
          error={errors?.phone}
          required
        />
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
    </div>
  );
}
