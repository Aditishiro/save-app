import Link from 'next/link';
import { Briefcase } from 'lucide-react';

interface LogoProps {
  href?: string;
  className?: string;
  showText?: boolean;
}

export function Logo({ href = "/dashboard/my-forms", className, showText = true }: LogoProps) {
  return (
    <Link 
      href={href} 
      // Default to text-primary, sidebar specific styling can override this via its context if needed
      // For sidebar, text-sidebar-foreground or text-sidebar-primary (for active states) is typically handled by parent or theme
      className={`flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/90 transition-colors ${className}`}
    >
      <Briefcase className="h-6 w-6" />
      {showText && <span>FormFlow</span>}
    </Link>
  );
}
