import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useId } from "react";
import Image from "next/image";
import {
    IconBrandGithub,
    IconBrandGoogle,
  } from "@tabler/icons-react";
import { signIn } from "@/auth"



function SignInDialog() {
  const id = useId();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Get Started</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <Image src="/logo.png" alt="logo" width={100} height={100} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Sign in</DialogTitle>
            <DialogDescription className="sm:text-center">
              We just need a few details to get you started.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input id={`${id}-email`} placeholder="hi@yourcompany.com" type="email" required />
            </div>
          </div>
          <Button type="submit" variant="outline" className="w-full">
            Sign in
          </Button>
        </form>

        <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">Or</span>
        </div>

        <form
          action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/main" })
          }}
        >
          <Button type="submit" variant="outline" className="w-full">
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="ml-2">Continue with Google</span>
          </Button>
        </form>

        <form
          action={async () => {
            "use server"
            await signIn("github", { redirectTo: "/main" })
          }}
        >
          <Button type="submit" variant="outline" className="w-full">
              <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="ml-2">Continue with GitHub</span>
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Terms
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}

export { SignInDialog };
