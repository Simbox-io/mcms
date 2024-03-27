# NavigationMenu Component

The `NavigationMenu` component is a reusable React component that renders a navigation menu with a toggle button and a list of navigation items. It supports animations using the Framer Motion library.

## Props

The `NavigationMenu` component accepts the following props:

| Prop Name   | Type              | Default | Description                                           |
|-------------|-------------------|---------|-------------------------------------------------------|
| `items`     | `NavigationItem[]` | -       | An array of navigation items to be displayed in the menu. |
| `className` | `string`          | `''`    | Additional CSS class name(s) to be applied to the navigation menu. |

The `NavigationItem` interface is defined as follows:

```typescript
interface NavigationItem {
  label: string;
  href: string;
}
```

- `label`: The text label for the navigation item.
- `href`: The URL or path to navigate to when the item is clicked.

## Usage

To use the `NavigationMenu` component in your React application, follow these steps:

1. Import the `NavigationMenu` component into your file:

```tsx
import NavigationMenu from './NavigationMenu';
```

2. Define an array of navigation items:

```tsx
const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
```

3. Render the `NavigationMenu` component with the desired props:

```tsx
<NavigationMenu items={navigationItems} className="my-navigation-menu" />
```

## Functionality

The `NavigationMenu` component provides the following functionality:

- Displays a toggle button that opens and closes the navigation menu when clicked.
- Renders a list of navigation items based on the provided `items` prop.
- Highlights the active navigation item based on the current URL path.
- Animates the opening and closing of the navigation menu using Framer Motion.

## Styling

The `NavigationMenu` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the navigation menu. The appearance of the navigation menu can be customized by providing additional CSS classes via the `className` prop.

The component also applies conditional styling to the navigation items based on the current URL path, highlighting the active item with a different background color.

## Animation

The `NavigationMenu` component utilizes the Framer Motion library to animate the opening and closing of the navigation menu. When the menu is toggled open, it animates the opacity and vertical position of the menu items. When the menu is closed, it animates the opacity and vertical position of the menu items in reverse.

The animation duration and easing can be customized by modifying the `transition` prop of the `motion.ul` component.

## Dependencies

The `NavigationMenu` component has the following dependencies:

- `react`: The React library for building user interfaces.
- `next/link`: The Next.js `Link` component for client-side navigation.
- `next/navigation`: The Next.js `usePathname` hook for accessing the current URL path.
- `framer-motion`: The Framer Motion library for animating the navigation menu.

Make sure to install these dependencies in your project before using the `NavigationMenu` component.