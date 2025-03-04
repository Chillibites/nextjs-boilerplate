import getSession from "@/lib/getSession"
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Categories } from "./_components/categories";
import { SearchInput } from "./_components/search-input"


export default async function SearchPage() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }
 
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return <div>
    <div className="p-6 space-y-4">
      <SearchInput />
      <Categories
        items={categories.map((category) => ({
          Category: category,
        }))}
      />
    </div>
  </div>;
}
