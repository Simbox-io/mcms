# Slider Component

The `Slider` component is a customizable and interactive slider input component built with React and Framer Motion. It allows users to select a value within a specified range by dragging the slider thumb or clicking on the slider track.

## Props

The `Slider` component accepts the following props:

| Prop Name        | Type                   | Default     | Description                                                                                  |
|------------------|------------------------|-------------|----------------------------------------------------------------------------------------------|
| `min`            | `number`               | `0`         | The minimum value of the slider range.                                                       |
| `max`            | `number`               | `100`       | The maximum value of the slider range.                                                       |
| `step`           | `number`               | `1`         | The step increment between slider values.                                                    |
| `value`          | `number`               | -           | The controlled value of the slider. If provided, the slider becomes a controlled component.  |
| `defaultValue`   | `number`               | `0`         | The default value of the slider when uncontrolled.                                           |
| `onChange`       | `(value: number) => void` | -           | Callback function invoked when the slider value changes.                                     |
| `className`      | `string`               | `''`        | Additional CSS class name(s) to be applied to the slider container.                          |
| `trackClassName` | `string`               | `''`        | Additional CSS class name(s) to be applied to the slider track.                              |
| `thumbClassName` | `string`               | `''`        | Additional CSS class name(s) to be applied to the slider thumb.                              |
| `labelClassName` | `string`               | `''`        | Additional CSS class name(s) to be applied to the slider label.                              |
| `showLabel`      | `boolean`              | `false`     | Determines whether to display a label with the current slider value.                          |
| `labelPosition`  | `'top'` \| `'bottom'`    | `'top'`     | The position of the label relative to the slider.                                            |
| `labelFormat`    | `(value: number) => string` | `(value) => value.toString()` | Function to format the label text based on the slider value. |

## Usage

To use the `Slider` component in your React application, follow these steps:

1. Import the `Slider` component into your file:

```jsx
import Slider from './Slider';
```

2. Render the `Slider` component with the desired props:

```jsx
<Slider
  min={0}
  max={100}
  step={1}
  defaultValue={50}
  onChange={(value) => console.log(value)}
  showLabel
  labelPosition="bottom"
  labelFormat={(value) => `${value}%`}
/>
```

3. Customize the appearance and behavior of the slider by providing different prop values.

## Functionality

The `Slider` component provides the following functionality:

- Dragging the slider thumb updates the slider value in real-time.
- Clicking on the slider track sets the slider value to the corresponding position.
- The slider value is rounded to the nearest step increment.
- The slider can be controlled or uncontrolled based on the presence of the `value` prop.
- The label can be displayed above or below the slider track.
- The label text can be formatted using the `labelFormat` prop.

## Accessibility

The `Slider` component includes a hidden `<input type="range">` element for accessibility purposes. This allows the slider to be focusable and operable using keyboard navigation.

## Styling

The appearance of the `Slider` component can be customized by providing CSS class names through the `className`, `trackClassName`, `thumbClassName`, and `labelClassName` props. These class names can be used to apply custom styles to the respective elements.

The slider track and thumb are positioned using absolute positioning, and the thumb position is dynamically updated based on the slider value.