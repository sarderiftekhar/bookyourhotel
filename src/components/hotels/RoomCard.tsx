"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Users, Coffee, ShieldCheck, ShieldX } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

interface RoomCardProps {
  room: {
    offerId: string;
    roomName: string;
    boardName: string;
    currency: string;
    retailRate: number;
    maxOccupancy?: number;
    images?: string[];
    cancellationPolicy?: {
      refundableTag?: string;
    };
  };
  onSelect: (offerId: string) => void;
}

export default function RoomCard({ room, onSelect }: RoomCardProps) {
  const t = useTranslations("hotel");
  const isRefundable = room.cancellationPolicy?.refundableTag === "FREE_CANCELLATION" ||
    room.cancellationPolicy?.refundableTag === "REFUNDABLE";

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Room Image */}
        <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0">
          {room.images && room.images[0] ? (
            <Image
              src={room.images[0]}
              alt={room.roomName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 192px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/10 to-bg-cream flex items-center justify-center">
              <span className="text-text-muted text-xs">No image</span>
            </div>
          )}
        </div>

        {/* Room Details */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h4
              className="text-base font-bold text-text-primary mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {room.roomName}
            </h4>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {room.maxOccupancy && (
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Users size={14} />
                  {t("maxGuests", { count: room.maxOccupancy })}
                </div>
              )}
              <Badge>
                <Coffee size={12} className="mr-1" />
                {room.boardName || "Room Only"}
              </Badge>
              {isRefundable ? (
                <Badge variant="success">
                  <ShieldCheck size={12} className="mr-1" />
                  {t("freeCancellation")}
                </Badge>
              ) : (
                <Badge variant="warning">
                  <ShieldX size={12} className="mr-1" />
                  {t("nonRefundable")}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between pt-3 border-t border-border/50">
            <div>
              <span className="text-2xl font-bold text-accent">
                {formatCurrency(room.retailRate, room.currency)}
              </span>
              <span className="text-xs text-text-muted ml-1">{t("perNight")}</span>
            </div>
            <Button onClick={() => onSelect(room.offerId)} size="sm">
              {t("selectRoom")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
