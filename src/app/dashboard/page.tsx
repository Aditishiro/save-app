
import Link from 'next/link';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, LayoutGrid, Building, Layers, Bot, ClipboardList, BarChart3, Zap, ArrowRight } from 'lucide-react';

// Mock data for now - replace with actual data fetching later
const userStats = {
  formsCount: 5, // Example
  platformsCount: 2, // Example
};

const dashboardSections = [
  {
    title: 'Quick Actions',
    icon: Zap,
    links: [
      { href: '/dashboard/my-forms/create', label: 'Create New Form', icon: PlusCircle },
      { href: '/dashboard/platform-builder/my-platforms/create', label: 'Create New Platform', icon: PlusCircle },
    ],
  },
  {
    title: 'My Content',
    icon: LayoutGrid,
    stats: [
        { label: 'Forms', count: userStats.formsCount, href: '/dashboard/my-forms' },
        { label: 'Platforms', count: userStats.platformsCount, href: '/dashboard/platform-builder/my-platforms' },
    ]
  },
  {
    title: 'AI & Analytics',
    icon: Bot,
    links: [
      { href: '/dashboard/ai-optimizer', label: 'AI Form Optimizer', icon: Bot },
      { href: '/dashboard/form-analytics', label: 'Form Analytics', icon: BarChart3 },
      { href: '/dashboard/platform-builder/ai-optimizer', label: 'AI Platform Optimizer', icon: Bot },
      { href: '/dashboard/platform-builder/analytics', label: 'Platform Analytics', icon: BarChart3 },
    ],
  },
   {
    title: 'Resources',
    icon: Layers,
    links: [
      { href: '/dashboard/templates', label: 'Form Templates', icon: Layers },
      { href: '/dashboard/submissions', label: 'View Submissions', icon: ClipboardList },
      { href: '/dashboard/integrations', label: 'Manage Integrations', icon: Zap },
    ],
  },
];

export default function DashboardHomePage() {
  return (
    <>
      <PageHeader
        title="Welcome to PlatformCraft!"
        description="Your central hub for building and managing powerful forms and platforms."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Quick Actions Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1 transition-all hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <dashboardSections[0].icon className="h-5 w-5 text-primary" />
              {dashboardSections[0].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardSections[0].links?.map(link => (
              <Button key={link.href} asChild variant="outline" className="w-full justify-start">
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* My Content Card */}
         <Card className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 transition-all hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <dashboardSections[1].icon className="h-5 w-5 text-primary" />
              {dashboardSections[1].title}
            </CardTitle>
             <CardDescription>Overview of your created assets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardSections[1].stats?.map(stat => (
                <Link href={stat.href} key={stat.label} className="block p-3 rounded-md hover:bg-muted/50 transition-colors border">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">{stat.label}</span>
                        <Badge variant="secondary" className="text-sm">{stat.count}</Badge>
                    </div>
                </Link>
            ))}
          </CardContent>
        </Card>


        {/* AI & Analytics Card */}
        <Card className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 transition-all hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <dashboardSections[2].icon className="h-5 w-5 text-primary" />
              {dashboardSections[2].title}
            </CardTitle>
            <CardDescription>Optimize and get insights.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboardSections[2].links?.map(link => (
              <Link key={link.href} href={link.href} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-sm transition-colors text-foreground hover:text-primary">
                <div className="flex items-center gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
        
        {/* Resources Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1 transition-all hover:shadow-xl hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
               <dashboardSections[3].icon className="h-5 w-5 text-primary" />
              {dashboardSections[3].title}
            </CardTitle>
             <CardDescription>Access tools and manage data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {dashboardSections[3].links?.map(link => (
                 <Link key={link.href} href={link.href} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-sm transition-colors text-foreground hover:text-primary">
                    <div className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
            ))}
          </CardContent>
        </Card>

      </div>
    </>
  );
}
