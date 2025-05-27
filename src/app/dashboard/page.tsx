
import Link from 'next/link';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, LayoutGrid, Building, Layers, Wand2, ClipboardList, BarChart3, Zap, ArrowRight, Brain, Home } from 'lucide-react';
import FormSubmissionsBarChart from './components/charts/form-submissions-bar-chart';
import FormStatusPieChart from './components/charts/form-status-pie-chart';
import PlatformCreationsBarChart from './components/charts/platform-creations-bar-chart'; // New import
import PlatformStatusPieChart from './components/charts/platform-status-pie-chart'; // New import


// Mock data for now - replace with actual data fetching later
const userStats = {
  formsCount: Math.floor(Math.random() * 10) + 3,
  platformsCount: Math.floor(Math.random() * 5) + 1,
};

export default function DashboardHomePage() {
  return (
    <>
      <PageHeader
        title="Welcome to CentralBuild!"
        description="Your central hub for building and managing powerful forms and platforms."
      />

      <> {/* React Fragment Wrapper */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Quick Actions Card */}
          <Card className="lg:col-span-1 transition-all hover:shadow-xl hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button key="/dashboard/my-forms/create" asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/my-forms/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Form
                </Link>
              </Button>
              <Button key="/dashboard/platform-builder/my-platforms/create" asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/platform-builder/my-platforms/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Platform
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* My Content Card */}
          <Card className="lg:col-span-1 transition-all hover:shadow-xl hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <LayoutGrid className="h-5 w-5 text-primary" />
                My Content
              </CardTitle>
              <CardDescription>Overview of your created assets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Link href="/dashboard/my-forms" key="Forms" className="block p-3 rounded-md hover:bg-muted/50 transition-colors border">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Forms</span>
                        <Badge variant="secondary" className="text-sm">{userStats.formsCount}</Badge>
                    </div>
                </Link>
                <Link href="/dashboard/platform-builder/my-platforms" key="Platforms" className="block p-3 rounded-md hover:bg-muted/50 transition-colors border">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Platforms</span>
                        <Badge variant="secondary" className="text-sm">{userStats.platformsCount}</Badge>
                    </div>
                </Link>
            </CardContent>
          </Card>

          {/* AI & Analytics Card */}
          <Card className="lg:col-span-1 transition-all hover:shadow-xl hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="h-5 w-5 text-primary" />
                AI & Analytics
              </CardTitle>
              <CardDescription>Optimize and get insights.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link key="/dashboard/ai-optimizer" href="/dashboard/ai-optimizer" className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-sm transition-colors text-foreground hover:text-primary">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  AI Form Optimizer
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link key="/dashboard/form-analytics" href="/dashboard/form-analytics" className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-sm transition-colors text-foreground hover:text-primary">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Form Analytics
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link key="/dashboard/platform-builder/ai-optimizer" href="/dashboard/platform-builder/ai-optimizer" className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-sm transition-colors text-foreground hover:text-primary">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  AI Platform Optimizer
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link key="/dashboard/platform-builder/analytics" href="/dashboard/platform-builder/analytics" className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-sm transition-colors text-foreground hover:text-primary">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Platform Analytics
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>
          
          {/* Resources Card */}
          <Card className="lg:col-span-1 transition-all hover:shadow-xl hover:scale-[1.01]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers className="h-5 w-5 text-primary" />
                Resources
              </CardTitle>
              <CardDescription>Access tools and manage data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Link key="/dashboard/templates" href="/dashboard/templates" className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-sm transition-colors text-foreground hover:text-primary">
                    <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Form Templates
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link key="/dashboard/submissions" href="/dashboard/submissions" className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-sm transition-colors text-foreground hover:text-primary">
                    <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    View Submissions
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link key="/dashboard/integrations" href="/dashboard/integrations" className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-sm transition-colors text-foreground hover:text-primary">
                    <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Manage Integrations
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
            </CardContent>
          </Card>

          {/* Form Charts */}
          <div className="md:col-span-2 lg:col-span-2">
            <FormSubmissionsBarChart />
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <FormStatusPieChart />
          </div>

          {/* Platform Charts - New */}
          <div className="md:col-span-2 lg:col-span-2">
            <PlatformCreationsBarChart />
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <PlatformStatusPieChart />
          </div>

        </div>
      </> {/* Closing React Fragment Wrapper */}
    </>
  );
}
