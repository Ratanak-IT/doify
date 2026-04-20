import { AuthRehydrator } from "@/components/AuthRehydrator";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { NotificationStreamProvider } from "@/components/NotificationStreamProvider";
import DashboardFooter from "@/components/layout/DashboardFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden">
        <AuthRehydrator />
        <NotificationStreamProvider />
        <div className="flex-1 overflow-auto">{children}</div>
        <DashboardFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}