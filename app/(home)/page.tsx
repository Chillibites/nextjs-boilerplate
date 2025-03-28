import { SignInDialog } from "@/components/homeLayout/sign-in";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Home Page</h1>
      <SignInDialog />
    </div>
  );
}