# Popover Component

The `Popover` component is a reusable React component that displays a popover with customizable content, trigger, placement, and animations.

## Props

The `Popover` component accepts the following props:

| Prop Name          | Type                                   | Default     | Description                                                                                  |
|--------------------|----------------------------------------|-------------|----------------------------------------------------------------------------------------------|
| `trigger`          | `React.ReactNode`                      | -           | The element or component that triggers the popover when clicked.                             |
| `content`          | `React.ReactNode`                      | -           | The content to be displayed inside the popover.                                              |
| `placement`        | `'top'` \| `'right'` \| `'bottom'` \| `'left'` | `'bottom'`  | The placement of the popover relative to the trigger element.                                |
| `offset`           | `number`                               | `8`         | The offset distance between the popover and the trigger element.                             |
| `onOpen`           | `() => void`                           | -           | A callback function to be invoked when the popover is opened.                                |
| `onClose`          | `() => void`                           | -           | A callback function to be invoked when the popover is closed.                                |
| `className`        | `string`                               | `''`        | Additional CSS class name(s) to be applied to the popover container.                         |
| `triggerClassName` | `string`                               | `''`        | Additional CSS class name(s) to be applied to the trigger element.                           |
| `contentClassName` | `string`                               | `''`        | Additional CSS class name(s) to be applied to the popover content.                           |
| `arrowClassName`   | `string`                               | `''`        | Additional CSS class name(s) to be applied to the popover arrow.                             |

## Usage

To use the `Popover` component in your React application, follow these steps:

1. Import the `Popover` component into your file:

```jsx
import Popover from './Popover';
```

2. Render the `Popover` component with the desired props:

```jsx
<Popover
  trigger={<button>Open Popover</button>}
  content={<div>Popover content goes here</div>}
  placement="right"
  offset={12}
  onOpen={() => console.log('Popover opened')}
  onClose={() => console.log('Popover closed')}
>
```

3. Customize the appearance and behavior of the popover by providing different prop values.

## Placement

The `placement` prop determines the position of the popover relative to the trigger element. It accepts one of the following values: `'top'`, `'right'`, `'bottom'` (default), or `'left'`. The popover will be positioned accordingly based on the specified placement.

## Offset

The `offset` prop specifies the distance between the popover and the trigger element. It accepts a number value, with the default being `8`. Adjust this value to control the spacing between the popover and the trigger.

## Callbacks

The `Popover` component provides two callback props: `onOpen` and `onClose`. These callbacks are invoked when the popover is opened and closed, respectively. You can use these callbacks to perform any desired actions or side effects when the popover state changes.

## Styling

The `Popover` component allows you to customize the styling of different parts of the popover using CSS class names. The following class names can be provided via props:

- `className`: Applied to the popover container.
- `triggerClassName`: Applied to the trigger element.
- `contentClassName`: Applied to the popover content.
- `arrowClassName`: Applied to the popover arrow.

You can use these class names to apply custom styles or override the default styles of the popover.

## Animations

The `Popover` component utilizes the `framer-motion` library to add animations when the popover is opened and closed. The popover content fades in and scales up when opened, and fades out and scales down when closed. The animation duration is set to 0.2 seconds by default.

## Closing the Popover

The popover automatically closes when the user clicks outside the popover or the trigger element. This behavior is implemented using an event listener that detects clicks outside the popover and trigger elements and closes the popover accordingly.