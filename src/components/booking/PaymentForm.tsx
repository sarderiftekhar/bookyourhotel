"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface PaymentFormProps {
  clientSecret: string;
  onPaymentSuccess: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function PaymentForm({
  clientSecret,
  onPaymentSuccess,
  loading,
  setLoading,
}: PaymentFormProps) {
  const t = useTranslations("booking");
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onPaymentSuccess();
    } else {
      setError(`Payment status: ${paymentIntent?.status}. Please try again.`);
      setLoading(false);
    }
  }

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

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-error/20 rounded-lg text-sm text-error">
          {error}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        loading={loading}
        disabled={!stripe || loading}
        size="lg"
        className="w-full mt-6"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            {t("processing")}
          </span>
        ) : (
          t("confirmAndPay")
        )}
      </Button>
    </div>
  );
}
