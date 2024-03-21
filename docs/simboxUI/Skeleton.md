# Skeleton Component

The `Skeleton` component is a reusable React component that renders a skeleton placeholder for loading states. It provides various customization options to match the appearance of the actual content being loaded.

## Props

The `Skeleton` component accepts the following props:

| Prop Name   | Type                                   | Default     | Description                                                                                         |
|-------------|----------------------------------------|-------------|-----------------------------------------------------------------------------------------------------|
| `variant`   | `'text'` \| `'circular'` \| `'rectangular'` | `'text'`    | The variant of the skeleton, determining its shape.                                                |
| `width`     | `string` \| `number`                     | `'100%'`    | The width of the skeleton. Can be a CSS length value or a number representing pixels.              |
| `height`    | `string` \| `number`                     | `'1rem'`    | The height of the skeleton. Can be a CSS length value or a number representing pixels.             |
| `className` | `string`                               | `''`        | Additional CSS class name(s) to be applied to the skeleton.                                        |
| `style`     | `React.CSSProperties`                  | -           | Custom inline styles to be applied to the skeleton.                                                |
| `animation` | `'pulse'` \| `'wave'`                    | `'pulse'`   | The animation effect of the skeleton.                                                              |
| `count`     | `number`                               | `1`         | The number of skeleton elements to render.                                                         |
| `duration`  | `number`                               | `1.5`       | The duration of the animation in seconds.                                                          |
| `circle`    | `boolean`                              | `false`     | Whether to render the skeleton as a circle. Takes precedence over the `variant` prop if set to `true`. |

## Usage

To use the `Skeleton` component in your React application, follow these steps:

1. Import the `Skeleton` component into your file:

```jsx
import Skeleton from './Skeleton';
```

2. Render the `Skeleton` component with the desired props:

```jsx
<Skeleton variant="rectangular" width={200} height={100} count={3} />
```

3. Customize the appearance and behavior of the skeleton by providing different prop values.

## Variants

The `Skeleton` component supports three variants:

- `'text'` (default): Renders a skeleton with a rectangular shape, typically used for text content.
- `'circular'`: Renders a skeleton with a circular shape.
- `'rectangular'`: Renders a skeleton with a rectangular shape.

The `circle` prop takes precedence over the `variant` prop. If `circle` is set to `true`, the skeleton will be rendered as a circle regardless of the `variant` value.

## Animation

The `Skeleton` component provides two animation effects:

- `'pulse'` (default): Applies a pulsating effect to the skeleton.
- `'wave'`: Applies a wave-like effect to the skeleton.

The `duration` prop determines the duration of the animation in seconds.

## Dimensions

The `width` and `height` props allow you to specify the dimensions of the skeleton. You can provide CSS length values (e.g., `'100px'`, `'50%'`) or numbers representing pixels.

## Count

The `count` prop determines the number of skeleton elements to render. By default, it renders a single skeleton element.

## Styling

The `Skeleton` component can be styled using CSS classes or inline styles. The `className` prop allows you to apply additional CSS classes to the skeleton, while the `style` prop enables you to provide custom inline styles.

The component also applies default styles based on the selected `variant` and `animation`. The skeleton elements have a default border radius of `4px`, except for the `'circular'` variant or when `circle` is set to `true`, in which case the border radius is set to `'50%'` to create a circular shape.