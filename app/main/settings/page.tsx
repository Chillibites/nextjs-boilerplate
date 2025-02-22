import { redirect } from "next/navigation";
import getSession from "@/app/lib/getSession";


export default async function Settings() {
  const session = await getSession();
  const user = session?.user;
  if (!user) {
    redirect("/api/auth/signin?callbackUrl=/main/settings");
  }
  return (
    <div>
      <h1>Settings Page</h1>
    </div>
  );
}