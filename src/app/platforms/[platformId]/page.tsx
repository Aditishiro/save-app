
// src/app/platforms/[platformId]/page.tsx

import { type Metadata } from 'next';
import { PageHeader } from '@/components/common/page-header';
import PlatformRendererClient from './components/platform-renderer-client';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import type { PlatformData } from '@/platform-builder/data-models';
import { notFound } from 'next/navigation';

interface PlatformPageProps {
  params: { platformId: string };
}

// Function to generate metadata (e.g., page title)
export async function generateMetadata({ params }: PlatformPageProps): Promise<Metadata> {
  const platformId = params.platformId;
  try {
    const platformDocRef = doc(db, 'platforms', platformId);
    const platformSnap = await getDoc(platformDocRef);

    if (platformSnap.exists()) {
      const platformData = platformSnap.data() as PlatformData;
      if (platformData.status === 'published') {
        return {
          title: `${platformData.name} | PlatformCraft Platform`,
          description: platformData.description || `View the ${platformData.name} platform.`,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching platform metadata:", error);
  }
  // Default or fallback metadata if platform not found or not published
  return {
    title: 'Platform Viewer',
    description: 'View a dynamically rendered platform built with PlatformCraft.',
  };
}


export default function PlatformPage({ params }: PlatformPageProps) {
  const { platformId } = params;

  // Note: Server-side data fetching for initial check can be done here,
  // but real-time aspects and complex rendering logic are better in a client component.
  // For now, we pass platformId to the client component which handles all fetching.

  return (
    <div className="container mx-auto py-8">
      {/* PageHeader can be minimal or removed if the platform itself defines its header */}
      <PlatformRendererClient platformId={platformId} />
    </div>
  );
}
