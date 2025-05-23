
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // To toggle between Sign In and Sign Up
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        toast({
          title: "Account Created",
          description: "Verification email sent. Please check your inbox.",
        });
        // Keep user on login page or redirect to a "please verify email" page
        // For now, let's toggle back to sign in form.
        setIsSignUp(false); 
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          setError("Please verify your email before signing in. Another verification email has been sent.");
          await sendEmailVerification(userCredential.user);
          setIsLoading(false);
          return;
        }
        router.push('/dashboard/my-forms');
      }
    } catch (authError: any) {
      console.error("Firebase Auth Error:", authError);
      let friendlyMessage = "An unexpected error occurred. Please try again.";
      switch (authError.code) {
        case 'auth/invalid-email':
          friendlyMessage = "The email address is not valid.";
          break;
        case 'auth/user-disabled':
          friendlyMessage = "This user account has been disabled.";
          break;
        case 'auth/user-not-found':
          friendlyMessage = "No user found with this email.";
          break;
        case 'auth/wrong-password':
          friendlyMessage = "Incorrect password. Please try again.";
          break;
        case 'auth/email-already-in-use':
          friendlyMessage = "This email is already in use. Try signing in.";
          break;
        case 'auth/weak-password':
          friendlyMessage = "The password is too weak. It must be at least 6 characters.";
          break;
        default:
          friendlyMessage = authError.message || friendlyMessage;
      }
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp ? "Sign up to start using FormFlow." : "Log in to your FormFlow account to continue."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleAuthAction} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isSignUp && (
                    <div className="text-sm">
                      <Link href="#" className="font-medium text-primary hover:text-primary/90">
                        Forgot password?
                      </Link>
                    </div>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  className="mt-1"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    isSignUp ? "Sign Up" : "Sign In"
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Button variant="link" onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="font-medium text-primary hover:text-primary/90 p-0 h-auto">
                {isSignUp ? "Sign In" : "Sign Up"}
              </Button>
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
