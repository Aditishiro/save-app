
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brush, LayoutDashboard, Settings2, AlertTriangle, PlusCircle } from 'lucide-react';
import type { GlobalComponentDefinition } from '@/platform-builder/data-models';

// Import the components we'll use to make this page functional
import CreateGlobalComponentClient from '../../global-components/components/create-global-component-client';
import EditGlobalComponentClient from '../../global-components/components/edit-global-component-client';
import GlobalComponentsListClient from '../../global-components/components/global-components-list-client';


export default function DesignerClient() {
  const [selectedComponent, setSelectedComponent] = useState<GlobalComponentDefinition | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // This function will be passed to the list component to handle edits
  const handleEditComponent = (component: GlobalComponentDefinition) => {
    setSelectedComponent(component);
    setIsEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedComponent(null);
    // The list component will refetch its data automatically, but we could add a manual refetch trigger if needed
  };

  return (
    <>
      <div className="flex-1 grid grid-cols-1 gap-4 overflow-hidden">
        {/* We'll replace the three-column layout with a more practical single-column list view */}
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="flex-row items-center justify-between shrink-0">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brush className="h-5 w-5 text-primary" /> Component Library
              </CardTitle>
              <CardDescription className="text-xs">
                Manage all global components available for platform building.
              </CardDescription>
            </div>
            {/* We'll use the existing create component client here */}
            <CreateGlobalComponentClient />
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4">
              <GlobalComponentsListClient onEditComponent={handleEditComponent} />
          </CardContent>
        </Card>
      </div>
      
       {/* The Edit Dialog, which will be controlled by this client */}
       {selectedComponent && (
          <EditGlobalComponentClient
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            componentToEdit={selectedComponent}
            onClose={handleCloseEditDialog}
          />
       )}
    </>
  );
}
