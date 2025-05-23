
'use client';

import type { PlatformComponentInstance, GlobalComponentDefinition } from '@/platform-builder/data-models';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface HeadingTextComponentProps {
  instance: PlatformComponentInstance;
  definition: GlobalComponentDefinition;
}

export default function HeadingTextComponent({ instance, definition }: HeadingTextComponentProps) {
  const { configuredValues } = instance;
  const textFromConfig = configuredValues?.text || definition?.configurablePropertiesSchema?.text?.defaultValue || 'Default Heading';
  const levelFromConfig = configuredValues?.level || definition?.configurablePropertiesSchema?.level?.defaultValue || 'h2';
  
  const [displayText, setDisplayText] = useState<string>(textFromConfig);
  const [isLoadingSource, setIsLoadingSource] = useState<boolean>(false);
  const [errorSource, setErrorSource] = useState<string | null>(null);

  useEffect(() => {
    if (configuredValues?.textSource && typeof configuredValues.textSource === 'object') {
      const { collectionPath, documentId, fieldPath } = configuredValues.textSource as { collectionPath?: string, documentId?: string, fieldPath?: string };
      
      if (collectionPath && documentId && fieldPath) {
        setIsLoadingSource(true);
        setErrorSource(null);
        const docRef = doc(db, collectionPath, documentId);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Basic field path navigation, for simplicity.
            // For nested fields, a more robust path resolver would be needed.
            const value = data?.[fieldPath]; 
            if (typeof value === 'string') {
              setDisplayText(value);
            } else if (value !== undefined) {
              setDisplayText(String(value));
              console.warn(`HeadingTextComponent: Field '${fieldPath}' from source is not a string. Coerced to string.`);
            } else {
              setDisplayText(`Field '${fieldPath}' not found in source.`);
              setErrorSource(`Field '${fieldPath}' not found in document '${documentId}'.`);
            }
          } else {
            setDisplayText(`Source document '${documentId}' not found.`);
            setErrorSource(`Source document '${collectionPath}/${documentId}' not found.`);
          }
          setIsLoadingSource(false);
        }, (err) => {
          console.error("Error fetching data source for HeadingTextComponent:", err);
          setDisplayText("Error loading dynamic text.");
          setErrorSource(`Error fetching data: ${err.message}`);
          setIsLoadingSource(false);
        });
        return () => unsubscribe();
      } else {
         setDisplayText(textFromConfig); // Fallback to configured text if source is invalid
      }
    } else {
      setDisplayText(textFromConfig); // Fallback to configured text if no source
    }
  }, [configuredValues, textFromConfig]);


  const Tag = levelFromConfig as keyof JSX.IntrinsicElements;

  if (isLoadingSource) {
    return <p className="text-sm text-muted-foreground animate-pulse">Loading text...</p>;
  }

  if (errorSource && instance.configuredValues?.textSource) {
    // Only show data source error if a textSource was actually configured
    return <p className="text-sm text-red-500">Error loading dynamic text: {errorSource}. Displaying fallback.</p>;
  }

  return <Tag className={`font-semibold ${levelFromConfig === 'h1' ? 'text-4xl' : levelFromConfig === 'h2' ? 'text-3xl' : levelFromConfig === 'h3' ? 'text-2xl' : 'text-xl'}`}>{displayText}</Tag>;
}
