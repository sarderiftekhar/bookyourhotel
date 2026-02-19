"use client";

import { RotateCcw } from "lucide-react";
import type { ChatMessage as ChatMsg } from "@/store/chatStore";
import HotelChatCard from "./HotelChatCard";

interface Props {
  message: ChatMsg;
  onOptionClick?: (text: string) => void;
  onRetry?: () => void;
}

export default function ChatMessage({ message, onOptionClick, onRetry }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] space-y-2`}>
        {/* Text bubble */}
        {message.content && (
          <div
            className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
              isUser
                ? "bg-accent text-white rounded-2xl rounded-br-md"
                : "bg-bg-cream text-text-primary rounded-2xl rounded-bl-md"
            }`}
          >
            {message.content}
          </div>
        )}

        {/* Retry button on error */}
        {!isUser && message.isError && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 transition-colors mt-1"
          >
            <RotateCcw size={12} />
            Tap to retry
          </button>
        )}

        {/* Quick-reply option buttons */}
        {!isUser && message.options && message.options.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.options.map((opt) => (
              <button
                key={opt}
                onClick={() => onOptionClick?.(opt)}
                className="text-xs px-3 py-1.5 rounded-full border border-accent/30 text-accent hover:bg-accent hover:text-white hover:border-accent transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Hotel cards */}
        {message.hotels && message.hotels.length > 0 && (
          <div className="space-y-2">
            {message.hotels.map((hotel) => (
              <HotelChatCard key={hotel.hotelId} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
