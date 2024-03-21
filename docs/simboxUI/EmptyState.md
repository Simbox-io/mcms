# EmptyState Component

The `EmptyState` component is a reusable React component that displays a customizable empty state message with an optional title, description, icon, action button, and footer.

## Props

The `EmptyState` component accepts the following props:

| Prop Name              | Type                 | Default | Description                                                                         |
|------------------------|----------------------|---------|------------------------------------------------------------------------------------|
| `title`                | `string`             | -       | The title of the empty state message.                                              |
| `description`          | `string`             | -       | The description of the empty state message.                                        |
| `icon`                 | `React.ReactNode`    | -       | The icon to be displayed above the title.                                          |
| `action`               | `React.ReactNode`    | -       | The action button or element to be displayed below the description.                |
| `footer`               | `React.ReactNode`    | -       | The footer content to be displayed at the bottom of the empty state.               |
| `className`            | `string`             | `''`    | Additional CSS class name(s) to be applied to the empty state container.           |
| `style`                | `React.CSSProperties` | -       | Custom inline styles to be applied to the empty state container.                   |
| `titleClassName`       | `string`             | `''`    | Additional CSS class name(s) to be applied to the title.                           |
| `descriptionClassName` | `string`             | `''`    | Additional CSS class name(s) to be applied to the description.                     |
| `iconClassName`        | `string`             | `''`    | Additional CSS class name(s) to be applied to the icon.                            |
| `actionClassName`      | `string`             | `''`    | Additional CSS class name(s) to be applied to the action button or element.        |
| `footerClassName`      | `string`             | `''`    | Additional CSS class name(s) to be applied to the footer.                          |

## Usage

To use the `EmptyState` component in your React application, follow these steps:

1. Import the `EmptyState` component into your file:

```jsx
import EmptyState from './EmptyState';
```

2. Render the `EmptyState` component with the desired props:

```jsx
<EmptyState
  title="No data found"
  description="Please try again later or contact support for assistance."
  icon={<SearchIcon />}
  action={<Button>Refresh</Button>}
  footer={<Link to="/support">Contact Support</Link>}
/>
```

3. Customize the content and appearance of the empty state by providing different prop values.

## Styling

The `EmptyState` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the empty state container and its child elements. The appearance can be customized by providing additional CSS classes or inline styles using the `className` and `style` props, respectively.

Additionally, you can apply custom CSS classes to specific parts of the empty state using the `titleClassName`, `descriptionClassName`, `iconClassName`, `actionClassName`, and `footerClassName` props.

## Customization

The `EmptyState` component provides flexibility in customizing the content and layout of the empty state message. You can include or omit any of the optional props (`title`, `description`, `icon`, `action`, `footer`) based on your specific requirements.

The `icon`, `action`, and `footer` props accept React nodes, allowing you to pass custom components or elements to be rendered within the empty state.

## Responsiveness

The `EmptyState` component is designed to be responsive and adapt to different screen sizes. It uses flexbox and padding to ensure proper alignment and spacing of the child elements.