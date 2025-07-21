
'use client'; 

import { type ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import {
  LayoutGrid,
  Layers,
  ClipboardList,
  Settings,
  Share2,
  UserCircle,
  LogOut,
  Search,
  BarChart3,
  Package, 
  Building, 
  Brain, 
  Wand2,
  Home,
  Palette, 
  MessageCircle,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/common/logo';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/auth-context'; 
import { TooltipProvider } from '@/components/ui/tooltip';


const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home }, 
  { href: '/dashboard/my-forms', label: 'My Forms', icon: LayoutGrid },
  { href: '/dashboard/templates', label: 'Templates', icon: Layers },
  { href: '/dashboard/submissions', label: 'Submissions', icon: ClipboardList },
  { href: '/dashboard/ai-optimizer', label: 'AI Form Optimizer', icon: Wand2 },
  { href: '/dashboard/form-analytics', label: 'Form Analytics', icon: BarChart3 },
  { href: '/dashboard/integrations', label: 'Integrations', icon: Share2 },
];

const platformBuilderNavItems = [
  { href: '/dashboard/platform-builder/my-platforms', label: 'My Platforms', icon: Building },
  { href: '/dashboard/platform-builder/ai-chatbot', label: 'AI Platform Generator', icon: MessageCircle },
  { href: '/dashboard/platform-builder/ai-optimizer', label: 'AI Platform Optimizer', icon: Wand2 },
  { href: '/dashboard/platform-builder/analytics', label: 'Platform Analytics', icon: Brain },
];

const adminNavItems = [ 
  { href: '/dashboard/platform-admin/global-components', label: 'Global Components', icon: Package },
  { href: '/dashboard/platform-admin/component-designer', label: 'Component Designer', icon: Palette },
];

const bottomNavItems = [
 { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const pathname = usePathname(); 

  // In a fully public app, all features are enabled for the 'public-user'
  const isPlatformAdmin = true;
  const canAccessPlatformBuilder = true;


  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <Sidebar 
          variant="sidebar" 
          collapsible="icon" 
          side="left" 
          className="border-r bg-sidebar text-sidebar-foreground border-sidebar-border"
        >
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <Logo className="text-sidebar-foreground hover:text-sidebar-foreground/90" />
          </SidebarHeader>
          <SidebarContent className="p-2 flex flex-col justify-between">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      tooltip={item.label}
                      asChild
                      isActive={pathname === item.href} 
                    >
                      <a>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
              
              {canAccessPlatformBuilder && (
                <>
                  <SidebarMenuButton variant="ghost" className="my-2 pointer-events-none justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                    <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">Platform Builder</span>
                  </SidebarMenuButton>
                  {platformBuilderNavItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <Link href={item.href} passHref legacyBehavior>
                        <SidebarMenuButton
                          tooltip={item.label}
                          asChild
                          isActive={pathname === item.href} 
                        >
                          <a>
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </>
              )}

              {isPlatformAdmin && ( 
                <>
                  <SidebarMenuButton variant="ghost" className="my-2 pointer-events-none justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                    <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">Platform Admin</span>
                  </SidebarMenuButton>
                  {adminNavItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <Link href={item.href} passHref legacyBehavior>
                        <SidebarMenuButton
                          tooltip={item.label}
                          asChild
                          isActive={pathname === item.href} 
                        >
                          <a>
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </>
              )}
            </SidebarMenu>

            <SidebarMenu className="mt-auto"> 
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      tooltip={item.label}
                      asChild
                      isActive={pathname === item.href} 
                    >
                      <a>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center justify-start gap-2 w-full p-2 h-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={"https://placehold.co/200x200.png"} alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>{currentUser?.email?.[0]?.toUpperCase() || 'P'}</AvatarFallback>
                  </Avatar>
                  <div className="text-left group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate">{currentUser?.displayName || "Public User"}</p>
                    {currentUser?.email && <p className="text-xs text-sidebar-foreground/70 truncate">{currentUser.email}</p>}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56 bg-popover/80 backdrop-blur-sm dark:bg-popover/90">
                <DropdownMenuLabel>My Account (Public Mode)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out (Disabled)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-[hsl(var(--header-background))] text-[hsl(var(--header-foreground))] px-6 shadow-md">
            <SidebarTrigger className="md:hidden text-[hsl(var(--header-foreground))] hover:opacity-80" />
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-card text-card-foreground pl-8 md:w-[200px] lg:w-[320px] h-9 border-border focus:bg-card dark:focus:bg-card"
                />
              </div>
            </div>
             <Avatar className="h-9 w-9">
              <AvatarImage src={"https://placehold.co/200x200.png"} alt="User Avatar" data-ai-hint="user avatar" />
              <AvatarFallback>{currentUser?.email?.[0]?.toUpperCase() || 'P'}</AvatarFallback>
            </Avatar>
          </header>
          <main className="flex-1 p-6 bg-background overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
