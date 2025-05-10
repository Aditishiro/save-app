import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2 text-primary mb-2">
            <Briefcase className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="text-2xl sm:text-3xl font-bold">FormFlow</span>
          </Link>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Streamline Your Data Collection. Effortlessly create, manage, and publish financial forms.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Log in to your FormFlow account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
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

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="#" className="font-medium text-primary hover:text-primary/90">
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <footer className="mt-12 text-center text-xs text-muted-foreground/80">
        <p>&copy; {new Date().getFullYear()} FormFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
