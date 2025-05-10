import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:flex-col lg:w-1/2 bg-muted/30 items-center justify-center p-12 space-y-6 border-r">
        <Link href="/" className="flex items-center gap-3 text-primary">
          <Briefcase className="h-12 w-12" />
          <span className="text-4xl font-bold">FormFlow</span>
        </Link>
        <p className="text-xl text-center text-foreground/80 max-w-md">
          Streamline Your Data Collection. Effortlessly create, manage, and publish financial forms.
        </p>
        <div className="relative w-full max-w-sm aspect-square">
           <Image 
            src="https://picsum.photos/seed/finance-abstract/400/400" 
            alt="Abstract financial data representation" 
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-xl"
            data-ai-hint="abstract finance"
          />
        </div>
      </div>

      {/* Right Panel (Login Form) */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex flex-col items-center lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2 text-primary mb-2">
              <Briefcase className="h-8 w-8" />
              <span className="text-2xl font-bold">FormFlow</span>
            </Link>
          </div>
        
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Log in to your FormFlow account to continue.
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <div className="text-sm">
                  <Link href="#" className="font-medium text-primary hover:text-primary/90">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1"
                placeholder="••••••••"
              />
            </div>

            <div>
              <Button type="submit" className="w-full" size="lg" asChild>
                {/* In a real app, this would be a submit button. For demo, it links to dashboard. */}
                <Link href="/dashboard/my-forms">Sign In</Link>
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="#" className="font-medium text-primary hover:text-primary/90">
              Sign Up
            </Link>
          </p>
        </div>
        <footer className="mt-12 text-center text-xs text-muted-foreground/80">
          <p>&copy; {new Date().getFullYear()} FormFlow. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}