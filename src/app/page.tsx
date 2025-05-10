import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-8">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase mx-auto mb-4 text-primary"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          <CardTitle className="text-4xl font-bold text-primary">FormFlow Finance</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Streamline Your Data Collection. Effortlessly create, manage, and publish financial forms.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <p className="text-center text-foreground">
            Empowering banking and finance professionals to build powerful data collection forms without writing a single line of code.
          </p>
          <Button asChild size="lg" className="w-full max-w-xs group">
            <Link href="/dashboard/my-forms">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <footer className="mt-12 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} FormFlow Finance. All rights reserved.</p>
      </footer>
    </div>
  );
}
