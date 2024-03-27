# Button Component

The `Button` component is a reusable React component that renders a customizable button with various options for styling, size, icons, and loading state.

## Props

The `Button` component accepts the following props:

| Prop Name      | Type                                                                   | Default     | Description                                                                                                                         |
|----------------|------------------------------------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `children`     | `React.ReactNode`                                                      | -           | The content to be rendered inside the button.                                                                                       |
| `onClick`      | `(event: React.MouseEvent<HTMLButtonElement>) => void`                 | -           | The callback function to be invoked when the button is clicked.                                                                     |
| `variant`      | `'primary'` \| `'secondary'` \| `'tertiary'` \| `'outline'` \| `'text'` \| `'danger'` | `'primary'` | The variant of the button, which determines its appearance and styling.                                                             |
| `size`         | `'small'` \| `'medium'` \| `'large'`                                    | `'medium'`  | The size of the button, which affects its padding and font size.                                                                    |
| `fullWidth`    | `boolean`                                                              | `false`     | Determines whether the button should take up the full width of its container.                                                       |
| `disabled`     | `boolean`                                                              | `false`     | Determines whether the button is disabled.                                                                                          |
| `loading`      | `boolean`                                                              | `false`     | Determines whether the button is in a loading state.                                                                                |
| `loadingText`  | `string`                                                               | `'Loading...'` | The text to be displayed when the button is in a loading state.                                                                  |
| `startIcon`    | `React.ReactNode`                                                      | -           | The icon to be rendered at the start of the button.                                                                                 |
| `endIcon`      | `React.ReactNode`                                                      | -           | The icon to be rendered at the end of the button.                                                                                   |
| `className`    | `string`                                                               | `''`        | Additional CSS class name(s) to be applied to the button.                                                                           |
| `type`         | `'button'` \| `'submit'` \| `'reset'`                                   | `'button'`  | The type of the button element.                                                                                                     |
| `buttonType`   | `'download'` \| `'subscribe'` \| `'bookmark'` \| `'ai'` \| `'share'`      | -           | The type of the button, which determines the icon to be rendered based on predefined options.                                       |

## Usage

To use the `Button` component in your React application, follow these steps:

1. Import the `Button` component into your file:

```jsx
import Button from './Button';
```

2. Render the `Button` component with the desired props:

```jsx
<Button variant="primary" size="large" onClick={handleClick}>
  Click Me
</Button>
```

3. Customize the appearance and behavior of the button by providing different prop values.

## Variants

The `Button` component supports different variants that determine its appearance and styling. The available variants are:

- `'primary'` (default): Renders a button with a blue background color.
- `'secondary'`: Renders a button with a gray background color.
- `'tertiary'`: Renders a button with a green background color.
- `'outline'`: Renders a button with a transparent background and a gray border.
- `'text'`: Renders a button with a transparent background and no border.
- `'danger'`: Renders a button with a red background color.

## Sizes

The `Button` component supports different sizes that affect its padding and font size. The available sizes are:

- `'small'`: Renders a small-sized button.
- `'medium'` (default): Renders a medium-sized button.
- `'large'`: Renders a large-sized button.

## Icons

The `Button` component allows you to include icons at the start and/or end of the button. You can provide the `startIcon` and `endIcon` props with the desired icon components.

Additionally, the `buttonType` prop allows you to specify predefined button types that automatically render corresponding icons. The available button types are:

- `'download'`: Renders a download icon.
- `'subscribe'`: Renders a bell icon.
- `'bookmark'`: Renders a bookmark icon.
- `'ai'`: Renders an AI icon.
- `'share'`: Renders a share icon.

## Loading State

The `Button` component supports a loading state, which can be activated by setting the `loading` prop to `true`. When the button is in a loading state, it displays a spinner icon and the `loadingText` (default: "Loading...") instead of the button content. The button is also disabled during the loading state.

## Disabled State

The `Button` component can be disabled by setting the `disabled` prop to `true`. When the button is disabled, it becomes non-interactive and its appearance is visually indicated.

## Full Width

By setting the `fullWidth` prop to `true`, the button will take up the full width of its container.

## Additional Customization

You can apply additional CSS classes to the button using the `className` prop. This allows for further customization of the button's appearance.

The `type` prop allows you to specify the type of the button element, which can be `'button'` (default), `'submit'`, or `'reset'`.