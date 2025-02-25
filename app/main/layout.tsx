import type { Metadata } from "next";
import { Sidebar, SidebarBody, SidebarTitle } from "@/components/sidebar/sidebar";
import { ProfileSidebarLink } from "@/components/sidebar/profile-sidebar-link";
import SidebarSwitch from "@/components/sidebar/sidebar-switch";
import SidebarNavigation from "@/components/sidebar/SidebarNavigation";
import { Separator } from "@/components/ui/separator";
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <SidebarTitle />
            <div className="mt-8 flex flex-col gap-2">
              <SidebarNavigation />
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-4">
            <SidebarSwitch />
            <Separator />
            <ProfileSidebarLink />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-y-auto pt-2 md:pt-0">{children}</main>
    </div>
  );
}
