# Spinner Component

The `Spinner` component is a reusable React component that displays a loading spinner with customizable size, variant, thickness, speed, and label.

## Props

The `Spinner` component accepts the following props:

| Prop Name   | Type                                                                   | Default     | Description                                                                                  |
|-------------|-----------------------------------------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| `size`      | `'small'` \| `'medium'` \| `'large'`                                    | `'medium'`  | The size of the spinner.                                                                     |
| `variant`   | `'primary'` \| `'secondary'` \| `'success'` \| `'warning'` \| `'danger'` | `'primary'` | The color variant of the spinner.                                                            |
| `className` | `string`                                                               | `''`        | Additional CSS class name(s) to be applied to the spinner container.                         |
| `style`     | `React.CSSProperties`                                                  | -           | Custom inline styles to be applied to the spinner container.                                 |
| `thickness` | `number`                                                               | `2`         | The thickness of the spinner's stroke.                                                       |
| `speed`     | `number`                                                               | `1`         | The animation speed of the spinner in seconds.                                               |
| `label`     | `string`                                                               | -           | An optional label to be displayed next to the spinner.                                       |

## Usage

To use the `Spinner` component in your React application, follow these steps:

1. Import the `Spinner` component into your file:

```jsx
import Spinner from './Spinner';
```

2. Render the `Spinner` component with the desired props:

```jsx
<Spinner size="large" variant="success" label="Loading..." />
```

3. Customize the appearance and behavior of the spinner by providing different prop values.

## Styling

The `Spinner` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the spinner. The appearance of the spinner can be customized by providing different values for the `size` and `variant` props.

- The `size` prop determines the width and height of the spinner.
- The `variant` prop determines the color of the spinner based on predefined color schemes.

Additionally, you can apply custom CSS classes or inline styles to the spinner container using the `className` and `style` props, respectively.

## Animation

The `Spinner` component uses CSS animations to create the spinning effect. The animation speed can be controlled using the `speed` prop, which accepts a number representing the duration of the animation in seconds.

## Thickness

The thickness of the spinner's stroke can be adjusted using the `thickness` prop. It accepts a number value representing the stroke width.

## Label

The `Spinner` component allows you to display an optional label next to the spinner. To include a label, provide the label text as the `label` prop. The label will be displayed to the right of the spinner with a margin.