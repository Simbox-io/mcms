# NotificationDropdown Component

The `NotificationDropdown` component is a reusable React component that displays a dropdown menu with notifications. It fetches notifications from an API endpoint and allows users to mark notifications as read.

## Props

The `NotificationDropdown` component does not accept any props.

## State

The `NotificationDropdown` component uses the following state variables:

| State Variable   | Type            | Initial Value | Description                                           |
|------------------|-----------------|---------------|-------------------------------------------------------|
| `notifications`  | `Notification[]` | `[]`          | An array of notification objects fetched from the API. |
| `isOpen`         | `boolean`       | `false`       | Indicates whether the dropdown menu is open or closed. |

## Effects

The `NotificationDropdown` component uses the `useEffect` hook to fetch notifications from the API when the component mounts. It makes a GET request to the `/api/notifications` endpoint and updates the `notifications` state with the fetched data.

## Functions

The `NotificationDropdown` component defines the following functions:

### `toggleDropdown`

This function toggles the `isOpen` state between `true` and `false`, which controls the visibility of the dropdown menu.

### `markAsRead`

This function takes a `notificationId` as a parameter and makes a PUT request to the `/api/notifications/:notificationId` endpoint to mark the notification as read. It updates the `notifications` state by mapping over the array and updating the `read` property of the corresponding notification.

## Rendering

The `NotificationDropdown` component renders the following elements:

- A button with a bell icon (`FiBell`) that toggles the dropdown menu when clicked.
- A red dot indicator on the button if there are unread notifications.
- A dropdown menu that appears when `isOpen` is `true`, containing:
  - A header with the text "Notifications".
  - A list of notification items, each displaying the notification message, a "Mark as Read" button (if the notification is unread), and the time elapsed since the notification was created.
  - A footer with a "Notification Settings" button.

The component uses Tailwind CSS classes for styling.

## Usage

To use the `NotificationDropdown` component in your React application, follow these steps:

1. Import the `NotificationDropdown` component into your file:

```jsx
import NotificationDropdown from './NotificationDropdown';
```

2. Render the `NotificationDropdown` component in your desired location:

```jsx
<NotificationDropdown />
```

The component will fetch notifications from the API and display them in the dropdown menu when the bell icon is clicked.

Note: Make sure you have the necessary API endpoints set up to fetch notifications (`/api/notifications`) and mark notifications as read (`/api/notifications/:notificationId`).