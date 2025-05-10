import Link from 'next/link';
import { Briefcase } from 'lucide-react';

interface LogoProps {
  href?: string;
  className?: string;
}

export function Logo({ href = "/dashboard/my-forms", className }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 text-lg font-semibold text-sidebar-primary hover:text-sidebar-primary-foreground transition-colors ${className}`}>
      <Briefcase className="h-6 w-6" />
      <span>FormFlow Finance</span>
    </Link>
  );
}
