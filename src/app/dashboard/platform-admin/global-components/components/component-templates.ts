// src/app/dashboard/platform-admin/global-components/components/component-templates.ts
import type { GlobalComponentDefinition, ConfigurablePropertySchema } from '@/platform-builder/data-models';

// Base type for our templates, making schema an object and id a suggestion
export interface ComponentTemplate {
  templateId: string; // Unique key for the template itself (e.g., 'material-card')
  suggestedId: string;
  displayName: string;
  type: string;
  description?: string;
  iconUrl?: string;
  tags?: string[];
  configurablePropertiesSchema: {
    [propertyName: string]: ConfigurablePropertySchema;
  };
  templateString?: string; // Renamed from 'template' to avoid conflict with JSX
}

export const componentTemplates: ComponentTemplate[] = [
  {
    templateId: 'material-card',
    suggestedId: 'material-card-v1',
    type: 'MaterialCard',
    displayName: 'Material Card',
    description: 'A versatile Material Design card for displaying content and actions.',
    iconUrl: 'https://placehold.co/40x40.png?text=MCard',
    tags: ['layout', 'material', 'container'],
    configurablePropertiesSchema: {
      elevation: {
        type: 'number',
        label: 'Elevation (0-24)',
        defaultValue: 1,
        min: 0,
        max: 24,
        helperText: 'Controls the shadow depth.',
        group: 'Appearance',
      },
      outlined: {
        type: 'boolean',
        label: 'Outlined Style',
        defaultValue: false,
        helperText: 'Use an outlined style instead of elevated.',
        group: 'Appearance',
      },
      title: {
        type: 'string',
        label: 'Card Title',
        defaultValue: '',
        placeholder: 'Enter card title',
        group: 'Content',
      },
      subtitle: {
        type: 'string',
        label: 'Card Subtitle',
        defaultValue: '',
        placeholder: 'Enter card subtitle',
        group: 'Content',
      },
      contentPadding: {
          type: 'string',
          label: 'Content Padding (e.g., 16px)',
          defaultValue: '16px',
          group: 'Appearance',
      },
      primaryActionText: {
        type: 'string',
        label: 'Primary Action Text',
        defaultValue: '',
        group: 'Actions',
      },
      primaryActionLink: {
        type: 'string',
        label: 'Primary Action Link/Event',
        defaultValue: '',
        helperText: 'URL or event name for the primary action.',
        group: 'Actions',
      },
    },
    templateString: `
<div class="material-card elevation-{{props.elevation}} {{#if props.outlined}}outlined{{/if}}" style="padding: {{props.contentPadding}}">
  {{#if props.title}}<h2>{{props.title}}</h2>{{/if}}
  {{#if props.subtitle}}<h3>{{props.subtitle}}</h3>{{/if}}
  <div class="card-content-area">
    <!-- User-added components would go here -->
  </div>
  {{#if props.primaryActionText}}
    <button data-action="{{props.primaryActionLink}}">{{props.primaryActionText}}</button>
  {{/if}}
</div>
    `.trim(),
  },
  {
    templateId: 'material-text-field',
    suggestedId: 'material-text-field-v1',
    type: 'MaterialTextField',
    displayName: 'Material Text Field',
    description: 'A Material Design text input field with various styles.',
    iconUrl: 'https://placehold.co/40x40.png?text=MTF',
    tags: ['input', 'material', 'form'],
    configurablePropertiesSchema: {
      label: {
        type: 'string',
        label: 'Label',
        defaultValue: 'Label',
        group: 'Basic',
      },
      variant: {
        type: 'dropdown',
        label: 'Variant',
        options: ['filled', 'outlined', 'standard'],
        defaultValue: 'outlined',
        group: 'Appearance',
      },
      placeholder: {
        type: 'string',
        label: 'Placeholder',
        defaultValue: '',
        group: 'Basic',
      },
      helperText: {
        type: 'string',
        label: 'Helper Text',
        defaultValue: '',
        group: 'Basic',
      },
      required: {
        type: 'boolean',
        label: 'Required',
        defaultValue: false,
        group: 'Validation',
      },
      disabled: {
        type: 'boolean',
        label: 'Disabled',
        defaultValue: false,
        group: 'State',
      },
      valuePath: {
          type: 'string',
          label: 'Data Path for Value',
          defaultValue: '',
          helperText: 'e.g., orderData.customerName',
          group: 'Data'
      }
    },
    templateString: `
<div class="material-text-field variant-{{props.variant}} {{#if props.disabled}}disabled{{/if}}">
  <label for="{{props.id}}">{{props.label}}</label>
  <input id="{{props.id}}" type="text" placeholder="{{props.placeholder}}" {{#if props.required}}required{{/if}} value="{{data[props.valuePath]}}" />
  {{#if props.helperText}}<p class="helper-text">{{props.helperText}}</p>{{/if}}
</div>
    `.trim(),
  },
  {
    templateId: 'material-button',
    suggestedId: 'material-button-v1',
    type: 'MaterialButton',
    displayName: 'Material Button',
    description: 'A Material Design button.',
    iconUrl: 'https://placehold.co/40x40.png?text=MBtn',
    tags: ['action', 'material', 'button'],
    configurablePropertiesSchema: {
      label: {
        type: 'string',
        label: 'Button Text',
        defaultValue: 'Button',
        group: 'Content',
      },
      variant: {
        type: 'dropdown',
        label: 'Variant',
        options: ['text', 'outlined', 'contained'],
        defaultValue: 'contained',
        group: 'Appearance',
      },
      color: {
        type: 'dropdown',
        label: 'Color',
        options: ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'default'],
        defaultValue: 'primary',
        group: 'Appearance',
      },
      disabled: {
        type: 'boolean',
        label: 'Disabled',
        defaultValue: false,
        group: 'State',
      },
      onClickAction: {
        type: 'string',
        label: 'On Click Action',
        defaultValue: '',
        helperText: 'Define what happens when the button is clicked.',
        group: 'Behavior',
      },
      startIcon: {
          type: 'string',
          label: 'Start Icon Name',
          defaultValue: '',
          group: 'Appearance'
      }
    },
    templateString: `
<button class="material-button variant-{{props.variant}} color-{{props.color}}" {{#if props.disabled}}disabled{{/if}} data-action="{{props.onClickAction}}">
  {{#if props.startIcon}}<span class="icon">{{props.startIcon}}</span>{{/if}}
  {{props.label}}
</button>
    `.trim(),
  },
];
