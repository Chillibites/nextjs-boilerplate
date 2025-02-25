import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
export default function TeacherCoursesPage() {
  return (
    <div className="p-6">
      <Link href="/main/teacher/create">
        <Button>
          New Course
          <Plus className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
