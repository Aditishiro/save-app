
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Eye, Wand2, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/firebase/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { GlobalComponentDefinition, ConfigurablePropertySchema } from '@/platform-builder/data-models';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface EditGlobalComponentClientProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  componentToEdit: GlobalComponentDefinition | null;
  onClose: () => void;
}

export default function EditGlobalComponentClient({
  isOpen,
  onOpenChange,
  componentToEdit,
  onClose,
}: EditGlobalComponentClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Form state
  const [componentId, setComponentId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [componentType, setComponentType] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [configurablePropertiesJson, setConfigurablePropertiesJson] = useState('');
  const [templateString, setTemplateString] = useState('');

  const [parsedSchemaForPreview, setParsedSchemaForPreview] = useState<Record<string, ConfigurablePropertySchema> | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');

  useEffect(() => {
    if (componentToEdit) {
      setComponentId(componentToEdit.id);
      setDisplayName(componentToEdit.displayName);
      setComponentType(componentToEdit.type);
      setDescription(componentToEdit.description || '');
      setIconUrl(componentToEdit.iconUrl || '');
      setTagsString((componentToEdit.tags || []).join(', '));
      
      let initialJsonString = '{}';
      if (componentToEdit.configurablePropertiesSchema) {
          try {
            const schemaObject = typeof componentToEdit.configurablePropertiesSchema === 'string' 
                                 ? JSON.parse(componentToEdit.configurablePropertiesSchema) 
                                 : componentToEdit.configurablePropertiesSchema;
            initialJsonString = JSON.stringify(schemaObject, null, 2);
          } catch (e) {
              console.warn("Error processing schema for editing, might be invalid JSON string:", e);
              initialJsonString = typeof componentToEdit.configurablePropertiesSchema === 'string' 
                                  ? componentToEdit.configurablePropertiesSchema : '{}';
          }
      }
      setConfigurablePropertiesJson(initialJsonString);
      setTemplateString(componentToEdit.template || '');
    } else {
      setComponentId('');
      setDisplayName('');
      setComponentType('');
      setDescription('');
      setIconUrl('');
      setTagsString('');
      setConfigurablePropertiesJson('{}');
      setTemplateString('');
      setParsedSchemaForPreview(null);
      setJsonError(null);
      setPreviewHtml('');
    }
  }, [componentToEdit]);

  useEffect(() => {
    if (configurablePropertiesJson.trim() === '') {
      setParsedSchemaForPreview({});
      setJsonError(null);
      return;
    }
    try {
      const parsed = JSON.parse(configurablePropertiesJson);
      if (typeof parsed === 'object' && parsed !== null) {
        setParsedSchemaForPreview(parsed);
        setJsonError(null);
      } else {
        setJsonError("Invalid JSON: Schema must be a valid JSON object.");
        setParsedSchemaForPreview(null);
      }
    } catch (error) {
      if (error instanceof Error) {
         setJsonError(`Schema JSON Syntax Error: ${error.message.split('\\n')[0]}`);
      } else {
         setJsonError("Invalid Schema JSON syntax.");
      }
      setParsedSchemaForPreview(null);
    }
  }, [configurablePropertiesJson]);

   useEffect(() => {
    if (jsonError || !parsedSchemaForPreview || !templateString.trim()) {
      setPreviewHtml('<p class="text-muted-foreground text-center text-xs py-4">Enter valid schema and template for preview.</p>');
      return;
    }

    let html = templateString;
    try {
      Object.entries(parsedSchemaForPreview).forEach(([key, schemaProp]) => {
        const defaultValue = schemaProp.defaultValue !== undefined ? String(schemaProp.defaultValue) : '';
        const regex = new RegExp(`\\{\\{\\s*props\\.${key}\\s*\\}\\}`, 'g');
        html = html.replace(regex, defaultValue);
      });
      setPreviewHtml(html);
    } catch (e) {
      console.error("Error generating preview HTML:", e);
      setPreviewHtml('<p class="text-red-500 text-xs text-center py-4">Error generating preview.</p>');
    }
  }, [templateString, parsedSchemaForPreview, jsonError]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!componentToEdit || !componentId.trim() || !displayName.trim() || !componentType.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Component ID, Display Name, and Type are required.',
        variant: 'destructive',
      });
      return;
    }
    if (jsonError) {
      toast({
        title: 'Invalid JSON',
        description: `Configurable Properties Schema JSON is not valid: ${jsonError}`,
        variant: 'destructive',
      });
      return;
    }

    let parsedConfigurableProperties: Record<string, ConfigurablePropertySchema>;
    try {
      parsedConfigurableProperties = JSON.parse(configurablePropertiesJson);
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: `Configurable Properties Schema JSON is not valid. ${(error as Error).message}`,
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    const currentTags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const updatedComponentDef: Partial<GlobalComponentDefinition> = {
      displayName: displayName.trim(),
      type: componentType.trim(),
      description: description.trim() || undefined,
      iconUrl: iconUrl.trim() || undefined,
      configurablePropertiesSchema: parsedConfigurableProperties,
      template: templateString.trim() || undefined,
      tags: currentTags.length > 0 ? currentTags : undefined,
      lastModified: serverTimestamp() as any,
    };

    try {
      const componentDocRef = doc(db, 'components', componentToEdit.id);
      await updateDoc(componentDocRef, updatedComponentDef);

      toast({
        title: 'Global Component Updated',
        description: `Component "${updatedComponentDef.displayName}" has been updated.`,
      });
      onClose(); 
    } catch (error) {
      console.error('Error updating global component:', error);
      toast({
        title: 'Error',
        description: 'Could not update global component. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  // Drastically simplified return for diagnostics
  if (!componentToEdit && isOpen) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }} className="dark:bg-slate-800">
          <p>Loading component data...</p>
          <button onClick={() => onOpenChange(false)} className="mt-4 p-2 border rounded">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }} className="force-light-mode-text-for-debug">
       {/* Simplified Modal Content for Debugging */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', width: '500px', height: '300px', overflowY: 'auto' }}>
        <h2>Edit Component (Simplified Debug View)</h2>
        <p>ID: {componentToEdit?.id || 'N/A'}</p>
        <p>Display Name: {componentToEdit?.displayName || 'N/A'}</p>
        <button onClick={() => onOpenChange(false)} style={{ marginTop: '20px', padding: '10px', border: '1px solid black' }}>
          Close
        </button>
        <button onClick={handleSubmit} style={{ marginTop: '20px', marginLeft: '10px', padding: '10px', border: '1px solid black' }} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save (Debug)'}
        </button>
      </div>
    </div>
  );
}
