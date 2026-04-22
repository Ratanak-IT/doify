"use client";

import { ThemeProvider } from "@/lib/contexts/ThemeContext";

import NavbarWrapper from "@/components/layout/NavbarWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
import { usePathname } from "next/navigation";
import StoreProvider from "./StoreProvider";
import { poppins, sovaphum } from "./fonts";
import { Toaster } from "sonner";
import { NotificationStreamProvider } from "@/components/NotificationStreamProvider";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const hideFooterRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const showNavbar = !hideNavbarRoutes.includes(pathname);
  const showFooter =
    !hideFooterRoutes.includes(pathname) && !pathname.startsWith("/dashboard");

  return (
    <div
      className={`${poppins.variable} ${sovaphum.variable} font-sans min-h-full flex flex-col bg-white dark:bg-slate-950`}
    >
      <ThemeProvider>
        <StoreProvider>
           <NotificationStreamProvider /> 
          {showNavbar && <NavbarWrapper />}
          {children}
          {showFooter && <FooterWrapper />}
          <Toaster position="top-right" richColors closeButton />
        </StoreProvider>
      </ThemeProvider>
    </div>
  );
}
