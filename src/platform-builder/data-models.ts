// src/platform-builder/data-models.ts
import type { Timestamp } from 'firebase/firestore';

/**
 * Represents the definition of a globally reusable UI component.
 * Stored in: /components/{componentDefinitionId}
 */
export interface GlobalComponentDefinition {
  id: string; // Matches document ID, user-defined at creation for simplicity here
  type: string; // e.g., 'Button', 'DataTable', 'TextInput', 'HeroSection'
  displayName: string; // User-friendly name
  description?: string;
  iconUrl?: string; // For display in a component palette
  // Defines the properties that can be configured for this component type
  // Stored as a stringified JSON for simplicity in this initial version
  configurablePropertiesJson?: string; 
  // Could also include default HTML/JSX template structure or rendering hints
  template?: string;
  createdAt?: Timestamp; // Will be set by serverTimestamp
  lastModified?: Timestamp; // Will be set by serverTimestamp
}

/**
 * Represents an instance of a component placed on a specific user-built platform.
 * Stored in: /platforms/{platformId}/components/{componentInstanceId}
 */
export interface PlatformComponentInstance {
  id: string; // Matches document ID
  definitionId: string; // Reference to a GlobalComponentDefinition.id
  tenantId: string; // The tenant owning this platform and component instance
  platformId: string; // The platform this component instance belongs to
  // Specific values for the configurable properties, overriding defaults from GlobalComponentDefinition
  configuredValues: {
    [propName: string]: any; // e.g., textLabel: "Submit", colorScheme: "blue", dataSourceId: "/tenants/tenantA/data/products"
  };
  // Positional/styling information relative to the platform layout
  layoutInfo?: {
    gridRow?: number;
    gridCol?: number;
    width?: string | number;
    height?: string | number;
    // Other layout specific properties
  };
  createdAt: Timestamp;
  lastModified: Timestamp;
}

/**
 * Represents the layout and structure of a user-built platform.
 * Stored in: /platforms/{platformId}/layout/{layoutId} (e.g., layoutId could be 'mainPage')
 * Could also be a single document like /platforms/{platformId} with a 'layout' map field.
 */
export interface PlatformLayout {
  id: string; // Matches document ID
  platformId: string;
  tenantId: string;
  name: string; // e.g., 'Homepage', 'Dashboard'
  // A simplified representation; could be a nested structure (tree)
  // or a flat list with parent-child relationships.
  componentHierarchy: Array<{
    instanceId: string; // Reference to PlatformComponentInstance.id
    parentId?: string | null; // For nested layouts
    order: number;
  }>;
  // Could also store grid definitions, theme overrides for the platform page, etc.
  themeOverrides?: {
    primaryColor?: string;
    fontFamily?: string;
  };
  createdAt: Timestamp;
  lastModified: Timestamp;
}

/**
 * Represents metadata and core configurations for a tenant.
 * Stored in: /tenants/{tenantId}
 */
export interface TenantMetadata {
  id: string; // Matches document ID (e.g., derived from auth or a unique name)
  name: string; // Company name or tenant display name
  adminUids: string[]; // List of UIDs for tenant administrators
  subscriptionStatus?: 'active' | 'trial' | 'inactive';
  // Other tenant-specific settings
  createdAt: Timestamp;
  lastModified: Timestamp;
}

/**
 * Represents a user profile within a specific tenant.
 * Stored in: /tenants/{tenantId}/users/{userId}
 */
export interface TenantUser {
  id: string; // Matches Auth UID
  tenantId: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'editor' | 'viewer' | string; // Tenant-specific roles
  // Other user preferences or data relevant to their activity within the tenant
  createdAt: Timestamp;
  lastModified: Timestamp;
}

/**
 * Represents a user-built platform.
 * Stored in: /platforms/{platformId}
 */
export interface PlatformData {
    id: string; // Matches document ID
    tenantId: string;
    name: string;
    description?: string;
    // Could store a reference to the primary layout document/ID
    // or embed a simple layout structure directly if not too complex.
    // For this example, we assume layout is in a subcollection or separate doc.
    status: 'draft' | 'published' | 'archived';
    createdAt: Timestamp;
    lastModified: Timestamp;
    // Who can manage/edit this platform definition (distinct from tenant admins)
    platformAdmins?: string[];
}
