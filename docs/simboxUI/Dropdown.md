# Dropdown Component

The `Dropdown` component is a reusable React component that provides a customizable dropdown menu with selectable options. It allows users to select a value from a list of options and triggers a callback function when the selection changes.

## Props

The `Dropdown` component accepts the following props:

| Prop Name          | Type                  | Default   | Description                                                                                  |
|--------------------|----------------------|-----------|----------------------------------------------------------------------------------------------|
| `label`            | `string`             | -         | The label text for the dropdown button.                                                      |
| `image`            | `string`             | -         | The URL of an optional image to be displayed alongside the label.                            |
| `options`          | `string[]`           | -         | An array of strings representing the available options in the dropdown menu.                 |
| `value`            | `string`             | -         | The currently selected value from the options.                                               |
| `onChange`         | `(value: string) => void` | -         | A callback function to be invoked when the selected value changes.                           |
| `className`        | `string`             | `''`      | Additional CSS class name(s) to be applied to the dropdown container.                        |
| `buttonClassName`  | `string`             | `''`      | Additional CSS class name(s) to be applied to the dropdown button.                           |
| `menuClassName`    | `string`             | `''`      | Additional CSS class name(s) to be applied to the dropdown menu.                             |
| `menuItemClassName`| `string`             | `''`      | Additional CSS class name(s) to be applied to each menu item.                                |
| `arrowEnabled`     | `boolean`            | `true`    | Determines whether the dropdown arrow icon is displayed.                                     |

## Usage

To use the `Dropdown` component in your React application, follow these steps:

1. Import the `Dropdown` component into your file:

```jsx
import Dropdown from './Dropdown';
```

2. Render the `Dropdown` component with the required props:

```jsx
const options = ['Option 1', 'Option 2', 'Option 3'];
const [selectedValue, setSelectedValue] = useState('');

<Dropdown
  label="Select an option"
  options={options}
  value={selectedValue}
  onChange={setSelectedValue}
/>
```

3. Customize the appearance and behavior of the dropdown by providing additional prop values.

## Functionality

The `Dropdown` component provides the following functionality:

- Clicking on the dropdown button toggles the visibility of the dropdown menu.
- Clicking on an option in the dropdown menu selects that option and triggers the `onChange` callback with the selected value.
- Clicking outside the dropdown menu closes the menu.
- The currently selected value is displayed as the label of the dropdown button.
- An optional image can be displayed alongside the label.
- The dropdown arrow icon can be enabled or disabled using the `arrowEnabled` prop.

## Styling

The `Dropdown` component utilizes utility classes from a CSS framework (e.g., Tailwind CSS) to style the dropdown button, menu, and menu items. The appearance can be customized by providing additional CSS classes through the `className`, `buttonClassName`, `menuClassName`, and `menuItemClassName` props.

The component also applies conditional styling based on the selected value, highlighting the currently selected option in the dropdown menu.

## Dependencies

The `Dropdown` component has the following dependencies:

- React: The component is built using React and requires the `'use client'` directive for client-side rendering.
- Button: The component uses a custom `Button` component for rendering the dropdown button. Make sure to have the `Button` component implemented and imported correctly.
