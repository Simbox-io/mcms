# Checkbox Component

The `Checkbox` component is a reusable React component that renders a checkbox input with a label. It allows users to toggle the checkbox state and provides customization options for the label, checked state, disabled state, and additional CSS classes.

## Props

The `Checkbox` component accepts the following props:

| Prop Name   | Type                     | Default     | Description                                                                                  |
|-------------|--------------------------|-------------|----------------------------------------------------------------------------------------------|
| `label`     | `string`                 | -           | The label text to be displayed next to the checkbox.                                         |
| `checked`   | `boolean`                | -           | The checked state of the checkbox.                                                           |
| `onChange`  | `(checked: boolean) => void` | -           | A callback function to be invoked when the checkbox state changes. It receives the updated checked state as an argument. |
| `className` | `string`                 | `''`        | Additional CSS class name(s) to be applied to the checkbox container.                        |
| `disabled`  | `boolean`                | `false`     | Determines whether the checkbox is disabled or not.                                          |

## Usage

To use the `Checkbox` component in your React application, follow these steps:

1. Import the `Checkbox` component into your file:

```jsx
import Checkbox from './Checkbox';
```

2. Render the `Checkbox` component with the desired props:

```jsx
const [isChecked, setIsChecked] = useState(false);

const handleCheckboxChange = (checked: boolean) => {
  setIsChecked(checked);
};

return (
  <Checkbox
    label="Remember me"
    checked={isChecked}
    onChange={handleCheckboxChange}
    className="mb-4"
    disabled={false}
  />
);
```

3. Customize the label, checked state, disabled state, and additional CSS classes as needed.

## Styling

The `Checkbox` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the checkbox and label. The appearance of the checkbox can be customized by providing different CSS classes through the `className` prop.

The checkbox input is styled with the following classes:
- `form-checkbox`: Applies the default checkbox styling.
- `h-5 w-5`: Sets the height and width of the checkbox to 20px (5 units).
- `text-blue-600`: Sets the color of the checkbox when checked to blue.
- `transition duration-150 ease-in-out`: Applies a smooth transition effect when the checkbox state changes.
- `opacity-50 cursor-not-allowed`: Applies a reduced opacity and changes the cursor to "not-allowed" when the checkbox is disabled.

The label text is styled with the following classes:
- `ml-2`: Adds a left margin of 8px (2 units) to the label text.
- `text-gray-700 dark:text-gray-300`: Sets the color of the label text to gray in light mode and a lighter gray in dark mode.
- `opacity-50`: Applies a reduced opacity to the label text when the checkbox is disabled.

## Callback

The `Checkbox` component accepts an `onChange` prop, which is a callback function that will be invoked whenever the checkbox state changes. The callback function receives the updated checked state as an argument, allowing you to handle the state change in the parent component.