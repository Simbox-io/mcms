# Actions Component

The `Actions` component is a reusable React component that displays a set of action buttons with customizable functionality and styling. It allows users to perform actions such as edit, delete, share, and bookmark.

## Props

The `Actions` component accepts the following props:

| Prop Name    | Type                 | Default | Description                                                    |
|--------------|----------------------|---------|----------------------------------------------------------------|
| `onEdit`     | `() => void`         | -       | Callback function to be invoked when the edit button is clicked. |
| `onDelete`   | `() => void`         | -       | Callback function to be invoked when the delete button is clicked. |
| `onShare`    | `() => void`         | -       | Callback function to be invoked when the share button is clicked. |
| `onBookmark` | `() => void`         | -       | Callback function to be invoked when the bookmark button is clicked. |
| `className`  | `string`             | `''`    | Additional CSS class name(s) to be applied to the actions container. |
| `style`      | `React.CSSProperties` | -       | Custom inline styles to be applied to the actions container.   |

## Usage

To use the `Actions` component in your React application, follow these steps:

1. Import the `Actions` component into your file:

```jsx
import Actions from './Actions';
```

2. Render the `Actions` component with the desired props:

```jsx
<Actions
  onEdit={handleEdit}
  onDelete={handleDelete}
  onShare={handleShare}
  onBookmark={handleBookmark}
/>
```

3. Implement the corresponding callback functions (`handleEdit`, `handleDelete`, `handleShare`, `handleBookmark`) to handle the respective actions when the buttons are clicked.

## Styling

The `Actions` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the action buttons. The appearance of the buttons can be customized by modifying the CSS classes in the component code.

Additionally, you can apply custom CSS classes or inline styles to the actions container using the `className` and `style` props, respectively.

## Animation

The `Actions` component utilizes the `framer-motion` library to add hover and tap animations to the action buttons. When a button is hovered over, it scales up slightly, and when it is tapped, it scales down briefly to provide visual feedback.

## Icon Components

The `Actions` component includes several icon components (`EditIcon`, `DeleteIcon`, `ShareIcon`, `BookmarkIcon`) that are used to display the corresponding icons for each action button. These icon components are implemented as separate functional components and can be customized by modifying their SVG paths or applying CSS classes.

## Conditional Rendering

The `Actions` component conditionally renders the action buttons based on the presence of the respective callback props (`onEdit`, `onDelete`, `onShare`, `onBookmark`). If a callback prop is not provided, the corresponding button will not be rendered.