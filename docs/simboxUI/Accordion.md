# Accordion Component

The `Accordion` component is a reusable React component that displays a list of collapsible items. Each item consists of a title and content section, which can be expanded or collapsed by clicking on the title. The component supports customization options such as default active item, allowing multiple items to be open simultaneously, and custom styling.

## Props

The `Accordion` component accepts the following props:

| Prop Name               | Type                     | Default     | Description                                                                                                                         |
|-------------------------|--------------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `items`                 | `AccordionItem[]`        | -           | An array of objects representing the accordion items. Each item should have an `id`, `title`, `content`, and optional `disabled` and `icon` properties. |
| `defaultActiveId`       | `string`                 | -           | The ID of the item that should be initially open.                                                                                   |
| `onItemClick`           | `(itemId: string) => void` | -           | A callback function to be invoked when an accordion item is clicked. It receives the clicked item's ID as an argument.               |
| `allowMultiple`         | `boolean`                | `false`     | Determines whether multiple items can be open simultaneously.                                                                       |
| `className`             | `string`                 | `''`        | Additional CSS class name(s) to be applied to the accordion container.                                                              |
| `style`                 | `React.CSSProperties`    | -           | Custom inline styles to be applied to the accordion container.                                                                      |
| `itemClassName`         | `string`                 | `''`        | Additional CSS class name(s) to be applied to each accordion item.                                                                  |
| `titleClassName`        | `string`                 | `''`        | Additional CSS class name(s) to be applied to the title of each accordion item.                                                     |
| `contentClassName`      | `string`                 | `''`        | Additional CSS class name(s) to be applied to the content of each accordion item.                                                   |
| `iconClassName`         | `string`                 | `''`        | Additional CSS class name(s) to be applied to the icon of each accordion item.                                                      |
| `activeTitleClassName`  | `string`                 | `''`        | Additional CSS class name(s) to be applied to the title of an active accordion item.                                                |
| `activeContentClassName`| `string`                 | `''`        | Additional CSS class name(s) to be applied to the content of an active accordion item.                                              |

## Usage

To use the `Accordion` component in your React application, follow these steps:

1. Import the `Accordion` component into your file:

```jsx
import Accordion from './Accordion';
```

2. Define an array of `AccordionItem` objects representing the items to be displayed in the accordion:

```jsx
const items: AccordionItem[] = [
  {
    id: '1',
    title: 'Item 1',
    content: <p>Content for Item 1</p>,
  },
  {
    id: '2',
    title: 'Item 2',
    content: <p>Content for Item 2</p>,
    disabled: true,
  },
  // Add more items as needed
];
```

3. Render the `Accordion` component with the desired props:

```jsx
<Accordion
  items={items}
  defaultActiveId="1"
  onItemClick={(itemId) => console.log(`Clicked item with ID: ${itemId}`)}
  allowMultiple
  className="custom-accordion"
/>
```

4. Customize the appearance and behavior of the accordion by providing different prop values and CSS classes.

## Styling

The `Accordion` component uses CSS classes to style the accordion container, items, titles, content, and icons. You can provide custom CSS classes using the `className`, `itemClassName`, `titleClassName`, `contentClassName`, `iconClassName`, `activeTitleClassName`, and `activeContentClassName` props to override the default styles.

The component also supports inline styles using the `style` prop, which can be used to apply custom styles to the accordion container.

## Animation

The `Accordion` component utilizes the `framer-motion` library to add animations when expanding and collapsing items. The items fade in and slide down when expanded, and fade out and slide up when collapsed. The animation duration is set to 0.3 seconds.

## Icon Support

The `Accordion` component supports displaying an icon next to the title of each item. To include an icon, provide the icon element as the `icon` property of the corresponding `AccordionItem` object.

The component uses a default `ChevronDownIcon` component to indicate the expanded/collapsed state of each item. The icon rotates 180 degrees when an item is expanded.