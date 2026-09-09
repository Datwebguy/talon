"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalView = "select" | "account";

interface WalletModalContextType {
  isOpen: boolean;
  view: ModalView;
  openSelectModal: () => void;
  openAccountModal: () => void;
  closeModal: () => void;
}

const WalletModalContext = createContext<WalletModalContextType | undefined>(undefined);

export function WalletModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ModalView>("select");

  const openSelectModal = () => {
    setView("select");
    setIsOpen(true);
  };

  const openAccountModal = () => {
    setView("account");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <WalletModalContext.Provider
      value={{
        isOpen,
        view,
        openSelectModal,
        openAccountModal,
        closeModal,
      }}
    >
      {children}
    </WalletModalContext.Provider>
  );
}

export function useWalletModal() {
  const context = useContext(WalletModalContext);
  if (!context) {
    throw new Error("useWalletModal must be used within a WalletModalProvider");
  }
  return context;
}
