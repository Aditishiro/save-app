import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Zap, Database } from 'lucide-react';

const mockIntegrations = [
  { name: 'Salesforce', description: 'Sync form submissions with Salesforce CRM.', logo: 'https://picsum.photos/seed/salesforce/40/40', status: 'Connected', dataAiHint: 'salesforce logo' },
  { name: 'Google Sheets', description: 'Automatically export data to Google Sheets.', logo: 'https://picsum.photos/seed/gsheets/40/40', status: 'Not Connected', dataAiHint: 'sheets logo' },
  { name: 'Zapier', description: 'Connect to thousands of apps via Zapier.', logo: 'https://picsum.photos/seed/zapier/40/40', status: 'Not Connected', dataAiHint: 'zapier logo' },
];


export default function IntegrationsPage() {
  return (
    <>
      <PageHeader
        title="Integrations"
        description="Connect FormFlow Finance with your favorite tools and services."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockIntegrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">{integration.name}</CardTitle>
              <img src={integration.logo} alt={`${integration.name} logo`} className="h-8 w-8 rounded" data-ai-hint={integration.dataAiHint} />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">{integration.description}</p>
              {integration.status === 'Connected' ? (
                <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">Disconnect</Button>
              ) : (
                <Button className="w-full">Connect</Button>
              )}
            </CardContent>
          </Card>
        ))}
         <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-dashed">
          <CardContent className="pt-6 flex flex-col items-center justify-center h-full min-h-[150px]">
            <Share2 className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">More Integrations Coming Soon</h3>
            <p className="text-sm text-muted-foreground">We're always working to add new connections.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
