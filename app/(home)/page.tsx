import { SignInDialog } from "@/components/homeLayout/sign-in";
import { useState } from "react";
import { useEffect } from "react";

export default function Home() {
  //make a loading state
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Home Page</h1>
      <SignInDialog />
    </div>
  );
}
