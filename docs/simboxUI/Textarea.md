# Textarea Component

The `Textarea` component is a reusable React component that renders a customizable textarea input field. It allows users to enter and edit multi-line text.

## Props

The `Textarea` component accepts the following props:

| Prop Name      | Type                                                 | Default     | Description                                                 |
|----------------|------------------------------------------------------|-------------|-------------------------------------------------------------|
| `id`           | `string`                                             | -           | The ID attribute for the textarea element.                  |
| `name`         | `string`                                             | -           | The name attribute for the textarea element.                |
| `value`        | `string`                                             | -           | The value of the textarea.                                  |
| `onChange`     | `(event: React.ChangeEvent<HTMLTextAreaElement>) => void` | -           | The callback function to handle the change event of the textarea. |
| `placeholder`  | `string`                                             | `''`        | The placeholder text for the textarea.                      |
| `rows`         | `number`                                             | `3`         | The number of visible text lines for the textarea.          |
| `className`    | `string`                                             | `''`        | Additional CSS class name(s) to be applied to the textarea. |
| `style`        | `React.CSSProperties`                                | -           | Custom inline styles to be applied to the textarea.         |
| `error`        | `string`                                             | `''`        | The error message to be displayed below the textarea.       |
| `disabled`     | `boolean`                                            | `false`     | Determines whether the textarea is disabled.                |

## Usage

To use the `Textarea` component in your React application, follow these steps:

1. Import the `Textarea` component into your file:

```jsx
import Textarea from './Textarea';
```

2. Render the `Textarea` component with the required props:

```jsx
<Textarea
  name="description"
  value={description}
  onChange={handleDescriptionChange}
  placeholder="Enter description"
  rows={5}
/>
```

3. Customize the appearance and behavior of the textarea by providing different prop values.

## Styling

The `Textarea` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the textarea. The appearance of the textarea can be customized by providing different values for the `className` and `style` props.

- The `className` prop allows you to apply additional CSS classes to the textarea element.
- The `style` prop allows you to apply custom inline styles to the textarea element.

The component also applies different styles based on the `error` and `disabled` props:

- If the `error` prop is provided with a non-empty string, the textarea will have a red border color and focus ring to indicate an error state.
- If the `disabled` prop is set to `true`, the textarea will have a gray background color and a "not-allowed" cursor style to indicate that it is disabled.

## Accessibility

The `Textarea` component ensures accessibility by properly associating the label with the textarea input using the `id` prop. It is recommended to provide a unique `id` prop to each instance of the `Textarea` component.

## Error Handling

The `Textarea` component supports displaying an error message below the textarea. To display an error message, provide the error text as the `error` prop. The error message will be displayed in red color to indicate an error state.