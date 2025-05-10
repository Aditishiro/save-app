import Link from 'next/link';
import { Briefcase } from 'lucide-react';

interface LogoProps {
  href?: string;
  className?: string;
  showText?: boolean; // Added to control text visibility for different contexts
}

export function Logo({ href = "/dashboard/my-forms", className, showText = true }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 text-lg font-semibold text-sidebar-primary hover:text-sidebar-primary-foreground transition-colors ${className}`}>
      <Briefcase className="h-6 w-6" />
      {showText && <span>FormFlow</span>}
    </Link>
  );
}