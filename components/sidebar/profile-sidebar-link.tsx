import Image from "next/image";
import { SidebarLink } from "./sidebar";
import { redirect } from "next/navigation";
import getSession from "@/app/lib/getSession";

export async function ProfileSidebarLink() {
  const session = await getSession()
  if (!session || !session.user) {
    redirect("/");
  }

  const link = {
    label: session.user.name || "Profile",
    href: "/main", // change to the route for your user profile page
    icon: (
      <Image
        src={session.user.image || "/default-avatar.svg"}
        alt="User Avatar"
        width={50}
        height={50}
        className="h-7 w-7 flex-shrink-0 rounded-full"
      />
    ),
  };

  return <SidebarLink link={link} />;
}