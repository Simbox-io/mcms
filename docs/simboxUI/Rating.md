# Radio Component

The `Radio` component is a reusable React component that represents a radio button input with a label. It allows users to select a single option from a group of options.

## Props

The `Radio` component accepts the following props:

| Prop Name   | Type                  | Default     | Description                                                                                  |
|-------------|----------------------|-------------|----------------------------------------------------------------------------------------------|
| `label`     | `string`             | -           | The label text to be displayed next to the radio button.                                     |
| `value`     | `string`             | -           | The value associated with the radio button.                                                  |
| `checked`   | `boolean`            | -           | Indicates whether the radio button is checked or not.                                        |
| `onChange`  | `(value: string) => void` | -           | A callback function to be invoked when the radio button's checked state changes.             |
| `className` | `string`             | `''`        | Additional CSS class name(s) to be applied to the radio button container.                    |
| `disabled`  | `boolean`            | `false`     | Indicates whether the radio button is disabled or not.                                       |
| `id`        | `string`             | -           | The unique identifier for the radio button input.                                            |
| `name`      | `string`             | -           | The name attribute for the radio button input, used for grouping related radio buttons.      |
| `required`  | `boolean`            | -           | Indicates whether the radio button is required or not.                                       |

## Usage

To use the `Radio` component in your React application, follow these steps:

1. Import the `Radio` component into your file:

```jsx
import Radio from './Radio';
```

2. Render the `Radio` component with the desired props:

```jsx
<Radio
  label="Option 1"
  value="option1"
  checked={selectedOption === 'option1'}
  onChange={handleOptionChange}
/>
```

3. Customize the appearance and behavior of the radio button by providing different prop values.

## Styling

The `Radio` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the radio button and its label. The appearance of the radio button can be customized by providing additional CSS classes through the `className` prop.

The radio button input is styled with the following classes:
- `form-radio`: Applies default radio button styles.
- `h-4 w-4`: Sets the height and width of the radio button.
- `text-blue-600`: Sets the color of the radio button when checked.
- `transition duration-150 ease-in-out`: Applies a smooth transition effect when the radio button state changes.
- `opacity-50 cursor-not-allowed` (conditionally applied): Reduces the opacity and changes the cursor style when the radio button is disabled.

The label text is styled with the following classes:
- `ml-2`: Adds left margin to the label text.
- `text-sm`: Sets the font size of the label text to small.
- `font-medium`: Sets the font weight of the label text to medium.
- `opacity-50 cursor-not-allowed` (conditionally applied): Reduces the opacity and changes the cursor style when the radio button is disabled.

## Callback

The `Radio` component accepts an `onChange` prop, which is a callback function that will be invoked when the radio button's checked state changes. The callback function receives the `value` prop as an argument, allowing you to handle the selected value in the parent component.

## Accessibility

The `Radio` component ensures accessibility by properly associating the label with the radio button input using the `id` prop. It is recommended to provide a unique `id` prop for each radio button to maintain proper accessibility.

The `disabled` prop is used to indicate whether the radio button is disabled or not. When disabled, the radio button and its label have reduced opacity and a "not-allowed" cursor style.

The `required` prop is used to indicate whether the radio button is required or not. This prop can be used for form validation purposes.