// src/platform-builder/data-models.ts
import type { Timestamp } from 'firebase/firestore';

/**
 * @fileOverview
 * This file defines the core data models for the FormFlow Finance platform builder.
 * It outlines how tenants, global UI components, platform-specific component instances,
 * platform layouts, and user data are structured within Cloud Firestore.
 *
 * Cloud Storage for Firebase Strategy for Component Assets:
 * - Binary assets associated with UI components (e.g., icons for GlobalComponentDefinition,
 *   images configured for an image component instance) should be uploaded to Cloud Storage.
 * - A consistent path structure is recommended, e.g.,
 *   - Global component assets: `/component-assets/{componentDefinitionId}/{assetFileName}`
 *   - Tenant-specific assets for platforms: `/tenants/{tenantId}/platform-assets/{platformId}/{assetFileName}`
 * - The Cloud Storage download URL for an asset will be stored in the relevant
 *   Cloud Firestore document field (e.g., `GlobalComponentDefinition.iconUrl`, or a
 *   property within `PlatformComponentInstance.configuredValues` if a component instance uses a specific image).
 * - Firebase Security Rules for Cloud Storage must be configured to control access
 *   to these assets, typically aligning with Firestore rules (e.g., public assets,
 *   tenant-restricted assets).
 */

/**
 * Defines the schema for a single configurable property of a Global UI Component.
 */
export interface ConfigurablePropertySchema {
  type: 'string' | 'number' | 'boolean' | 'color' | 'json' | 'text' | 'dropdown' | 'file' | 'image' | 'icon' | 'eventHandler' | 'dataSource'; // Added more specific types
  label: string; // User-friendly label for this property in the builder UI.
  defaultValue?: any;
  options?: string[]; // For 'dropdown' type to list available choices.
  placeholder?: string; // Placeholder text for input fields.
  helperText?: string; // Explanatory text for the property.
  validation?: { // Optional validation rules
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string; // Regex pattern for string types
    min?: number; // For number types
    max?: number; // For number types
  };
  group?: string; // Optional grouping for properties in the UI (e.g., "Appearance", "Data", "Behavior").
}

/**
 * Represents the definition of a globally reusable UI component.
 * Stored in: /components/{componentDefinitionId}
 * These are templates managed by platform administrators.
 */
export interface GlobalComponentDefinition {
  id: string; // Matches document ID, should be unique (e.g., 'custom-button', 'user-profile-card').
  type: string; // A unique identifier for the component type (e.g., 'Button', 'DataTable', 'HeroSection'). Used by the rendering engine.
  displayName: string; // User-friendly name for display in the component palette.
  description?: string; // Brief description of the component's purpose.
  iconUrl?: string; // URL (ideally Cloud Storage download URL) for an icon representing this component in the palette.
  tags?: string[]; // e.g., ['input', 'display', 'layout'] for filtering in palette.

  // Defines the properties that can be configured for this component type.
  // The keys are property names (e.g., 'textLabel', 'colorScheme', 'itemsSource').
  configurablePropertiesSchema?: {
    [propertyName: string]: ConfigurablePropertySchema;
  };

  // Default HTML/JSX-like template structure or rendering hints for the component.
  // This could be a string, or a more structured representation if using a specific templating engine.
  template?: string;

  createdAt?: Timestamp;
  lastModified?: Timestamp;
  version?: string; // e.g., '1.0.0'
}

/**
 * Represents an instance of a component placed on a specific user-built platform page.
 * Stored in: /platforms/{platformId}/components/{componentInstanceId}
 */
export interface PlatformComponentInstance {
  id: string; // Matches document ID for this instance.
  definitionId: string; // Reference to GlobalComponentDefinition.id, indicating which global component this is an instance of.
  tenantId: string; // The tenant owning this platform and component instance.
  platformId: string; // The platform this component instance belongs to.

  // Specific values for the configurable properties, overriding defaults from GlobalComponentDefinition.
  // Keys should match those in GlobalComponentDefinition.configurablePropertiesSchema.
  // Values should adhere to the 'type' defined in the schema item.
  configuredValues: {
    [propertyName: string]: any;
  };

