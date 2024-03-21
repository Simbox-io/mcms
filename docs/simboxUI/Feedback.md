# Feedback Component

The `Feedback` component is a reusable React component that displays feedback messages in different formats such as modal, toast, or alert. It provides a customizable and flexible way to show informative, success, warning, or error messages to the user.

## Props

The `Feedback` component accepts the following props:

| Prop Name              | Type                                                                   | Default         | Description                                                                                                                    |
|------------------------|-----------------------------------------------------------------------|-----------------|--------------------------------------------------------------------------------------------------------------------------------|
| `isOpen`               | `boolean`                                                             | -               | Determines whether the feedback is open or closed.                                                                             |
| `onClose`              | `() => void`                                                          | -               | A callback function to be invoked when the feedback is closed.                                                                 |
| `title`                | `string`                                                              | -               | The title of the feedback message (optional).                                                                                  |
| `message`              | `string`                                                              | -               | The content of the feedback message.                                                                                           |
| `type`                 | `'modal'` \| `'toast'` \| `'alert'`                                     | `'modal'`       | The type of feedback to be displayed.                                                                                          |
| `variant`              | `'info'` \| `'success'` \| `'warning'` \| `'error'`                      | `'info'`        | The variant of the feedback, which determines the color scheme.                                                                |
| `duration`             | `number`                                                              | `3000`          | The duration (in milliseconds) for which the toast feedback remains visible.                                                   |
| `position`             | `'top-left'` \| `'top-center'` \| `'top-right'` \| `'bottom-left'` \| `'bottom-center'` \| `'bottom-right'` | `'top-right'`   | The position of the toast feedback on the screen.                                                                              |
| `showCloseButton`      | `boolean`                                                             | `true`          | Determines whether to show the close button in the feedback.                                                                   |
| `className`            | `string`                                                              | `''`            | Additional CSS class name(s) to be applied to the feedback container.                                                          |
| `overlayClassName`     | `string`                                                              | `''`            | Additional CSS class name(s) to be applied to the overlay (applicable only for modal feedback).                                |
| `contentClassName`     | `string`                                                              | `''`            | Additional CSS class name(s) to be applied to the content container (applicable only for modal feedback).                      |
| `titleClassName`       | `string`                                                              | `''`            | Additional CSS class name(s) to be applied to the title container (applicable only for modal feedback).                        |
| `messageClassName`     | `string`                                                              | `''`            | Additional CSS class name(s) to be applied to the message container.                                                           |
| `closeButtonClassName` | `string`                                                              | `''`            | Additional CSS class name(s) to be applied to the close button.                                                                |

## Usage

To use the `Feedback` component in your React application, follow these steps:

1. Import the `Feedback` component into your file:

```jsx
import Feedback from './Feedback';
```

2. Render the `Feedback` component with the desired props:

```jsx
<Feedback
  isOpen={showFeedback}
  onClose={handleCloseFeedback}
  title="Success"
  message="Your action was completed successfully!"
  type="toast"
  variant="success"
  duration={5000}
  position="top-right"
/>
```

3. Customize the appearance and behavior of the feedback by providing different prop values.

## Feedback Types

The `Feedback` component supports three types of feedback:

- `modal`: Displays the feedback as a modal dialog with an overlay. It requires user interaction to close the feedback.
- `toast`: Displays the feedback as a toast message that appears temporarily and automatically disappears after a specified duration.
- `alert`: Displays the feedback as an inline alert message within the content flow.

## Variants

The `Feedback` component provides four variants that determine the color scheme of the feedback:

- `info` (default): Displays the feedback with a blue color scheme, indicating an informative message.
- `success`: Displays the feedback with a green color scheme, indicating a success message.
- `warning`: Displays the feedback with a yellow color scheme, indicating a warning message.
- `error`: Displays the feedback with a red color scheme, indicating an error message.

## Positioning (Toast Feedback)

When using the `toast` feedback type, you can specify the position of the toast message on the screen using the `position` prop. The available positions are:

- `top-left`
- `top-center`
- `top-right` (default)
- `bottom-left`
- `bottom-center`
- `bottom-right`

## Customization

The `Feedback` component allows customization through various props:

- `className`: Applies additional CSS classes to the feedback container.
- `overlayClassName`: Applies additional CSS classes to the overlay (applicable only for modal feedback).
- `contentClassName`: Applies additional CSS classes to the content container (applicable only for modal feedback).
- `titleClassName`: Applies additional CSS classes to the title container (applicable only for modal feedback).
- `messageClassName`: Applies additional CSS classes to the message container.
- `closeButtonClassName`: Applies additional CSS classes to the close button.

These props enable you to customize the appearance of the feedback components according to your application's design requirements.

## Animation

The `Feedback` component utilizes the `framer-motion` library to add smooth animations when the feedback appears and disappears. The animation duration and easing can be customized by modifying the `transition` prop of the `motion` components.

## Accessibility

The `Feedback` component follows accessibility best practices:

- The modal feedback uses the `role="dialog"` attribute to indicate its purpose to assistive technologies.
- The close button in the modal feedback has a descriptive label for screen readers.
- The toast and alert feedbacks use the `role="alert"` attribute to announce their presence to assistive technologies.
- Keyboard focus is managed correctly, and users can close the modal feedback using the Escape key.

## Dependencies

The `Feedback` component has the following dependencies:

- `react`: The React library itself.
- `react-dom`: The React DOM library for rendering components.
- `framer-motion`: A popular animation library for React that provides smooth animations and transitions.

Make sure to install these dependencies in your project before using the `Feedback` component.