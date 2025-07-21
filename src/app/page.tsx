
'use client';

import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function PublicHomePage() {
  const router = useRouter();

  // Redirect immediately to the dashboard for a public-only app
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary mb-2">
            <Briefcase className="h-8 w-8 sm:h-10 sm:w-10" />
            <span className="text-2xl sm:text-3xl font-bold">CentralBuild</span>
          </Link>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Visually design and build powerful custom platforms and applications.
          </p>
        </div>
        <p className="text-lg">Redirecting to the dashboard...</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">
            Go to Dashboard Now
          </Link>
        </Button>
      </div>
      <footer className="mt-12 text-center text-xs text-muted-foreground/80">
        <p>&copy; {new Date().getFullYear()} CentralBuild. All rights reserved.</p>
      </footer>
    </div>
  );
}
