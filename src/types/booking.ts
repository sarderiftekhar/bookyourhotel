export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface PrebookRequest {
  offerId: string;
  usePaymentSdk: boolean;
}

export interface PrebookResponse {
  prebookId: string;
  offerId: string;
  hotelName: string;
  roomName: string;
  boardName: string;
  checkIn: string;
  checkOut: string;
  currency: string;
  totalRate: number;
  cancellationPolicy: {
    cancelPolicyInfos: {
      cancelTime: string;
      amount: number;
      currency: string;
      type: string;
    }[];
    refundableTag: string;
  };
  clientSecret?: string;
}

export interface BookRequest {
  prebookId: string;
  guestInfo: GuestInfo;
  paymentIntentId?: string;
}

export interface BookingConfirmation {
  bookingId: string;
  status: string;
  hotelName: string;
  roomName: string;
  boardName: string;
  checkIn: string;
  checkOut: string;
  guestInfo: GuestInfo;
  currency: string;
  totalRate: number;
  hotelConfirmationCode?: string;
  supplierBookingId?: string;
}

export interface BookingDetails {
  bookingId: string;
  status: string;
  hotelName: string;
  hotelId: string;
  roomName: string;
  boardName: string;
  checkIn: string;
  checkOut: string;
  guestInfo: GuestInfo;
  currency: string;
  totalRate: number;
  createdAt: string;
  hotelConfirmationCode?: string;
  cancellation?: {
    status: string;
    refundAmount: number;
    currency: string;
  };
}
