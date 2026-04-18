"use client";

import * as React from "react";
import { useAppSelector } from "@/lib/hooks";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";

import {
  TerminalSquareIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar";

const data = {
  navMain: [
    {
      title: "ISTAD Shop",
      url: "/dashboard",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Product List", url: "/dashboard/product" },
        { title: "Settings", url: "#" },
      ],
    },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: <FrameIcon /> },
    { name: "Sales & Marketing", url: "#", icon: <PieChartIcon /> },
    { name: "Travel", url: "#", icon: <MapIcon /> },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userState = useAppSelector((state) => state.auth.user);

  const user = userState
    ? {
        name: userState.name,
        email: userState.email,
        avatar: userState.avatar || "/avatars/default.jpg",
      }
    : { name: "Guest", email: "", avatar: "" };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
