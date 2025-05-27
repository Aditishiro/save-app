
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
      // Default text color will be inherited from parent (e.g., sidebar-foreground)
      // Hover effect can be more specific if needed
      className={`flex items-center gap-2 text-lg font-semibold ${className}`}
    >
      <Briefcase className="h-6 w-6" />
      {showText && <span>PlatformCraft</span>}
    </Link>
  );
}
