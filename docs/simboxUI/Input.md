# Input Component

The `Input` component is a reusable React component that renders an input field with various customization options and built-in validation and error handling.

## Props

The `Input` component accepts the following props:

| Prop Name         | Type                                                           | Default     | Description                                                                                  |
|-------------------|----------------------------------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| `type`            | `'text'` \| `'email'` \| `'password'` \| `'number'` \| `'tel'` \| `'url'` \| `'color'` | `'text'`    | The type of the input field.                                                                 |
| `name`            | `string`                                                       | -           | The name attribute of the input field.                                                       |
| `id`              | `string`                                                       | -           | The ID attribute of the input field.                                                         |
| `value`           | `string`                                                       | -           | The value of the input field.                                                                |
| `onChange`        | `(selectedValue: Option) => void`                              | -           | The callback function to be invoked when the input value changes.                            |
| `label`           | `string`                                                       | -           | The label text for the input field.                                                          |
| `placeholder`     | `string`                                                       | -           | The placeholder text for the input field.                                                    |
| `disabled`        | `boolean`                                                      | `false`     | Whether the input field is disabled.                                                         |
| `readOnly`        | `boolean`                                                      | `false`     | Whether the input field is read-only.                                                        |
| `error`           | `string`                                                       | -           | The error message to be displayed below the input field.                                     |
| `hint`            | `string`                                                       | -           | The hint text to be displayed below the input field.                                         |
| `className`       | `string`                                                       | `''`        | Additional CSS class name(s) to be applied to the outer container.                           |
| `labelClassName`  | `string`                                                       | `''`        | Additional CSS class name(s) to be applied to the label.                                     |
| `inputClassName`  | `string`                                                       | `''`        | Additional CSS class name(s) to be applied to the input field.                               |
| `errorClassName`  | `string`                                                       | `''`        | Additional CSS class name(s) to be applied to the error message.                             |
| `hintClassName`   | `string`                                                       | `''`        | Additional CSS class name(s) to be applied to the hint text.                                 |
| `fullWidth`       | `boolean`                                                      | `false`     | Whether the input field should take up the full width of its container.                      |
| `required`        | `boolean`                                                      | `false`     | Whether the input field is required.                                                         |
| `startAdornment`  | `React.ReactNode`                                              | -           | The content to be rendered at the start of the input field (e.g., an icon).                  |
| `endAdornment`    | `React.ReactNode`                                              | -           | The content to be rendered at the end of the input field (e.g., an icon).                    |
| `min`             | `number`                                                       | -           | The minimum value for the input field (applicable to `type="number"`).                       |
| `max`             | `number`                                                       | -           | The maximum value for the input field (applicable to `type="number"`).                       |
| `step`            | `number`                                                       | -           | The step value for the input field (applicable to `type="number"`).                          |
| `minLength`       | `number`                                                       | -           | The minimum length of the input value.                                                       |
| `maxLength`       | `number`                                                       | -           | The maximum length of the input value.                                                       |
| `pattern`         | `string`                                                       | -           | The pattern that the input value should match (applicable to `type="text"` or `type="tel"`). |

## Usage

To use the `Input` component in your React application, follow these steps:

1. Import the `Input` component into your file:

```jsx
import Input from './Input';
```

2. Render the `Input` component with the desired props:

```jsx
<Input
  type="email"
  name="email"
  id="email"
  value={email}
  onChange={handleEmailChange}
  label="Email"
  placeholder="Enter your email"
  required
  error={emailError}
/>
```

3. Customize the appearance and behavior of the input field by providing different prop values.

## Validation and Error Handling

The `Input` component supports built-in validation and error handling. You can provide an `error` prop with an error message to display below the input field when there is a validation error. The error message will be styled with a red color to indicate an error state.

Additionally, you can use the `required`, `minLength`, `maxLength`, and `pattern` props to specify validation rules for the input field. The component will automatically apply the corresponding HTML attributes to the input field for client-side validation.

## Styling

The `Input` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the input field and its associated elements. You can customize the appearance of the input field by providing additional CSS classes through the `className`, `labelClassName`, `inputClassName`, `errorClassName`, and `hintClassName` props.

The component also supports a `fullWidth` prop that makes the input field take up the full width of its container when set to `true`.

## Adornments

The `Input` component allows you to add start and end adornments to the input field using the `startAdornment` and `endAdornment` props. These adornments can be any valid React node, such as icons or text. The adornments will be positioned at the start or end of the input field, respectively.

## Accessibility

The `Input` component follows accessibility best practices by associating the label with the input field using the `htmlFor` attribute. It also supports the `disabled` and `readOnly` props to control the input field's interactivity and provide appropriate visual styling.