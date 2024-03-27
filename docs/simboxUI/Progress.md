# Progress Component

The `Progress` component is a reusable React component that displays a progress bar or progress circle with customizable appearance and behavior.

## Props

The `Progress` component accepts the following props:

| Prop Name         | Type                           | Default     | Description                                                                                  |
|-------------------|--------------------------------|-------------|----------------------------------------------------------------------------------------------|
| `value`           | `number`                       | -           | The progress value, ranging from 0 to 100.                                                   |
| `variant`         | `'bar'` \| `'circle'`           | `'bar'`     | The variant of the progress indicator, either a bar or a circle.                             |
| `size`            | `'small'` \| `'medium'` \| `'large'` | `'medium'`  | The size of the progress indicator.                                                          |
| `thickness`       | `number`                       | `4`         | The thickness of the progress bar or circle.                                                 |
| `color`           | `string`                       | `'blue'`    | The color of the progress indicator.                                                         |
| `className`       | `string`                       | `''`        | Additional CSS class name(s) to be applied to the progress container.                        |
| `barClassName`    | `string`                       | `''`        | Additional CSS class name(s) to be applied to the progress bar.                              |
| `circleClassName` | `string`                       | `''`        | Additional CSS class name(s) to be applied to the progress circle.                           |
| `labelClassName`  | `string`                       | `''`        | Additional CSS class name(s) to be applied to the label container.                           |
| `label`           | `string`                       | -           | The label text to be displayed alongside the progress indicator.                             |
| `showPercentage`  | `boolean`                      | `false`     | Whether to display the progress percentage alongside the label.                              |

## Usage

To use the `Progress` component in your React application, follow these steps:

1. Import the `Progress` component into your file:

```jsx
import Progress from './Progress';
```

2. Render the `Progress` component with the desired props:

```jsx
<Progress value={75} variant="circle" size="large" color="green" label="Loading..." showPercentage />
```

3. Customize the appearance and behavior of the progress indicator by providing different prop values.

## Styling

The `Progress` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the progress indicator. The appearance can be customized by providing different values for the `variant`, `size`, `thickness`, and `color` props.

- The `variant` prop determines whether the progress indicator is displayed as a bar or a circle.
- The `size` prop affects the dimensions of the progress indicator.
- The `thickness` prop controls the thickness of the progress bar or circle.
- The `color` prop sets the color of the progress indicator.

Additionally, you can apply custom CSS classes to the progress container, bar, circle, and label using the `className`, `barClassName`, `circleClassName`, and `labelClassName` props, respectively.

## Label and Percentage

The `Progress` component allows you to display a label and/or the progress percentage alongside the progress indicator. To show a label, provide the label text as the `label` prop. To display the progress percentage, set the `showPercentage` prop to `true`.

The label and percentage are rendered in a container next to the progress indicator. You can customize the styling of the label container using the `labelClassName` prop.

## Value Clamping

The `value` prop of the `Progress` component is clamped between 0 and 100. If a value outside this range is provided, it will be adjusted to the nearest valid value (0 or 100) to ensure the progress indicator remains within the valid range.