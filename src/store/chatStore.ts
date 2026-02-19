"use client";

import { create } from "zustand";

export interface ChatHotel {
  hotelId: string;
  name: string;
  starRating?: number;
  main_photo: string;
  minRate?: number;
  currency: string;
  reviewScore?: number;
  city: string;
  country: string;
  cancellationPolicy?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  hotels?: ChatHotel[];
  options?: string[];
  isError?: boolean;
}

interface ChatStore {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;

  toggle: () => void;
  open: () => void;
  close: () => void;
  addMessage: (msg: ChatMessage) => void;
  updateLastAssistant: (content: string, hotels?: ChatHotel[], options?: string[]) => void;
  removeLastAssistant: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>()((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,

  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateLastAssistant: (content, hotels, options) =>
    set((s) => {
      const msgs = [...s.messages];
      const lastIdx = msgs.length - 1;
      if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
        msgs[lastIdx] = { ...msgs[lastIdx], content, hotels, options };
      }
      return { messages: msgs };
    }),
  removeLastAssistant: () =>
    set((s) => {
      const msgs = [...s.messages];
      if (msgs.length > 0 && msgs[msgs.length - 1].role === "assistant") {
        msgs.pop();
      }
      return { messages: msgs };
    }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ messages: [], isLoading: false }),
}));
