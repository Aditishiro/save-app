
// src/platform-builder/component-registry.ts
import type { ComponentType } from 'react';
import type { PlatformComponentInstance, GlobalComponentDefinition } from './data-models';

// Import your actual renderable components
import PlaceholderComponent from './renderable-components/PlaceholderComponent';
import HeadingTextComponent from './renderable-components/HeadingTextComponent';
import SimpleButtonComponent from './renderable-components/SimpleButtonComponent';

export interface RenderableComponentProps {
  instance: PlatformComponentInstance;
  definition: GlobalComponentDefinition;
  // You might add more props like 'isPreview', 'onInteraction', etc.
}

// The registry maps a component type string (from GlobalComponentDefinition.type)
// to the actual React component that can render it.
export const componentRegistry: Record<string, ComponentType<RenderableComponentProps>> = {
  // --- Standard Components (examples) ---
  Placeholder: PlaceholderComponent, // Fallback
  HeadingText: HeadingTextComponent,
  SimpleButton: SimpleButtonComponent,
  // -- FormFlow Specific Components (if you integrate existing form fields as platform components) --
  // 'FormTextField': FormTextFieldPlatformComponent, // Example
  // 'FormDropdownField': FormDropdownFieldPlatformComponent, // Example

  // --- Layout Components (examples, would need dedicated components) ---
  // 'Container': ContainerComponent,
  // 'Row': RowComponent,
  // 'Column': ColumnComponent,

  // --- More Advanced Components (examples) ---
  // 'DataTable': DataTableComponent,
  // 'ImageGallery': ImageGalleryComponent,
  // 'VideoPlayer': VideoPlayerComponent,
};

/**
 * Retrieves a component from the registry.
 * Falls back to PlaceholderComponent if the type is not found.
 * @param type The component type string.
 * @returns The React component.
 */
export function getRenderableComponent(type: string): ComponentType<RenderableComponentProps> {
  const component = componentRegistry[type];
  if (!component) {
    console.warn(`Component type "${type}" not found in registry. Using PlaceholderComponent.`);
    return PlaceholderComponent;
  }
  return component;
}
