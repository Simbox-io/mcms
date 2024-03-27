# Notification Component

The `Notification` component is a reusable React component that displays a notification with customizable content, actions, and status.

## Props

The `Notification` component accepts the following props:

| Prop Name      | Type                      | Description                                                 |
|----------------|---------------------------|-------------------------------------------------------------|
| `id`           | `number`                  | The unique identifier of the notification.                  |
| `userId`       | `number`                  | The identifier of the user associated with the notification. |
| `message`      | `string`                  | The message content of the notification.                    |
| `link`         | `string` (optional)       | An optional link associated with the notification.          |
| `createdAt`    | `Date`                    | The timestamp indicating when the notification was created. |
| `read`         | `boolean`                 | The read status of the notification.                        |
| `onMarkAsRead` | `(notificationId: number) => void` | A callback function to mark the notification as read.       |
| `onDelete`     | `(notificationId: number) => void` | A callback function to delete the notification.             |

## Usage

To use the `Notification` component in your React application, follow these steps:

1. Import the `Notification` component into your file:

```jsx
import Notification from './Notification';
```

2. Render the `Notification` component with the required props:

```jsx
<Notification
  id={1}
  userId={123}
  message="New message received"
  createdAt={new Date()}
  read={false}
  onMarkAsRead={handleMarkAsRead}
  onDelete={handleDelete}
/>
```

3. Implement the `onMarkAsRead` and `onDelete` callback functions to handle the respective actions when the buttons are clicked.

## Styling

The `Notification` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the notification. The appearance of the notification can be customized by modifying the CSS classes applied to the elements.

- The notification container has a white background color (dark mode: gray-800) and a border.
- The `read` prop determines the opacity of the notification. If `read` is `true`, the notification appears with reduced opacity.
- The message content is displayed in gray color (dark mode: gray-400).
- If a `link` prop is provided, it is rendered as a clickable link with blue color (dark mode: blue-400).
- The timestamp of the notification is displayed in a smaller font size and gray color (dark mode: gray-400).

## Actions

The `Notification` component provides two action buttons:

1. "Mark as Read" button:
   - Displayed only if the notification is unread (`read` prop is `false`).
   - Clicking the button triggers the `onMarkAsRead` callback function, passing the `id` of the notification.

2. "Delete" button:
   - Clicking the button triggers the `onDelete` callback function, passing the `id` of the notification.

The appearance and behavior of the buttons are determined by the `Button` component, which is imported separately.

## Date Formatting

The `Notification` component uses the `date-fns` library to format the `createdAt` timestamp. The timestamp is displayed in the format "MMM d, yyyy h:mm a" (e.g., "May 23, 2023 9:30 am").