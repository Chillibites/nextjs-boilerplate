import { auth } from "@/auth"
import { redirect } from "next/navigation"
export default async function Page() {
  const session = await auth()
 
  if (!session) {
    redirect("/")
  }
 
  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}