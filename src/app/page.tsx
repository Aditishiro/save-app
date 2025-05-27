
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // We still send the verification email, but won't block login
        await sendEmailVerification(userCredential.user);
        toast({
          title: "Account Created",
          description: "Verification email sent. Please check your inbox (optional for login).",
        });
        setIsSignUp(false);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Removed the emailVerified check to allow sign-in without verification
        router.push('/dashboard');
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
          friendlyMessage = "No account found with this email address.";
          break;
        case 'auth/wrong-password':
          friendlyMessage = "Incorrect password. Please try again.";
          break;
        case 'auth/invalid-credential':
           friendlyMessage = "Invalid email or password. Please check your credentials and try again.";
          break;
        case 'auth/email-already-in-use':
          friendlyMessage = "This email is already in use. Try signing in or use a different email.";
          break;
        case 'auth/weak-password':
          friendlyMessage = "The password is too weak. It must be at least 6 characters long.";
          break;
        default:
          if (authError.message && !authError.message.toLowerCase().includes('internal-error') && !authError.message.toLowerCase().includes('network-request-failed')) {
            friendlyMessage = authError.message;
          }
          break;
      }
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError("Please enter your email address for password reset.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, a password reset link has been sent. Please check your inbox.",
      });
      setShowPasswordReset(false);
      setResetEmail('');
    } catch (resetError: any) {
      console.error("Password Reset Error:", resetError);
      let friendlyMessage = "Could not send password reset email. Please try again.";
      if (resetError.code === 'auth/invalid-email') {
        friendlyMessage = "The email address provided for password reset is not valid.";
      } else if (resetError.code === 'auth/user-not-found') {
         // To prevent user enumeration, show a generic message even if user is not found.
         toast({
          title: "Password Reset Email Sent",
          description: "If an account exists for this email, a password reset link has been sent. Please check your inbox.",
        });
        setShowPasswordReset(false);
        setResetEmail('');
      } else {
         setError(friendlyMessage);
      }
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
            <span className="text-2xl sm:text-3xl font-bold">CentralBuild</span>
          </Link>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Visually design and build powerful custom platforms and applications.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {showPasswordReset ? "Reset Password" : (isSignUp ? "Create an Account" : "Welcome Back")}
            </CardTitle>
            <CardDescription>
              {showPasswordReset
                ? "Enter your email address and we'll send you a link to reset your password."
                : (isSignUp ? "Sign up to start using CentralBuild." : "Log in to your CentralBuild account to continue.")
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>{showPasswordReset ? "Reset Error" : "Authentication Error"}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {showPasswordReset ? (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <Label htmlFor="reset-email">Email address</Label>
                  <Input
                    id="reset-email-input"
                    data-testid="reset-email-input"
                    name="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Button
                    id="send-reset-link-button"
                    data-testid="send-reset-link-button"
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <><Mail className="mr-2 h-4 w-4" /> Send Reset Link</>
                    )}
                  </Button>
                </div>
                 <p className="mt-8 text-center text-sm text-muted-foreground">
                  Remembered your password?{" "}
                  <Button
                    id="back-to-signin-button-from-reset"
                    data-testid="back-to-signin-button"
                    variant="link"
                    onClick={() => { setShowPasswordReset(false); setError(null); }}
                    className="font-medium text-primary hover:text-primary/90 p-0 h-auto"
                  >
                    Back to Sign In
                  </Button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleAuthAction} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email-input"
                    data-testid="email-input"
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
                        <Button
                          id="forgot-password-button"
                          data-testid="forgot-password-button"
                          type="button"
                          variant="link"
                          onClick={() => { setShowPasswordReset(true); setError(null); }}
                          className="font-medium text-primary hover:text-primary/90 p-0 h-auto text-xs sm:text-sm"
                        >
                          Forgot password?
                        </Button>
                      </div>
                    )}
                  </div>
                  <Input
                    id="password-input"
                    data-testid="password-input"
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
                  <Button
                    id="auth-action-button"
                    data-testid="auth-action-button"
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      isSignUp ? "Sign Up" : "Sign In"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {!showPasswordReset && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <Button
                  id="toggle-signup-signin-button"
                  data-testid="toggle-signup-signin-button"
                  variant="link"
                  onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                  className="font-medium text-primary hover:text-primary/90 p-0 h-auto"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Button>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <footer className="mt-12 text-center text-xs text-muted-foreground/80">
        <p>&copy; {new Date().getFullYear()} CentralBuild. All rights reserved.</p>
      </footer>
    </div>
  );
}
