# Badge Component

The `Badge` component is a reusable React component that displays a badge with customizable content, variant, size, shape, and icon.

## Props

The `Badge` component accepts the following props:

| Prop Name      | Type                                                 | Default     | Description                                                 |
|----------------|------------------------------------------------------|-------------|-------------------------------------------------------------|
| `children`     | `React.ReactNode`                                    | -           | The content to be displayed inside the badge.               |
| `variant`      | `'default'` \| `'primary'` \| `'success'` \| `'warning'` \| `'danger'` | `'default'` | The variant of the badge, which determines its background and text color. |
| `size`         | `'small'` \| `'medium'` \| `'large'`                   | `'medium'`  | The size of the badge, which affects its padding and font size. |
| `shape`        | `'rounded'` \| `'pill'`                                | `'rounded'` | The shape of the badge, either rounded corners or a pill shape. |
| `className`    | `string`                                             | `''`        | Additional CSS class name(s) to be applied to the badge.    |
| `style`        | `React.CSSProperties`                                | -           | Custom inline styles to be applied to the badge.            |
| `icon`         | `React.ReactNode`                                    | -           | An icon to be displayed inside the badge.                   |
| `iconPosition` | `'left'` \| `'right'`                                  | `'left'`    | The position of the icon relative to the badge content.     |
| `onClick`      | `() => void`                                         | -           | A callback function to be invoked when the badge is clicked. |

## Usage

To use the `Badge` component in your React application, follow these steps:

1. Import the `Badge` component into your file:

```jsx
import Badge from './Badge';
```

2. Render the `Badge` component with the desired props:

```jsx
<Badge variant="primary" size="large" icon={<StarIcon />}>
  Featured
</Badge>
```

3. Customize the appearance and behavior of the badge by providing different prop values.

## Styling

The `Badge` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the badge. The appearance of the badge can be customized by providing different values for the `variant`, `size`, and `shape` props.

- The `variant` prop determines the background and text color of the badge based on predefined color schemes.
- The `size` prop affects the padding and font size of the badge.
- The `shape` prop determines whether the badge has rounded corners or a pill shape.

Additionally, you can apply custom CSS classes or inline styles to the badge using the `className` and `style` props, respectively.

## Icon Support

The `Badge` component supports displaying an icon inside the badge. To include an icon, provide the icon element as the `icon` prop. The position of the icon relative to the badge content can be controlled using the `iconPosition` prop, which accepts either `'left'` (default) or `'right'`.

## Callback

The `Badge` component accepts an optional `onClick` prop, which is a callback function that will be invoked when the badge is clicked. You can use this prop to handle any desired actions or interactions when the badge is clicked.