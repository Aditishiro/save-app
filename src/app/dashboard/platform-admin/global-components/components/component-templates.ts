
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
    displayName: 'Material Card (Concept)',
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
    displayName: 'Material Text Field (Concept)',
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
    displayName: 'Material Button (Concept)',
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
  {
    templateId: 'shadcn-accordion',
    suggestedId: 'shadcn-accordion-v1',
    type: 'ShadcnAccordion',
    displayName: 'Accordion (Shadcn)',
    description: 'A Shadcn UI Accordion component for vertically stacked content.',
    iconUrl: 'https://placehold.co/40x40.png?text=Accr',
    tags: ['layout', 'interactive', 'shadcn'],
    configurablePropertiesSchema: {
      behaviorType: {
        type: 'dropdown',
        label: 'Behavior Type',
        options: ['single', 'multiple'],
        defaultValue: 'single',
        group: 'Behavior',
        helperText: "'single' allows one item open, 'multiple' allows many.",
      },
      collapsible: {
        type: 'boolean',
        label: 'Collapsible (for single type)',
        defaultValue: false,
        group: 'Behavior',
        helperText: 'If true, allows all items to be closed in "single" type.',
      },
      items: {
        type: 'textarea', // User inputs JSON string
        label: 'Accordion Items (JSON)',
        defaultValue: JSON.stringify(
          [
            { value: 'item-1', title: 'Item 1 Title', content: 'Content for item 1.' },
            { value: 'item-2', title: 'Item 2 Title', content: 'Content for item 2.' },
          ],
          null,
          2
        ),
        group: 'Content',
        helperText: 'JSON array: [{value: "unique-id", title: "string", content: "string (can be HTML)"}]',
      },
    },
    templateString: `
<!-- Conceptual: Actual rendering uses Shadcn components -->
<Accordion type="{{props.behaviorType}}" collapsible="{{props.collapsible}}">
  {{#each props.items}}
    <AccordionItem value="{{this.value}}">
      <AccordionTrigger>{{this.title}}</AccordionTrigger>
      <AccordionContent>{{{this.content}}}</AccordionContent>
    </AccordionItem>
  {{/each}}
</Accordion>
    `.trim(),
  },
  // New ShadCN component templates start here
  {
    templateId: 'shadcn-alert-dialog',
    suggestedId: 'shadcn-alert-dialog-v1',
    type: 'ShadcnAlertDialog',
    displayName: 'Alert Dialog (Shadcn)',
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
    iconUrl: 'https://placehold.co/40x40.png?text=ADlg',
    tags: ['dialog', 'modal', 'interactive', 'shadcn'],
    configurablePropertiesSchema: {
      triggerText: {
        type: 'string',
        label: 'Trigger Button Text',
        defaultValue: 'Open Alert Dialog',
        group: 'Trigger',
      },
      title: {
        type: 'string',
        label: 'Dialog Title',
        defaultValue: 'Are you absolutely sure?',
        group: 'Content',
      },
      description: {
        type: 'textarea',
        label: 'Dialog Description',
        defaultValue: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
        group: 'Content',
      },
      cancelText: {
        type: 'string',
        label: 'Cancel Button Text',
        defaultValue: 'Cancel',
        group: 'Actions',
      },
      actionText: {
        type: 'string',
        label: 'Action Button Text',
        defaultValue: 'Continue',
        group: 'Actions',
      },
    },
    templateString: `
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{{props.triggerText}}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{props.title}}</AlertDialogTitle>
          <AlertDialogDescription>
            {{props.description}}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{{props.cancelText}}</AlertDialogCancel>
          <AlertDialogAction>{{props.actionText}}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    `.trim(),
  },
  {
    templateId: 'shadcn-alert',
    suggestedId: 'shadcn-alert-v1',
    type: 'ShadcnAlert',
    displayName: 'Alert (Shadcn)',
    description: 'Displays a callout for user attention.',
    iconUrl: 'https://placehold.co/40x40.png?text=Alrt',
    tags: ['feedback', 'notification', 'shadcn'],
    configurablePropertiesSchema: {
      variant: {
        type: 'dropdown',
        label: 'Variant',
        options: ['default', 'destructive'],
        defaultValue: 'default',
        group: 'Appearance',
      },
      title: {
        type: 'string',
        label: 'Alert Title',
        defaultValue: 'Alert Title',
        group: 'Content',
      },
      description: {
        type: 'string',
        label: 'Alert Description',
        defaultValue: 'This is an alert description.',
        group: 'Content',
      },
      showIcon: {
        type: 'boolean',
        label: 'Show Icon',
        defaultValue: true,
        group: 'Appearance'
      }
    },
    templateString: `
    <Alert variant="{{props.variant}}">
      {{#if props.showIcon}}
        <!-- Icon would be based on variant, e.g., Terminal for default, AlertTriangle for destructive -->
      {{/if}}
      <AlertTitle>{{props.title}}</AlertTitle>
      <AlertDescription>{{props.description}}</AlertDescription>
    </Alert>
    `.trim(),
  },
  {
    templateId: 'shadcn-avatar',
    suggestedId: 'shadcn-avatar-v1',
    type: 'ShadcnAvatar',
    displayName: 'Avatar (Shadcn)',
    description: 'An image element with a fallback for representing a user.',
    iconUrl: 'https://placehold.co/40x40.png?text=Avtr',
    tags: ['image', 'profile', 'shadcn'],
    configurablePropertiesSchema: {
      src: {
        type: 'string',
        label: 'Image Source URL',
        defaultValue: 'https://placehold.co/40x40.png',
        group: 'Content',
      },
      alt: {
        type: 'string',
        label: 'Image Alt Text',
        defaultValue: 'User Avatar',
        group: 'Content',
      },
      fallbackText: {
        type: 'string',
        label: 'Fallback Text (Initials)',
        defaultValue: 'U',
        group: 'Content',
      },
    },
    templateString: `
    <Avatar>
      <AvatarImage src="{{props.src}}" alt="{{props.alt}}" />
      <AvatarFallback>{{props.fallbackText}}</AvatarFallback>
    </Avatar>
    `.trim(),
  },
  {
    templateId: 'shadcn-badge',
    suggestedId: 'shadcn-badge-v1',
    type: 'ShadcnBadge',
    displayName: 'Badge (Shadcn)',
    description: 'Displays a badge or a tag.',
    iconUrl: 'https://placehold.co/40x40.png?text=Bdg',
    tags: ['display', 'tag', 'shadcn'],
    configurablePropertiesSchema: {
      text: {
        type: 'string',
        label: 'Badge Text',
        defaultValue: 'Badge',
        group: 'Content',
      },
      variant: {
        type: 'dropdown',
        label: 'Variant',
        options: ['default', 'secondary', 'destructive', 'outline'],
        defaultValue: 'default',
        group: 'Appearance',
      },
    },
    templateString: `
    <Badge variant="{{props.variant}}">{{props.text}}</Badge>
    `.trim(),
  },
  {
    templateId: 'shadcn-button',
    suggestedId: 'shadcn-button-v1',
    type: 'ShadcnButton',
    displayName: 'Button (Shadcn)',
    description: 'Interactive button element.',
    iconUrl: 'https://placehold.co/40x40.png?text=Btn',
    tags: ['action', 'interactive', 'shadcn'],
    configurablePropertiesSchema: {
      label: {
        type: 'string',
        label: 'Button Label',
        defaultValue: 'Click Me',
        group: 'Content',
      },
      variant: {
        type: 'dropdown',
        label: 'Variant',
        options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        defaultValue: 'default',
        group: 'Appearance',
      },
      size: {
        type: 'dropdown',
        label: 'Size',
        options: ['default', 'sm', 'lg', 'icon'],
        defaultValue: 'default',
        group: 'Appearance',
      },
      onClickAction: {
        type: 'string',
        label: 'On Click Action (e.g., event name, URL)',
        defaultValue: '',
        group: 'Behavior',
      },
    },
    templateString: `
    <Button variant="{{props.variant}}" size="{{props.size}}" onClick="{{props.onClickAction}}">
      {{props.label}}
    </Button>
    `.trim(),
  },
  {
    templateId: 'shadcn-calendar',
    suggestedId: 'shadcn-calendar-v1',
    type: 'ShadcnCalendar',
    displayName: 'Calendar (Shadcn)',
    description: 'A date picker component.',
    iconUrl: 'https://placehold.co/40x40.png?text=Cal',
    tags: ['date', 'input', 'picker', 'shadcn'],
    configurablePropertiesSchema: {
      mode: {
        type: 'dropdown',
        label: 'Mode',
        options: ['single', 'multiple', 'range'],
        defaultValue: 'single',
        group: 'Behavior',
      },
      selectedDate: {
        type: 'string', // Could be Date object in real renderer, but string for config
        label: 'Selected Date (YYYY-MM-DD)',
        defaultValue: '',
        group: 'Data',
      },
    },
    templateString: `
    <Calendar mode="{{props.mode}}" selected="{props.selectedDate}" />
    `.trim(),
  },
  {
    templateId: 'shadcn-card',
    suggestedId: 'shadcn-card-v1',
    type: 'ShadcnCard',
    displayName: 'Card (Shadcn)',
    description: 'A container for content sections.',
    iconUrl: 'https://placehold.co/40x40.png?text=Card',
    tags: ['layout', 'container', 'shadcn'],
    configurablePropertiesSchema: {
      title: { type: 'string', label: 'Card Title', defaultValue: '', group: 'Content' },
      description: { type: 'string', label: 'Card Description', defaultValue: '', group: 'Content' },
      content: { type: 'textarea', label: 'Card Content (HTML/Text)', defaultValue: 'Card content goes here.', group: 'Content'},
      footer: { type: 'string', label: 'Card Footer Text', defaultValue: '', group: 'Content' },
    },
    templateString: `
    <Card>
      <CardHeader>
        {{#if props.title}}<CardTitle>{{props.title}}</CardTitle>{{/if}}
        {{#if props.description}}<CardDescription>{{props.description}}</CardDescription>{{/if}}
      </CardHeader>
      <CardContent>{{{props.content}}}</CardContent>
      {{#if props.footer}}<CardFooter>{{props.footer}}</CardFooter>{{/if}}
    </Card>
    `.trim(),
  },
  {
    templateId: 'shadcn-checkbox',
    suggestedId: 'shadcn-checkbox-v1',
    type: 'ShadcnCheckbox',
    displayName: 'Checkbox (Shadcn)',
    description: 'A control that allows the user to toggle between checked and not checked.',
    iconUrl: 'https://placehold.co/40x40.png?text=Chk',
    tags: ['input', 'form', 'toggle', 'shadcn'],
    configurablePropertiesSchema: {
      label: {
        type: 'string',
        label: 'Label',
        defaultValue: 'Accept terms',
        group: 'Content',
      },
      checked: {
        type: 'boolean',
        label: 'Initially Checked',
        defaultValue: false,
        group: 'State',
      },
    },
    templateString: `
    <div class="items-top flex space-x-2">
      <Checkbox id="terms1" checked="{{props.checked}}" />
      <div class="grid gap-1.5 leading-none">
        <label for="terms1" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {{props.label}}
        </label>
      </div>
    </div>
    `.trim(),
  },
   {
    templateId: 'shadcn-dialog',
    suggestedId: 'shadcn-dialog-v1',
    type: 'ShadcnDialog',
    displayName: 'Dialog (Shadcn)',
    description: 'A window overlaid on either the primary window or another dialog window.',
    iconUrl: 'https://placehold.co/40x40.png?text=Dlg',
    tags: ['modal', 'interactive', 'overlay', 'shadcn'],
    configurablePropertiesSchema: {
      triggerText: { type: 'string', label: 'Trigger Button Text', defaultValue: 'Open Dialog', group: 'Trigger' },
      title: { type: 'string', label: 'Dialog Title', defaultValue: 'Dialog Title', group: 'Content' },
      description: { type: 'textarea', label: 'Dialog Description', defaultValue: 'Dialog description text.', group: 'Content' },
      content: { type: 'textarea', label: 'Dialog Main Content (HTML/Text)', defaultValue: '<p>Make changes to your profile here. Click save when you\'re done.</p>', group: 'Content' },
      saveText: { type: 'string', label: 'Save Button Text', defaultValue: 'Save changes', group: 'Actions' },
    },
    templateString: `
    <Dialog>
      <DialogTrigger asChild><Button variant="outline">{{props.triggerText}}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{props.title}}</DialogTitle>
          <DialogDescription>{{props.description}}</DialogDescription>
        </DialogHeader>
        <div class="py-4">{{{props.content}}}</div>
        <DialogFooter>
          <Button type="submit">{{props.saveText}}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    `.trim(),
  },
  {
    templateId: 'shadcn-dropdown-menu',
    suggestedId: 'shadcn-dropdown-menu-v1',
    type: 'ShadcnDropdownMenu',
    displayName: 'Dropdown Menu (Shadcn)',
    description: 'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
    iconUrl: 'https://placehold.co/40x40.png?text=Drop',
    tags: ['menu', 'interactive', 'navigation', 'shadcn'],
    configurablePropertiesSchema: {
      triggerText: { type: 'string', label: 'Trigger Button Text', defaultValue: 'Open Menu', group: 'Trigger' },
      // Items would ideally be an array of objects, simplified to JSON string for now
      itemsJson: {
        type: 'textarea',
        label: 'Menu Items (JSON Array)',
        defaultValue: '[{"label": "Profile", "isSeparator": false}, {"label": "Settings", "isSeparator": false}, {"label": "Logout", "isSeparator": false}]',
        group: 'Content',
        helperText: 'e.g., [{"label": "Item", "action": "eventName", "isSeparator": false}]'
      },
    },
    templateString: `
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">{{props.triggerText}}</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <!-- Items dynamically rendered from props.itemsJson -->
      </DropdownMenuContent>
    </DropdownMenu>
    `.trim(),
  },
  {
    templateId: 'shadcn-input',
    suggestedId: 'shadcn-input-v1',
    type: 'ShadcnInput',
    displayName: 'Input Field (Shadcn)',
    description: 'A standard text input field.',
    iconUrl: 'https://placehold.co/40x40.png?text=Inpt',
    tags: ['form', 'input', 'shadcn'],
    configurablePropertiesSchema: {
      type: { type: 'dropdown', label: 'Input Type', options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'], defaultValue: 'text', group: 'Behavior' },
      placeholder: { type: 'string', label: 'Placeholder', defaultValue: 'Enter text...', group: 'Appearance' },
      label: { type: 'string', label: 'Label (optional)', defaultValue: '', group: 'Appearance' },
      valuePath: { type: 'string', label: 'Data Path for Value', defaultValue: '', helperText: 'e.g., userData.name', group: 'Data' },
    },
    templateString: `
    <div>
      {{#if props.label}}<Label htmlFor="input-id">{{props.label}}</Label>{{/if}}
      <Input type="{{props.type}}" placeholder="{{props.placeholder}}" value="{{data[props.valuePath]}}" id="input-id" />
    </div>
    `.trim(),
  },
  {
    templateId: 'shadcn-label',
    suggestedId: 'shadcn-label-v1',
    type: 'ShadcnLabel',
    displayName: 'Label (Shadcn)',
    description: 'Renders an accessible label associated with controls.',
    iconUrl: 'https://placehold.co/40x40.png?text=Lbl',
    tags: ['form', 'text', 'accessibility', 'shadcn'],
    configurablePropertiesSchema: {
      text: { type: 'string', label: 'Label Text', defaultValue: 'Your Label', group: 'Content' },
      htmlFor: { type: 'string', label: 'Associate with (Input ID)', defaultValue: '', group: 'Behavior' },
    },
    templateString: `
    <Label htmlFor="{{props.htmlFor}}">{{props.text}}</Label>
    `.trim(),
  },
  {
    templateId: 'shadcn-menubar',
    suggestedId: 'shadcn-menubar-v1',
    type: 'ShadcnMenubar',
    displayName: 'Menubar (Shadcn)',
    description: 'A visually persistent menu common in desktop applications.',
    iconUrl: 'https://placehold.co/40x40.png?text=MBar',
    tags: ['navigation', 'menu', 'desktop', 'shadcn'],
    configurablePropertiesSchema: {
      // Menubar structure is complex, usually defined by nested menu items
      menusJson: {
        type: 'textarea',
        label: 'Menus Structure (JSON)',
        defaultValue: '[{"label": "File", "items": [{"label": "New"}, {"label": "Open"}]}, {"label": "Edit", "items": [{"label": "Cut"}, {"label": "Copy"}]}]',
        group: 'Content',
        helperText: 'Complex nested JSON representing menus and items.'
      }
    },
    templateString: `
    <Menubar> <!-- Dynamically generated MenubarMenu, MenubarItem etc. from props.menusJson --></Menubar>
    `.trim(),
  },
  {
    templateId: 'shadcn-popover',
    suggestedId: 'shadcn-popover-v1',
    type: 'ShadcnPopover',
    displayName: 'Popover (Shadcn)',
    description: 'Displays rich content in a portal, triggered by a button.',
    iconUrl: 'https://placehold.co/40x40.png?text=Pop',
    tags: ['overlay', 'interactive', 'display', 'shadcn'],
    configurablePropertiesSchema: {
      triggerText: { type: 'string', label: 'Trigger Button Text', defaultValue: 'Open Popover', group: 'Trigger' },
      content: { type: 'textarea', label: 'Popover Content (HTML/Text)', defaultValue: 'Popover content goes here.', group: 'Content' },
    },
    templateString: `
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">{{props.triggerText}}</Button></PopoverTrigger>
      <PopoverContent>{{{props.content}}}</PopoverContent>
    </Popover>
    `.trim(),
  },
  {
    templateId: 'shadcn-progress',
    suggestedId: 'shadcn-progress-v1',
    type: 'ShadcnProgress',
    displayName: 'Progress Bar (Shadcn)',
    description: 'Displays an indicator showing the completion progress of a task.',
    iconUrl: 'https://placehold.co/40x40.png?text=Prog',
    tags: ['display', 'indicator', 'shadcn'],
    configurablePropertiesSchema: {
      value: { type: 'number', label: 'Progress Value (0-100)', defaultValue: 50, min:0, max:100, group: 'Data' },
    },
    templateString: `
    <Progress value="{{props.value}}" />
    `.trim(),
  },
  {
    templateId: 'shadcn-radio-group',
    suggestedId: 'shadcn-radio-group-v1',
    type: 'ShadcnRadioGroup',
    displayName: 'Radio Group (Shadcn)',
    description: 'A set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.',
    iconUrl: 'https://placehold.co/40x40.png?text=Rad',
    tags: ['form', 'input', 'selection', 'shadcn'],
    configurablePropertiesSchema: {
      defaultValue: { type: 'string', label: 'Default Value', defaultValue: 'option-one', group: 'Data' },
      itemsJson: {
        type: 'textarea',
        label: 'Radio Items (JSON Array)',
        defaultValue: '[{"value": "option-one", "label": "Option One"}, {"value": "option-two", "label": "Option Two"}]',
        group: 'Content',
        helperText: 'e.g., [{"value": "val", "label": "Label"}]'
      },
    },
    templateString: `
    <RadioGroup defaultValue="{{props.defaultValue}}">
      <!-- Items dynamically rendered from props.itemsJson -->
    </RadioGroup>
    `.trim(),
  },
  {
    templateId: 'shadcn-scroll-area',
    suggestedId: 'shadcn-scroll-area-v1',
    type: 'ShadcnScrollArea',
    displayName: 'Scroll Area (Shadcn)',
    description: 'Augments native scroll functionality for custom styling.',
    iconUrl: 'https://placehold.co/40x40.png?text=Scrl',
    tags: ['layout', 'utility', 'shadcn'],
    configurablePropertiesSchema: {
      height: { type: 'string', label: 'Height (e.g., 200px, 50vh)', defaultValue: '200px', group: 'Appearance' },
      // Content would be children in a real component
      contentPlaceholder: { type: 'textarea', label: 'Content Placeholder', defaultValue: 'Scrollable content here...', group: 'Content' },
    },
    templateString: `
    <ScrollArea style="height: {{props.height}};">{{{props.contentPlaceholder}}}</ScrollArea>
    `.trim(),
  },
  {
    templateId: 'shadcn-select',
    suggestedId: 'shadcn-select-v1',
    type: 'ShadcnSelect',
    displayName: 'Select (Shadcn)',
    description: 'Displays a list of options for the user to pick from—triggered by a button.',
    iconUrl: 'https://placehold.co/40x40.png?text=Sel',
    tags: ['form', 'input', 'dropdown', 'shadcn'],
    configurablePropertiesSchema: {
      placeholder: { type: 'string', label: 'Placeholder', defaultValue: 'Select an option', group: 'Appearance' },
      itemsJson: {
        type: 'textarea',
        label: 'Select Items (JSON Array)',
        defaultValue: '[{"value": "item1", "label": "Item 1"}, {"value": "item2", "label": "Item 2"}]',
        group: 'Content',
        helperText: 'e.g., [{"value": "val", "label": "Label"}]'
      },
      valuePath: { type: 'string', label: 'Data Path for Value', defaultValue: '', group: 'Data' },
    },
    templateString: `
    <Select value="{{data[props.valuePath]}}">
      <SelectTrigger><SelectValue placeholder="{{props.placeholder}}" /></SelectTrigger>
      <SelectContent> <!-- Items dynamically rendered from props.itemsJson --> </SelectContent>
    </Select>
    `.trim(),
  },
  {
    templateId: 'shadcn-separator',
    suggestedId: 'shadcn-separator-v1',
    type: 'ShadcnSeparator',
    displayName: 'Separator (Shadcn)',
    description: 'Visually or semantically separates content.',
    iconUrl: 'https://placehold.co/40x40.png?text=Sep',
    tags: ['layout', 'utility', 'shadcn'],
    configurablePropertiesSchema: {
      orientation: { type: 'dropdown', label: 'Orientation', options: ['horizontal', 'vertical'], defaultValue: 'horizontal', group: 'Appearance' },
    },
    templateString: `
    <Separator orientation="{{props.orientation}}" />
    `.trim(),
  },
  {
    templateId: 'shadcn-sheet',
    suggestedId: 'shadcn-sheet-v1',
    type: 'ShadcnSheet',
    displayName: 'Sheet (Shadcn)',
    description: 'Extends the Dialog component to display content that complements the main content of the screen.',
    iconUrl: 'https://placehold.co/40x40.png?text=Sht',
    tags: ['overlay', 'panel', 'interactive', 'shadcn'],
    configurablePropertiesSchema: {
      triggerText: { type: 'string', label: 'Trigger Button Text', defaultValue: 'Open Sheet', group: 'Trigger' },
      side: { type: 'dropdown', label: 'Side', options: ['top', 'bottom', 'left', 'right'], defaultValue: 'right', group: 'Appearance'},
      title: { type: 'string', label: 'Sheet Title', defaultValue: 'Sheet Title', group: 'Content' },
      description: { type: 'string', label: 'Sheet Description', defaultValue: 'Sheet description.', group: 'Content' },
      content: { type: 'textarea', label: 'Sheet Content (HTML/Text)', defaultValue: '<p>Sheet content goes here.</p>', group: 'Content' },
    },
    templateString: `
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">{{props.triggerText}}</Button></SheetTrigger>
      <SheetContent side="{{props.side}}">
        <SheetHeader>
          <SheetTitle>{{props.title}}</SheetTitle>
          <SheetDescription>{{props.description}}</SheetDescription>
        </SheetHeader>
        <div class="py-4">{{{props.content}}}</div>
      </SheetContent>
    </Sheet>
    `.trim(),
  },
  {
    templateId: 'shadcn-skeleton',
    suggestedId: 'shadcn-skeleton-v1',
    type: 'ShadcnSkeleton',
    displayName: 'Skeleton (Shadcn)',
    description: 'Use to show a placeholder while content is loading.',
    iconUrl: 'https://placehold.co/40x40.png?text=Skel',
    tags: ['loading', 'placeholder', 'utility', 'shadcn'],
    configurablePropertiesSchema: {
      width: { type: 'string', label: 'Width (e.g., 100px, 100%)', defaultValue: '100px', group: 'Appearance' },
      height: { type: 'string', label: 'Height (e.g., 20px, 1rem)', defaultValue: '20px', group: 'Appearance' },
      borderRadius: { type: 'string', label: 'Border Radius (e.g., 4px, 0.25rem)', defaultValue: '4px', group: 'Appearance' },
    },
    templateString: `
    <Skeleton style="width: {{props.width}}; height: {{props.height}}; border-radius: {{props.borderRadius}};" />
    `.trim(),
  },
  {
    templateId: 'shadcn-slider',
    suggestedId: 'shadcn-slider-v1',
    type: 'ShadcnSlider',
    displayName: 'Slider (Shadcn)',
    description: 'An input where the user selects a value from within a given range.',
    iconUrl: 'https://placehold.co/40x40.png?text=Sldr',
    tags: ['form', 'input', 'range', 'shadcn'],
    configurablePropertiesSchema: {
      defaultValue: { type: 'number', label: 'Default Value', defaultValue: 50, group: 'Data' },
      min: { type: 'number', label: 'Min Value', defaultValue: 0, group: 'Behavior' },
      max: { type: 'number', label: 'Max Value', defaultValue: 100, group: 'Behavior' },
      step: { type: 'number', label: 'Step Value', defaultValue: 1, group: 'Behavior' },
    },
    templateString: `
    <Slider defaultValue={[props.defaultValue]} min="{{props.min}}" max="{{props.max}}" step="{{props.step}}" />
    `.trim(),
  },
  {
    templateId: 'shadcn-switch',
    suggestedId: 'shadcn-switch-v1',
    type: 'ShadcnSwitch',
    displayName: 'Switch (Shadcn)',
    description: 'A control that allows the user to toggle between checked and not checked.',
    iconUrl: 'https://placehold.co/40x40.png?text=Swch',
    tags: ['form', 'input', 'toggle', 'shadcn'],
    configurablePropertiesSchema: {
      label: { type: 'string', label: 'Label', defaultValue: 'Toggle me', group: 'Content' },
      checked: { type: 'boolean', label: 'Initially Checked', defaultValue: false, group: 'State' },
    },
    templateString: `
    <div class="flex items-center space-x-2">
      <Switch id="switch-id" checked="{{props.checked}}" />
      <Label htmlFor="switch-id">{{props.label}}</Label>
    </div>
    `.trim(),
  },
  {
    templateId: 'shadcn-table',
    suggestedId: 'shadcn-table-v1',
    type: 'ShadcnTable',
    displayName: 'Table (Shadcn)',
    description: 'A responsive table component.',
    iconUrl: 'https://placehold.co/40x40.png?text=Tbl',
    tags: ['display', 'data', 'layout', 'shadcn'],
    configurablePropertiesSchema: {
      caption: { type: 'string', label: 'Table Caption', defaultValue: '', group: 'Content' },
      headersJson: {
        type: 'textarea',
        label: 'Table Headers (JSON Array of strings)',
        defaultValue: '["Header 1", "Header 2", "Header 3"]',
        group: 'Content',
      },
      rowsJson: {
        type: 'textarea',
        label: 'Table Rows (JSON Array of arrays)',
        defaultValue: '[["Cell 1.1", "Cell 1.2", "Cell 1.3"], ["Cell 2.1", "Cell 2.2", "Cell 2.3"]]',
        group: 'Data',
        helperText: 'Array of arrays, e.g., [["r1c1", "r1c2"], ["r2c1", "r2c2"]]',
      },
    },
    templateString: `
    <Table>
      {{#if props.caption}}<TableCaption>{{props.caption}}</TableCaption>{{/if}}
      <TableHeader> <!-- Headers from props.headersJson --> </TableHeader>
      <TableBody> <!-- Rows from props.rowsJson --> </TableBody>
    </Table>
    `.trim(),
  },
  {
    templateId: 'shadcn-tabs',
    suggestedId: 'shadcn-tabs-v1',
    type: 'ShadcnTabs',
    displayName: 'Tabs (Shadcn)',
    description: 'A set of layered sections of content, known as tab panels, that are displayed one at a time.',
    iconUrl: 'https://placehold.co/40x40.png?text=Tabs',
    tags: ['layout', 'navigation', 'interactive', 'shadcn'],
    configurablePropertiesSchema: {
      defaultValue: { type: 'string', label: 'Default Tab Value', defaultValue: 'tab1', group: 'Behavior' },
      tabsJson: {
        type: 'textarea',
        label: 'Tabs (JSON Array)',
        defaultValue: '[{"value": "tab1", "trigger": "Tab 1", "content": "Content for Tab 1"}, {"value": "tab2", "trigger": "Tab 2", "content": "Content for Tab 2"}]',
        group: 'Content',
        helperText: 'e.g., [{"value": "val", "trigger": "Trigger Text", "content": "Content Text"}]'
      },
    },
    templateString: `
    <Tabs defaultValue="{{props.defaultValue}}">
      <TabsList> <!-- Triggers from props.tabsJson --> </TabsList>
      <!-- Content panels from props.tabsJson -->
    </Tabs>
    `.trim(),
  },
  {
    templateId: 'shadcn-textarea',
    suggestedId: 'shadcn-textarea-v1',
    type: 'ShadcnTextarea',
    displayName: 'Textarea (Shadcn)',
    description: 'A multi-line text input field.',
    iconUrl: 'https://placehold.co/40x40.png?text=TxtA',
    tags: ['form', 'input', 'shadcn'],
    configurablePropertiesSchema: {
      placeholder: { type: 'string', label: 'Placeholder', defaultValue: 'Enter more text...', group: 'Appearance' },
      label: { type: 'string', label: 'Label (optional)', defaultValue: '', group: 'Appearance' },
      rows: { type: 'number', label: 'Rows', defaultValue: 3, group: 'Appearance' },
      valuePath: { type: 'string', label: 'Data Path for Value', defaultValue: '', group: 'Data' },
    },
    templateString: `
    <div>
      {{#if props.label}}<Label htmlFor="textarea-id">{{props.label}}</Label>{{/if}}
      <Textarea placeholder="{{props.placeholder}}" rows="{{props.rows}}" value="{{data[props.valuePath]}}" id="textarea-id" />
    </div>
    `.trim(),
  },
  {
    templateId: 'shadcn-tooltip',
    suggestedId: 'shadcn-tooltip-v1',
    type: 'ShadcnTooltip',
    displayName: 'Tooltip (Shadcn)',
    description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    iconUrl: 'https://placehold.co/40x40.png?text=Tip',
    tags: ['display', 'interactive', 'utility', 'shadcn'],
    configurablePropertiesSchema: {
      triggerText: { type: 'string', label: 'Trigger Element Text/Content', defaultValue: 'Hover Me', group: 'Trigger' },
      tooltipText: { type: 'string', label: 'Tooltip Text', defaultValue: 'This is a tooltip!', group: 'Content' },
      side: { type: 'dropdown', label: 'Side', options: ['top', 'bottom', 'left', 'right'], defaultValue: 'top', group: 'Appearance'},
    },
    templateString: `
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Button variant="outline">{{props.triggerText}}</Button></TooltipTrigger>
        <TooltipContent side="{{props.side}}"><p>{{props.tooltipText}}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
    `.trim(),
  },
];