  // Positional/styling information relative to the platform layout or parent component.
  // This could define grid placement, order, custom CSS overrides, etc.
  layoutInfo?: {
    parentId?: string | null; // ID of parent component instance if nested, null for root-level.
    order?: number; // Order among siblings.
    // Example layout properties (could be much more complex, e.g., grid-specific like gridRow, gridCol):
    width?: string | number;
    height?: string | number;
    alignment?: string;
    customCss?: string;
  };
  createdAt?: Timestamp;
  lastModified?: Timestamp;
}

/**
 * Represents the layout and structure of a specific page within a user-built platform.
 * Stored in: /platforms/{platformId}/layouts/{layoutId} (e.g., layoutId could be 'homepage', 'dashboard_v1')
 */
export interface PlatformLayout {
  id: string; // Matches document ID, e.g., 'mainPage', 'productDetails'.
  platformId: string; // ID of the platform this layout belongs to.
  tenantId: string; // ID of the tenant owning this platform.
  name: string; // User-friendly name for the layout (e.g., 'Homepage', 'User Dashboard').
  routePath?: string; // e.g., '/', '/profile', '/products/:productId'. Used for routing within the rendered platform.

  // Defines the hierarchy and arrangement of component instances on this layout.
  // This could be a flat list with parent/child relationships or a nested tree structure.
  // For simplicity, a flat list with `parentId` is often easier to manage in Firestore.
  componentHierarchy: Array<{
    instanceId: string; // Reference to PlatformComponentInstance.id.
    // `parentId` and `order` would be managed via PlatformComponentInstance.layoutInfo.
    // This array might just be a list of root-level component instance IDs for this layout.
    // Alternatively, this could be a more complex tree structure.
    // For now, let's assume layoutInfo on the instance handles nesting.
  }>;

  // Platform-wide theme overrides or settings specific to this layout.
  themeOverrides?: {
    primaryColor?: string;
    fontFamily?: string;
    backgroundColor?: string;
  };
  seoSettings?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  createdAt?: Timestamp;
  lastModified?: Timestamp;
}

/**
 * Represents metadata and core configurations for a tenant.
 * Stored in: /tenants/{tenantId}
 */
export interface TenantMetadata {
  id: string; // Matches document ID (e.g., derived from auth or a unique name).
  name: string; // Company name or tenant display name.
  adminUids: string[]; // List of UIDs for tenant administrators.
  subscriptionStatus?: 'active' | 'trial' | 'inactive' | 'pending_setup';
  // Other tenant-specific settings, e.g., custom domain, feature flags.
  domains?: string[]; // Custom domains associated with this tenant's platforms.
  createdAt?: Timestamp;
  lastModified?: Timestamp;
}

/**
 * Represents a user profile within a specific tenant.
 * Stored in: /tenants/{tenantId}/users/{userId} (or /users/{userId} with tenantId field if preferred, but subcollection aligns with strict tenant data separation)
 */
export interface TenantUser {
  id: string; // Matches Auth UID.
  tenantId: string; // ID of the tenant this user belongs to.
  email: string; // User's email.
  displayName?: string;
  photoURL?: string; // Profile picture URL.
  roles: string[]; // e.g., ['tenant_admin', 'platform_editor', 'platform_viewer'] - roles specific to this tenant.
  // Other user preferences or data relevant to their activity within the tenant.
  lastLoginAt?: Timestamp;
  createdAt?: Timestamp;
  lastModified?: Timestamp;
}

/**
 * Represents a user-built platform.
 * Stored in: /platforms/{platformId}
 */
export interface PlatformData {
    id: string; // Matches document ID.
    tenantId: string; // The ID of the tenant that owns this platform.
    name: string; // User-friendly name of the platform.
    description?: string; // Optional description.
    // A platform can have multiple layouts/pages. Store references to layout IDs or primary layout.
    // For example, defaultLayoutId: 'homepageLayoutId'
    defaultLayoutId?: string;
    // List of user UIDs who are designated as admins/editors for this specific platform,
    // beyond the general tenant admins. This allows for delegated platform management.
    platformAdmins?: string[];
    platformEditors?: string[];
    status: 'draft' | 'published' | 'archived' | 'maintenance';
    publishedAt?: Timestamp;
    // Custom domain configuration for this platform, if applicable.
    customDomain?: string;
    // Analytics or tracking IDs specific to this platform.
    trackingIds?: {
      googleAnalytics?: string;
    };
    createdAt?: Timestamp;
    lastModified?: Timestamp;
}
