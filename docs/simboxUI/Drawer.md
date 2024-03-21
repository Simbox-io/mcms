# Drawer Component

The `Drawer` component is a reusable React component that displays a drawer with customizable content, position, size, and overlay. It uses the `framer-motion` library for animations.

## Props

The `Drawer` component accepts the following props:

| Prop Name   | Type                                       | Default   | Description                                                    |
|-------------|-------------------------------------------|-----------|----------------------------------------------------------------|
| `isOpen`    | `boolean`                                 | -         | Determines whether the drawer is open or closed.               |
| `onClose`   | `() => void`                              | -         | A callback function to be invoked when the drawer is closed.   |
| `children`  | `React.ReactNode`                         | -         | The content to be displayed inside the drawer.                 |
| `position`  | `'left'` \| `'right'` \| `'top'` \| `'bottom'` | `'left'`  | The position of the drawer relative to the screen.             |
| `size`      | `'small'` \| `'medium'` \| `'large'` \| `'full'` | `'medium'` | The size of the drawer, which affects its width.               |
| `overlay`   | `boolean`                                 | `true`    | Determines whether to display an overlay behind the drawer.    |
| `className` | `string`                                  | `''`      | Additional CSS class name(s) to be applied to the drawer.      |

## Usage

To use the `Drawer` component in your React application, follow these steps:

1. Import the `Drawer` component into your file:

```jsx
import Drawer from './Drawer';
```

2. Render the `Drawer` component with the desired props:

```jsx
<Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
  {/* Drawer content */}
</Drawer>
```

3. Customize the appearance and behavior of the drawer by providing different prop values.

## Animations

The `Drawer` component uses the `framer-motion` library to animate the drawer and overlay. The drawer slides in and out based on the `isOpen` prop, and the overlay fades in and out accordingly.

The animation variants and transitions are defined within the component using the `drawerVariants` and `overlayVariants` objects.

## Styling

The `Drawer` component applies CSS classes to style the drawer and its contents. The size of the drawer is determined by the `size` prop, which maps to corresponding width classes defined in the `sizeClasses` object.

Additionally, you can apply custom CSS classes to the drawer using the `className` prop.

## Overlay

By default, the `Drawer` component displays an overlay behind the drawer when it is open. The overlay can be disabled by setting the `overlay` prop to `false`.

Clicking on the overlay will trigger the `onClose` callback function to close the drawer.

## Close Button

The `Drawer` component includes a close button in the top-right corner of the drawer. Clicking on the close button will invoke the `onClose` callback function to close the drawer.

The close button uses the `FiX` icon from the `react-icons` library.