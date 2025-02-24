"use client";

import { useState, useEffect } from "react";
import { getProviders, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react";

// Add these interfaces at the top of the file, after the imports
interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export default function LoginPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [error, setError] = useState("");

  // Fetch all available providers
  useEffect(() => {
    async function fetchProviders() {
      const res = await getProviders();
      setProviders(res);
    }
    fetchProviders();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Calling the "credentials" provider with a callbackUrl of "/main"
    const res = await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/main",
    });

    if (res && res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 bg-[url('/auth-bg.png')] bg-cover bg-center">
      <div className="w-full max-w-md bg-card/80 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-border/50">
        <div className="flex flex-col items-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={80} 
            height={80}
            className="drop-shadow-lg" 
          />
          <h1 className="mt-4 text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to continue to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-sm text-destructive rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="hi@yourcompany.com"
              required
              className="w-full h-11"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              required
              className="w-full h-11"
            />
          </div>
          <Button type="submit" className="w-full h-11 text-base font-medium">
            Sign in
          </Button>
        </form>

        <div className="flex items-center my-8">
          <div className="flex-grow h-px bg-border/60"></div>
          <span className="px-4 text-sm text-muted-foreground">or continue with</span>
          <div className="flex-grow h-px bg-border/60"></div>
        </div>

        {providers && (
          <div className="space-y-3">
            {Object.values(providers).map((provider: Provider) => {
              if (provider.id === "credentials") return null;
              return (
                <Button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: "/main" })}
                  variant="outline"
                  className="w-full h-11 font-medium hover:bg-secondary/80 transition-colors"
                >
                  {provider.id === "google" && <IconBrandGoogle className="h-5 w-5 mr-3" />}
                  {provider.id === "github" && <IconBrandGithub className="h-5 w-5 mr-3" />}
                  Continue with {provider.name}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 