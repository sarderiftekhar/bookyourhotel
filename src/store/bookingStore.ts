"use client";

import { create } from "zustand";

interface BookingState {
  offerId: string | null;
  hotelId: string | null;
  hotelName: string;
  roomName: string;
  boardName: string;
  checkIn: string;
  checkOut: string;
  currency: string;
  totalRate: number;
  prebookId: string | null;
  clientSecret: string | null;
  cancellationPolicy: string;
  maxOccupancy: number;
  roomImage: string;

  setSelectedRoom: (room: {
    offerId: string;
    hotelId: string;
    hotelName: string;
    roomName: string;
    boardName: string;
    checkIn: string;
    checkOut: string;
    currency: string;
    totalRate: number;
    cancellationPolicy: string;
    maxOccupancy: number;
    roomImage: string;
  }) => void;
  setPrebook: (prebookId: string, clientSecret?: string) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>()((set) => ({
  offerId: null,
  hotelId: null,
  hotelName: "",
  roomName: "",
  boardName: "",
  checkIn: "",
  checkOut: "",
  currency: "USD",
  totalRate: 0,
  prebookId: null,
  clientSecret: null,
  cancellationPolicy: "",
  maxOccupancy: 2,
  roomImage: "",

  setSelectedRoom: (room) =>
    set({
      ...room,
      prebookId: null,
      clientSecret: null,
    }),
  setPrebook: (prebookId, clientSecret) =>
    set({ prebookId, clientSecret }),
  reset: () =>
    set({
      offerId: null,
      hotelId: null,
      hotelName: "",
      roomName: "",
      boardName: "",
      checkIn: "",
      checkOut: "",
      currency: "USD",
      totalRate: 0,
      prebookId: null,
      clientSecret: null,
      cancellationPolicy: "",
      maxOccupancy: 2,
      roomImage: "",
    }),
}));
