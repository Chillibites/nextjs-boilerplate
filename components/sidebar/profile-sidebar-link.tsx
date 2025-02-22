import Image from "next/image";
import { SidebarLink } from "./sidebar";
import { auth } from "@/auth";

export async function ProfileSidebarLink() {
  const session = await auth()
 
  if (!session || !session.user) {
    return <div>Not authenticated</div>
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