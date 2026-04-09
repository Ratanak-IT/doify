"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { loadLanguageFromStorage } from "@/lib/features/i18n/i18nSlice";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef(store);

  useEffect(() => {
    storeRef.current.dispatch(loadLanguageFromStorage());
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
