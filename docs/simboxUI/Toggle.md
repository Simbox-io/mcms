# Toggle Component

The `Toggle` component is a reusable React component that represents a toggle switch. It allows users to switch between two states, typically on and off or enabled and disabled.

## Props

The `Toggle` component accepts the following props:

| Prop Name   | Type       | Default     | Description                                                                                                                         |
|-------------|------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `label`     | `string`   | -           | The label text to be displayed next to the toggle switch.                                                                           |
| `checked`   | `boolean`  | -           | The current state of the toggle switch. If `true`, the toggle is in the "on" or "enabled" state. If `false`, it is in the "off" or "disabled" state. |
| `onChange`  | `() => void` | -           | A callback function to be invoked when the toggle state changes. It is triggered when the user clicks or interacts with the toggle switch. |
| `disabled`  | `boolean`  | `false`     | Optional prop to disable the toggle switch. If `true`, the toggle will be in a disabled state and cannot be interacted with.        |
| `className` | `string`   | `''`        | Optional prop to provide additional CSS classes to be applied to the toggle container.                                              |

## Usage

To use the `Toggle` component in your React application, follow these steps:

1. Import the `Toggle` component into your file:

```jsx
import Toggle from './Toggle';
```

2. Render the `Toggle` component with the required props:

```jsx
<Toggle
  label="Enable Notifications"
  checked={isNotificationsEnabled}
  onChange={handleToggleChange}
/>
```

3. Implement the `onChange` callback function to handle the toggle state change:

```jsx
const handleToggleChange = () => {
  setIsNotificationsEnabled(!isNotificationsEnabled);
};
```

## Styling

The `Toggle` component uses Tailwind CSS classes for styling. The appearance of the toggle switch can be customized by modifying the Tailwind classes applied to the component.

The toggle switch consists of the following elements:
- A hidden checkbox input that handles the toggle state.
- A background div (`toggle-bg`) that represents the track of the toggle switch.
- A dot div (`toggle-dot`) that represents the thumb or handle of the toggle switch.

The `checked` prop determines the state of the toggle switch. When `checked` is `true`, additional classes are applied to the background and dot elements to visually indicate the "on" state.

The `disabled` prop is used to disable the toggle switch. When `disabled` is `true`, the toggle switch appears with reduced opacity and cannot be interacted with.

## Accessibility

The `Toggle` component ensures accessibility by using a hidden checkbox input. This allows the toggle switch to be focusable and interactable using keyboard navigation.

The `label` prop is used to provide a text label for the toggle switch, which is associated with the checkbox input. This improves the accessibility and usability of the component.

## Customization

The `Toggle` component provides flexibility for customization through the `className` prop. You can pass additional CSS classes to the toggle container to modify its appearance or apply custom styles.

Additionally, you can customize the colors, sizes, and other visual aspects of the toggle switch by modifying the Tailwind CSS classes applied to the component.