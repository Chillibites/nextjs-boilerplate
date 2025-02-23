import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background dark:bg-background text-muted-foreground px-4">
      <Loader2 className="animate-spin" size={32} />
      <h2 className="text-xl">Loading...</h2>
    </div>
  );
} 