"use client";

import { useTranslations } from "next-intl";
import { CardElement } from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";

export default function PaymentForm() {
  const t = useTranslations("booking");

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2
        className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        <CreditCard size={20} className="text-accent" />
        {t("paymentDetails")}
      </h2>

      <div className="border border-border rounded-lg p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#111111",
                "::placeholder": {
                  color: "#888888",
                },
              },
              invalid: {
                color: "#dc2626",
              },
            },
          }}
        />
      </div>

      <p className="mt-3 text-xs text-text-muted flex items-center gap-1">
        <CreditCard size={12} />
        Your payment information is encrypted and secure
      </p>
    </div>
  );
}
