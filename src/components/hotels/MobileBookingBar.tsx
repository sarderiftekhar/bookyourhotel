"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";

interface MobileBookingBarProps {
  lowestPrice: number;
  currency: string;
  onSelectRoom: () => void;
}

export default function MobileBookingBar({
  lowestPrice,
  currency,
  onSelectRoom,
}: MobileBookingBarProps) {
  const t = useTranslations("hotel");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white border-t border-border shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 safe-area-bottom">
        <div>
          <p className="text-xs text-text-muted">{t("from")}</p>
          <p className="text-lg font-bold text-text-primary">
            {formatCurrency(lowestPrice, currency)}
            <span className="text-xs font-normal text-text-muted">{t("perNight")}</span>
          </p>
        </div>
        <button
          onClick={onSelectRoom}
          className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
        >
          {t("selectRoom")}
        </button>
      </div>
    </div>
  );
}
