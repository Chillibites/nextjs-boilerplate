import { redirect } from "next/navigation"
import getSession from "@/app/lib/getSession"


export default async function Page() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }
 
  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}