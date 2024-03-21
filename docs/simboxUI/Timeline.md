# Timeline Component

The `Timeline` component is a reusable React component that displays a timeline of events or milestones. It allows you to showcase a series of items in a chronological order, with customizable content, icons, colors, and layout options.

## Props

The `Timeline` component accepts the following props:

| Prop Name              | Type                 | Default     | Description                                                                                  |
|------------------------|----------------------|-------------|----------------------------------------------------------------------------------------------|
| `items`                | `TimelineItem[]`     | -           | An array of timeline items to be displayed.                                                  |
| `className`            | `string`             | `''`        | Additional CSS class name(s) to be applied to the timeline container.                        |
| `style`                | `React.CSSProperties`| -           | Custom inline styles to be applied to the timeline container.                                |
| `itemClassName`        | `string`             | `''`        | Additional CSS class name(s) to be applied to each timeline item.                            |
| `titleClassName`       | `string`             | `''`        | Additional CSS class name(s) to be applied to the title of each timeline item.               |
| `descriptionClassName` | `string`             | `''`        | Additional CSS class name(s) to be applied to the description of each timeline item.         |
| `dateClassName`        | `string`             | `''`        | Additional CSS class name(s) to be applied to the date of each timeline item.                |
| `iconClassName`        | `string`             | `''`        | Additional CSS class name(s) to be applied to the icon of each timeline item.                |
| `lineColor`            | `string`             | `'gray-300'`| The color of the vertical line connecting the timeline items.                                |
| `lineWidth`            | `number`             | `2`         | The width of the vertical line connecting the timeline items.                                |
| `alternateItems`       | `boolean`            | `false`     | Whether to alternate the position of timeline items (left/right) for a zigzag layout.         |

## Usage

To use the `Timeline` component in your React application, follow these steps:

1. Import the `Timeline` component into your file:

```jsx
import Timeline from './Timeline';
```

2. Prepare an array of timeline items with the required properties (`id`, `title`, `date`) and optional properties (`description`, `icon`, `color`):

```jsx
const timelineItems = [
  {
    id: '1',
    title: 'Event 1',
    description: 'Description of event 1',
    date: 'January 1, 2023',
    icon: <FaCalendar />,
    color: '#ff0000',
  },
  // Add more timeline items...
];
```

3. Render the `Timeline` component with the desired props:

```jsx
<Timeline
  items={timelineItems}
  className="custom-timeline"
  itemClassName="custom-item"
  titleClassName="custom-title"
  descriptionClassName="custom-description"
  dateClassName="custom-date"
  iconClassName="custom-icon"
  lineColor="#cccccc"
  lineWidth={3}
  alternateItems
/>
```

4. Customize the appearance and behavior of the timeline by providing different prop values and CSS classes.

## Customization

The `Timeline` component provides various props to customize its appearance and behavior:

- Use the `className`, `itemClassName`, `titleClassName`, `descriptionClassName`, `dateClassName`, and `iconClassName` props to apply custom CSS classes to different parts of the timeline.
- Customize the color and width of the vertical line connecting the timeline items using the `lineColor` and `lineWidth` props.
- Set the `alternateItems` prop to `true` to alternate the position of timeline items (left/right) for a zigzag layout.

Additionally, you can apply custom inline styles to the timeline container using the `style` prop.

## TimelineItem Interface

The `TimelineItem` interface defines the structure of each timeline item. It includes the following properties:

- `id` (required): A unique identifier for the timeline item.
- `title` (required): The title or heading of the timeline item.
- `description` (optional): A brief description or additional details about the timeline item.
- `date` (required): The date or timestamp associated with the timeline item.
- `icon` (optional): An icon element to be displayed alongside the timeline item.
- `color` (optional): The background color of the icon.

Make sure to provide the necessary data for each timeline item when using the `Timeline` component.