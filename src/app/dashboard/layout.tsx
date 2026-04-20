import { AuthRehydrator } from "@/components/AuthRehydrator";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { NotificationStreamProvider } from "@/components/NotificationStreamProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AuthRehydrator />
        <NotificationStreamProvider />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}