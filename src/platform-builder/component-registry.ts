
// src/platform-builder/component-registry.ts
import type { ComponentType } from 'react';
import type { PlatformComponentInstance, GlobalComponentDefinition } from './data-models';

// Import your actual renderable components
import PlaceholderComponent from './renderable-components/PlaceholderComponent';
import HeadingTextComponent from './renderable-components/HeadingTextComponent';
import SimpleButtonComponent from './renderable-components/SimpleButtonComponent';
import MaterialCardRenderer from './renderable-components/MaterialCardRenderer';
import MaterialTextFieldRenderer from './renderable-components/MaterialTextFieldRenderer';
import MaterialButtonRenderer from './renderable-components/MaterialButtonRenderer';
import ChartComponent from './renderable-components/ChartComponent';


// Import Shadcn renderers
import ShadcnAccordionRenderer from './renderable-components/ShadcnAccordionRenderer';
import ShadcnAlertDialogRenderer from './renderable-components/ShadcnAlertDialogRenderer';
import ShadcnAlertRenderer from './renderable-components/ShadcnAlertRenderer';
import ShadcnAvatarRenderer from './renderable-components/ShadcnAvatarRenderer';
import ShadcnBadgeRenderer from './renderable-components/ShadcnBadgeRenderer';
import ShadcnButtonRenderer from './renderable-components/ShadcnButtonRenderer';
import ShadcnCalendarRenderer from './renderable-components/ShadcnCalendarRenderer';
import ShadcnCardRenderer from './renderable-components/ShadcnCardRenderer';
import ShadcnCheckboxRenderer from './renderable-components/ShadcnCheckboxRenderer';
import ShadcnDialogRenderer from './renderable-components/ShadcnDialogRenderer';
import ShadcnDropdownMenuRenderer from './renderable-components/ShadcnDropdownMenuRenderer';
import ShadcnInputRenderer from './renderable-components/ShadcnInputRenderer';
import ShadcnLabelRenderer from './renderable-components/ShadcnLabelRenderer';
import ShadcnMenubarRenderer from './renderable-components/ShadcnMenubarRenderer';
import ShadcnPopoverRenderer from './renderable-components/ShadcnPopoverRenderer';
import ShadcnProgressRenderer from './renderable-components/ShadcnProgressRenderer';
import ShadcnRadioGroupRenderer from './renderable-components/ShadcnRadioGroupRenderer';
import ShadcnScrollAreaRenderer from './renderable-components/ShadcnScrollAreaRenderer';
import ShadcnSelectRenderer from './renderable-components/ShadcnSelectRenderer';
import ShadcnSeparatorRenderer from './renderable-components/ShadcnSeparatorRenderer';
import ShadcnSheetRenderer from './renderable-components/ShadcnSheetRenderer';
import ShadcnSkeletonRenderer from './renderable-components/ShadcnSkeletonRenderer';
import ShadcnSliderRenderer from './renderable-components/ShadcnSliderRenderer';
import ShadcnSwitchRenderer from './renderable-components/ShadcnSwitchRenderer';
import ShadcnTableRenderer from './renderable-components/ShadcnTableRenderer';
import ShadcnTabsRenderer from './renderable-components/ShadcnTabsRenderer';
import ShadcnTextareaRenderer from './renderable-components/ShadcnTextareaRenderer';
import ShadcnTooltipRenderer from './renderable-components/ShadcnTooltipRenderer';


export interface RenderableComponentProps {
  instance: PlatformComponentInstance;
  definition?: GlobalComponentDefinition;
}

export const componentRegistry: Record<string, ComponentType<RenderableComponentProps>> = {
  Placeholder: PlaceholderComponent,
  HeadingText: HeadingTextComponent,
  SimpleButton: SimpleButtonComponent,
  
  // Material Concept Components
  MaterialCard: MaterialCardRenderer,
  MaterialTextField: MaterialTextFieldRenderer,
  MaterialButton: MaterialButtonRenderer,

  // Custom Components
  chart: ChartComponent,
  card: ShadcnCardRenderer, // Added alias for 'card' to point to ShadcnCardRenderer

  // Shadcn Components
  ShadcnAccordion: ShadcnAccordionRenderer,
  ShadcnAlertDialog: ShadcnAlertDialogRenderer,
  ShadcnAlert: ShadcnAlertRenderer,
  ShadcnAvatar: ShadcnAvatarRenderer,
  ShadcnBadge: ShadcnBadgeRenderer,
  ShadcnButton: ShadcnButtonRenderer,
  ShadcnCalendar: ShadcnCalendarRenderer,
  ShadcnCard: ShadcnCardRenderer,
  ShadcnCheckbox: ShadcnCheckboxRenderer,
  ShadcnDialog: ShadcnDialogRenderer,
  ShadcnDropdownMenu: ShadcnDropdownMenuRenderer,
  ShadcnInput: ShadcnInputRenderer,
  ShadcnLabel: ShadcnLabelRenderer,
  ShadcnMenubar: ShadcnMenubarRenderer,
  ShadcnPopover: ShadcnPopoverRenderer,
  ShadcnProgress: ShadcnProgressRenderer,
  ShadcnRadioGroup: ShadcnRadioGroupRenderer,
  ShadcnScrollArea: ShadcnScrollAreaRenderer,
  ShadcnSelect: ShadcnSelectRenderer,
  ShadcnSeparator: ShadcnSeparatorRenderer,
  ShadcnSheet: ShadcnSheetRenderer,
  ShadcnSkeleton: ShadcnSkeletonRenderer,
  ShadcnSlider: ShadcnSliderRenderer,
  ShadcnSwitch: ShadcnSwitchRenderer,
  ShadcnTable: ShadcnTableRenderer,
  ShadcnTabs: ShadcnTabsRenderer,
  ShadcnTextarea: ShadcnTextareaRenderer,
  ShadcnTooltip: ShadcnTooltipRenderer,
};

export function getRenderableComponent(type: string): ComponentType<RenderableComponentProps> {
  const component = componentRegistry[type];
  if (!component) {
    console.warn(`Component type "${type}" not found in registry. Using PlaceholderComponent.`);
    return PlaceholderComponent;
  }
  return component;
}
