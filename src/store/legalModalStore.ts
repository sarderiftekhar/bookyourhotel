import { create } from "zustand";

type LegalModalType = "privacy" | "terms" | "help" | "cookies" | null;

interface LegalModalState {
  activeModal: LegalModalType;
  openModal: (modal: LegalModalType) => void;
  closeModal: () => void;
}

export const useLegalModalStore = create<LegalModalState>((set) => ({
  activeModal: null,
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
}));
