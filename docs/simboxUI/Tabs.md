# Tabs Component

The `Tabs` component is a reusable React component that displays a set of tabs with customizable content, labels, icons, and counts. It allows users to switch between different tabs and view the corresponding content.

## Props

The `Tabs` component accepts the following props:

| Prop Name   | Type                 | Default | Description                                                 |
|-------------|----------------------|---------|-------------------------------------------------------------|
| `tabs`      | `Tab[]`              | -       | An array of tab objects that define the tabs to be displayed. |
| `className` | `string`             | `''`    | Additional CSS class name(s) to be applied to the tabs container. |

The `Tab` interface defines the structure of each tab object:

| Property   | Type              | Description                                                 |
|------------|-------------------|-------------------------------------------------------------|
| `id`       | `string`          | A unique identifier for the tab.                            |
| `label`    | `string`          | The label text to be displayed for the tab.                 |
| `icon`     | `React.ReactNode` | (Optional) An icon to be displayed alongside the tab label. |
| `content`  | `React.ReactNode` | The content to be rendered when the tab is active.          |
| `count`    | `number`          | (Optional) A count value to be displayed next to the tab label. |

## Usage

To use the `Tabs` component in your React application, follow these steps:

1. Import the `Tabs` component into your file:

```jsx
import Tabs from './Tabs';
```

2. Define an array of tab objects that represent the tabs you want to display:

```jsx
const tabsData = [
  {
    id: 'tab1',
    label: 'Tab 1',
    icon: <Icon1 />,
    content: <div>Content for Tab 1</div>,
    count: 5,
  },
  {
    id: 'tab2',
    label: 'Tab 2',
    content: <div>Content for Tab 2</div>,
  },
  // Add more tab objects as needed
];
```

3. Render the `Tabs` component with the `tabs` prop:

```jsx
<Tabs tabs={tabsData} />
```

4. Optionally, you can provide a `className` prop to apply additional CSS classes to the tabs container.

## Functionality

The `Tabs` component provides the following functionality:

- Displays a set of tabs based on the provided `tabs` prop.
- Allows users to switch between tabs by clicking on the tab labels.
- Highlights the active tab with a blue color and an animated underline.
- Renders the content of the active tab below the tab labels.
- Supports optional icons and count values for each tab.

## Styling

The `Tabs` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the tabs and their content. The appearance of the tabs can be customized by modifying the CSS classes or providing additional styles through the `className` prop.

The active tab is highlighted with a blue color (`text-blue-500` for light mode and `text-blue-400` for dark mode) and an animated underline using the `motion.div` component from the `framer-motion` library.

## State Management

The `Tabs` component manages the following state:

- `activeTab`: Represents the currently active tab. It is initialized with the `id` of the first tab in the `tabs` array and can be updated when a tab is clicked.
- `lineWidth` and `lineLeft`: Represent the width and left position of the animated underline. They are updated whenever the active tab changes to match the dimensions of the active tab label.

The component uses the `useRef` hook to create an array of references to the tab label elements, which allows accessing their dimensions for positioning the animated underline.

## Accessibility

The `Tabs` component uses semantic HTML elements and follows accessibility best practices:

- The tab labels are rendered as `<button>` elements to ensure keyboard accessibility and proper focus management.
- The `aria-selected` attribute is used to indicate the currently selected tab.
- The tab content is rendered in a separate `<div>` element below the tab labels, allowing for clear separation of content and navigation.