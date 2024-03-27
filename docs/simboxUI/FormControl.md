# FormControl Component

The `FormControl` component is a reusable React component that provides a wrapper for form control elements such as input fields, select dropdowns, and text areas. It includes a label, error message, and description for the form control.

## Props

The `FormControl` component accepts the following props:

| Prop Name    | Type            | Default | Description                                                                                  |
|--------------|-----------------|---------|----------------------------------------------------------------------------------------------|
| `label`      | `string`        | -       | The label text for the form control.                                                         |
| `htmlFor`    | `string`        | -       | The value of the `htmlFor` attribute for the label, associating it with the form control.    |
| `error`      | `string`        | -       | An error message to be displayed below the form control.                                     |
| `description`| `string`        | -       | A description or hint text to be displayed below the form control.                           |
| `className`  | `string`        | `''`    | Additional CSS class name(s) to be applied to the form control wrapper.                      |
| `children`   | `React.ReactNode`| -       | The form control element(s) to be wrapped by the `FormControl` component.                    |

## Usage

To use the `FormControl` component in your React application, follow these steps:

1. Import the `FormControl` component into your file:

```jsx
import FormControl from './FormControl';
```

2. Wrap your form control element(s) with the `FormControl` component and provide the necessary props:

```jsx
<FormControl
  label="Email"
  htmlFor="email"
  error={emailError}
  description="Enter your email address"
>
  <input
    type="email"
    id="email"
    name="email"
    className="input"
    value={email}
    onChange={handleEmailChange}
  />
</FormControl>
```

3. Customize the appearance and behavior of the form control by providing different prop values and styling the wrapped form control element(s) accordingly.

## Styling

The `FormControl` component applies some basic styling to the label, error message, and description using utility classes from a CSS framework (e.g., Tailwind CSS). The specific styles used are:

- The label has a `block` display, `font-medium` font weight, `text-gray-700` text color, and `mb-1` margin bottom.
- The description has a `mt-1` margin top, `text-sm` font size, and `text-gray-500` text color.
- The error message has a `mt-1` margin top, `text-sm` font size, and `text-red-500` text color.

You can further customize the styling of the form control wrapper by providing additional CSS classes through the `className` prop.

## Error Handling

The `FormControl` component supports displaying an error message below the form control. To show an error message, provide the error text as the `error` prop. The error message will be rendered with appropriate styling to indicate an error state.

## Description

The `FormControl` component allows you to include a description or hint text below the form control. To add a description, provide the text as the `description` prop. The description will be rendered with appropriate styling to provide additional information or guidance to the user.