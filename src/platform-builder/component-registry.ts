
// src/platform-builder/component-registry.ts
import type { ComponentType } from 'react';
import type { PlatformComponentInstance, GlobalComponentDefinition } from './data-models';

// Import your actual renderable components
import PlaceholderComponent from './renderable-components/PlaceholderComponent';
import HeadingTextComponent from './renderable-components/HeadingTextComponent';
import SimpleButtonComponent from './renderable-components/SimpleButtonComponent';

export interface RenderableComponentProps {
  instance: PlatformComponentInstance;
  // Definition is optional because in a live renderer, we might only pass instance data
  // and the component fetches its own definition if needed, or relies purely on instance.type and instance.configuredValues.
  // For a builder UI, providing the full definition is more common.
  definition?: GlobalComponentDefinition;
}

// The registry maps a component type string (from PlatformComponentInstance.type or GlobalComponentDefinition.type)
// to the actual React component that can render it.
export const componentRegistry: Record<string, ComponentType<RenderableComponentProps>> = {
  Placeholder: PlaceholderComponent,
  HeadingText: HeadingTextComponent,
  SimpleButton: SimpleButtonComponent,
  // Add more component types and their corresponding renderable React components here
  // e.g., 'DataTable': DataTableRenderableComponent,
  //       'ImageCarousel': ImageCarouselRenderableComponent,
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

    