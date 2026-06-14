import classNames from 'classnames'
import {
  Accordion,
  Select,
  AlertDialog,
  NavigationMenu,
  Popover,
  Checkbox,
  Button,
  Stepper,
  useSize,
} from '../../src'

export const SandboxPage = () => {
  const { size } = useSize()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-color12">Component Sandbox</h2>
        <p className="text-color10">Explore all components freely</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Navigation Menu */}
        <div
          className={classNames(
            'bg-color4 z-10 w-fit h-fit backdrop-blur-sm rounded-xl p-6',
            size === '4' && 'col-span-2 xl:col-span-1',
          )}
        >
          <h2 className="text-color11 text-xl font-semibold mb-4">Navigation Menu</h2>
          <NavigationMenu
            items={[
              {
                title: 'Products',
                item: [
                  {
                    type: 'card',
                    title: 'Featured',
                    href: '#',
                    text: 'Our main product offering',
                  },
                  {
                    type: 'text',
                    title: 'Components',
                    href: '#',
                    text: 'UI building blocks',
                  },
                  {
                    type: 'text',
                    title: 'Themes',
                    href: '#',
                    text: 'Color and styling options',
                  },
                ],
              },
              {
                title: 'Docs',
                item: [
                  {
                    type: 'text',
                    title: 'Getting Started',
                    href: '#',
                    text: 'Quick start guide',
                  },
                  {
                    type: 'text',
                    title: 'API Reference',
                    href: '#',
                    text: 'Component documentation',
                  },
                ],
              },
              { title: 'GitHub', href: 'https://github.com/andre-gra/oryx-ui' },
            ]}
          />
        </div>

        {/* Accordion */}
        <div
          className={classNames(
            'bg-color4 w-fit backdrop-blur-sm rounded-xl p-6',
            size === '4' && 'col-span-2 lg:col-span-1',
          )}
        >
          <h2 className="text-color11 text-xl font-semibold mb-4">Accordion</h2>
          <Accordion
            items={[
              {
                mainText: 'Is it accessible?',
                collapsibleText: 'Yes. It adheres to the WAI-ARIA design pattern.',
              },
              {
                mainText: 'Is it styled?',
                collapsibleText: 'Yes. It uses the Oryx UI theming system.',
              },
              {
                mainText: 'Can it animate?',
                collapsibleText: 'Yes. Built-in slide animations are included.',
              },
            ]}
          />
        </div>

        {/* Select */}
        <div
          className={classNames(
            'bg-color4 w-fit backdrop-blur-sm rounded-xl p-6',
            size === '4' && 'col-span-2 lg:col-span-1',
          )}
        >
          <h2 className="text-color11 text-xl font-semibold mb-4">Select</h2>
          <Select
            label="Choose a fruit"
            placeholder="Select fruit..."
            options={[
              {
                label: 'Fruits',
                group: [
                  { value: 'apple', label: 'Apple' },
                  { value: 'banana', label: 'Banana' },
                  { value: 'orange', label: 'Orange' },
                ],
              },
              {
                label: 'Vegetables',
                group: [
                  { value: 'carrot', label: 'Carrot' },
                  { value: 'broccoli', label: 'Broccoli' },
                ],
              },
            ]}
            onValueChange={(value) => console.log('Selected:', value)}
          />
        </div>

        {/* AlertDialog */}
        <div
          className={classNames(
            'bg-color4 w-fit backdrop-blur-sm rounded-xl p-6',
            size === '4' && 'col-span-2 lg:col-span-1',
          )}
        >
          <h2 className="text-color11 text-xl font-semibold mb-4">Alert Dialog</h2>
          <AlertDialog
            texts={{
              buttonTrigger: 'Delete Account',
              content: 'Are you sure?',
              description:
                'This action cannot be undone. Your account will be permanently deleted.',
              buttonCancel: 'Cancel',
              action: 'Yes, Delete',
            }}
            onAction={() => console.log('Deleted!')}
            onCancel={() => console.log('Cancelled')}
          />
        </div>

        {/* Checkbox */}
        <div
          className={classNames(
            'bg-color4 w-fit backdrop-blur-sm rounded-xl p-6',
            size === '4' && 'col-span-2 lg:col-span-1',
          )}
        >
          <h2 className="text-color11 text-xl font-semibold mb-4">Checkbox</h2>
          <div className="space-y-3">
            <Checkbox
              label="Accept terms and conditions"
              onCheckedChange={(checked) => console.log('Terms:', checked)}
            />
            <Checkbox
              label="Subscribe to newsletter"
              checked
              onCheckedChange={(checked) => console.log('Newsletter:', checked)}
            />
            <Checkbox
              label="Enable notifications"
              indeterminate
              onCheckedChange={(checked) => console.log('Notifications:', checked)}
            />
            <Checkbox
              label="Premium feature"
              disabled
              onCheckedChange={(checked) => console.log('Premium:', checked)}
            />
            <Checkbox
              label="Required field"
              required
              onCheckedChange={(checked) => console.log('Required:', checked)}
            />
          </div>
        </div>

        {/* Popover */}
        <div
          className={classNames(
            'bg-color4 w-fit backdrop-blur-sm rounded-xl p-6',
            size === '4' && 'col-span-2 lg:col-span-1',
          )}
        >
          <h2 className="text-color11 text-xl font-semibold mb-4">Popover</h2>
          <Popover
            buttonTriggerLabel="Open settings"
            fields={[
              {
                fieldTitle: 'Dimensions',
                field: [
                  {
                    label: 'Width',
                    htmlFor: 'width',
                    id: 'width',
                    defaultValue: '100%',
                  },
                  {
                    label: 'Height',
                    htmlFor: 'height',
                    id: 'height',
                    defaultValue: 'auto',
                  },
                ],
              },
            ]}
          />
        </div>

        {/* Button */}
        <div
          className={classNames(
            'bg-color4 w-fit backdrop-blur-sm rounded-xl p-6',
            size === '4' && 'col-span-2 lg:col-span-1',
          )}
        >
          <h2 className="text-color11 text-xl font-semibold mb-4">Button</h2>
          <div className="space-y-3">
            <Button variant="primary">Primary</Button>
            <div className="h-2" />
            <Button variant="secondary">Secondary</Button>
            <div className="h-2" />
            <Button variant="ghost">Ghost</Button>
            <div className="h-2" />
            <Button variant="outline">Outline</Button>
            <div className="h-2" />
            <Button loading>Loading</Button>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-color4 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-color11 text-xl font-semibold mb-4">Stepper</h2>
        <Stepper
          steps={[
            { label: 'Ideation', description: 'Pick a market' },
            { label: 'Setup', description: 'Plan features' },
            { label: 'Navigation', description: 'Structure app' },
            { label: 'Decisions', description: 'Confirm choices' },
            { label: 'Refinement', description: 'Polish' },
            { label: 'Launch', description: 'Go live' },
          ]}
          currentStep={2}
        />
      </div>
    </div>
  )
}
