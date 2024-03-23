## Select Component

The `Select` component is a reusable dropdown select component built using React and the Headless UI library. It provides a customizable and accessible select input with support for single and multiple selections.

### Props

The `Select` component accepts the following props:

- `options` (required): An array of `Option` objects representing the available options for the select input. Each `Option` object should have a `value` and a `label` property.
- `label` (optional): A string representing the label for the select input.
- `placeholder` (optional): A string representing the placeholder text for the select input when no option is selected.
- `disabled` (optional): A boolean indicating whether the select input should be disabled.
- `errorText` (optional): A string representing the error message to display below the select input.
- `className` (optional): A string representing additional CSS classes to apply to the select input container.
- `isMulti` (optional): A boolean indicating whether the select input should allow multiple selections.
- `required` (optional): A boolean indicating whether the select input is required.
- `value` (optional): The initial selected value(s) for the select input. It can be a single `Option` object or an array of `Option` objects (for multiple selections).
- `onChange` (required): A function that is called when the selected value(s) change. It receives the selected `Option` object(s) as an argument.

### Usage

To use the `Select` component in your React application, follow these steps:

1. Import the `Select` component into your file:

```jsx
import Select from './Select';
```

2. Prepare an array of `Option` objects representing the available options for the select input:

```jsx
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];
```

3. Render the `Select` component in your JSX, passing the required props:

```jsx
<Select
  options={options}
  label="Select an option"
  placeholder="Choose an option"
  onChange={(selectedOption) => console.log(selectedOption)}
/>
```

4. Customize the appearance and behavior of the `Select` component by providing additional props as needed, such as `disabled`, `errorText`, `className`, `isMulti`, `required`, and `value`.

### Example

Here's an example of how to use the `Select` component with multiple selections and an initial value:

```jsx
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const initialValue = [options[0], options[1]];

function MyComponent() {
  const [selectedOptions, setSelectedOptions] = useState(initialValue);

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  return (
    <Select
      options={options}
      label="Select multiple options"
      isMulti
      value={selectedOptions}
      onChange={handleChange}
    />
  );
}
```

In this example, the `Select` component allows multiple selections, and the initial value is set to an array of two `Option` objects. The `handleChange` function is called whenever the selected options change, updating the `selectedOptions` state.