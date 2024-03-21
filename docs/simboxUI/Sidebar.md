# Sidebar Component

The `Sidebar` component is a reusable React component that displays a sidebar navigation menu with customizable items, active item highlighting, and responsive behavior.

## Props

The `Sidebar` component accepts the following props:

| Prop Name      | Type                                      | Description                                                 |
|----------------|-------------------------------------------|-------------------------------------------------------------|
| `items`        | `SidebarItem[]`                           | An array of sidebar items to be displayed.                  |
| `activeItem`   | `string`                                  | The ID of the currently active sidebar item.                |
| `onItemClick`  | `(itemId: string) => void`                | A callback function to be invoked when a sidebar item is clicked. |

The `SidebarItem` interface defines the structure of each sidebar item:

| Property | Type              | Description                                                 |
|----------|------------------|-------------------------------------------------------------|
| `id`     | `string`         | The unique identifier of the sidebar item.                  |
| `label`  | `string`         | The label text to be displayed for the sidebar item.        |
| `icon`   | `React.ReactNode` | (Optional) The icon to be displayed alongside the label.    |
| `link`   | `string`         | (Optional) The URL or path to navigate to when the item is clicked. |

## Usage

To use the `Sidebar` component in your React application, follow these steps:

1. Import the `Sidebar` component into your file:

```tsx
import Sidebar from './Sidebar';
```

2. Define an array of sidebar items with the desired properties:

```tsx
const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: <HomeIcon />, link: '/' },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  // ...
];
```

3. Render the `Sidebar` component with the required props:

```tsx
<Sidebar
  items={sidebarItems}
  activeItem={activeItemId}
  onItemClick={handleItemClick}
/>
```

4. Implement the `onItemClick` callback function to handle the click event when a sidebar item is clicked:

```tsx
const handleItemClick = (itemId: string) => {
  // Handle the click event based on the itemId
  // ...
};
```

## Responsive Behavior

The `Sidebar` component adapts its layout based on the screen size:

- On larger screens (lg breakpoint and above), the sidebar is displayed as a fixed vertical navigation menu.
- On smaller screens, the sidebar is displayed as a horizontal scrollable menu with left and right scroll indicators.

The scroll indicators appear when there are more items than can fit within the visible area of the scrollable menu. Clicking on the indicators scrolls the menu to the start or end, respectively.

## Styling

The `Sidebar` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the sidebar and its items. The appearance of the sidebar and items can be customized by modifying the CSS classes applied to the elements.

The active item is highlighted with a different background color to indicate the currently selected item.

## Accessibility

The `Sidebar` component ensures accessibility by using appropriate HTML elements and attributes:

- The sidebar items are rendered as `<li>` elements within a `<ul>` list.
- If an item has a `link` property, it is rendered as an `<a>` element with an `href` attribute.
- If an item does not have a `link` property, it is rendered as a `<button>` element with an `onClick` event handler.

## Performance

To optimize performance, the `Sidebar` component uses the `useRef` and `useEffect` hooks to manage the scroll container and event listeners. The scroll event listener is attached only once when the component mounts and is cleaned up when the component unmounts.

The `useState` hook is used to manage the visibility of the scroll indicators based on the scroll position of the container.