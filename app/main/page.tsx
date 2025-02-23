import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";

export default async function Main() {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/main");
  }
  return (
    <div>
      <h1>Main Page</h1>
    </div>
  );
}