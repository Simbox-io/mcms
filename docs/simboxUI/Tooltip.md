# Tooltip Component

The `Tooltip` component is a reusable React component that displays a tooltip with customizable content, placement, trigger, delay, and styling options.

## Props

The `Tooltip` component accepts the following props:

| Prop Name         | Type                                       | Default   | Description                                                                                  |
|-------------------|-------------------------------------------|-----------|----------------------------------------------------------------------------------------------|
| `children`        | `React.ReactNode`                          | -         | The content to be wrapped by the tooltip.                                                    |
| `content`         | `string`                                   | -         | The content to be displayed inside the tooltip.                                              |
| `placement`       | `'top'` \| `'right'` \| `'bottom'` \| `'left'` | `'top'`   | The placement of the tooltip relative to the wrapped content.                                |
| `trigger`         | `'hover'` \| `'click'`                       | `'hover'` | The event that triggers the tooltip visibility.                                              |
| `delay`           | `number`                                   | `0`       | The delay (in milliseconds) before showing the tooltip.                                      |
| `className`       | `string`                                   | `''`      | Additional CSS class name(s) to be applied to the tooltip wrapper.                           |
| `style`           | `React.CSSProperties`                       | -         | Custom inline styles to be applied to the tooltip wrapper.                                   |
| `tooltipClassName` | `string`                                   | `''`      | Additional CSS class name(s) to be applied to the tooltip content.                           |
| `tooltipStyle`    | `React.CSSProperties`                       | -         | Custom inline styles to be applied to the tooltip content.                                   |
| `arrow`           | `boolean`                                  | `true`    | Whether to display an arrow pointing to the wrapped content.                                 |
| `arrowSize`       | `number`                                   | `6`       | The size (in pixels) of the arrow.                                                           |
| `arrowClassName`  | `string`                                   | `''`      | Additional CSS class name(s) to be applied to the arrow.                                     |

## Usage

To use the `Tooltip` component in your React application, follow these steps:

1. Import the `Tooltip` component into your file:

```jsx
import Tooltip from './Tooltip';
```

2. Wrap the content you want to have a tooltip with the `Tooltip` component:

```jsx
<Tooltip content="This is a tooltip" placement="right">
  <button>Hover me</button>
</Tooltip>
```

3. Customize the appearance and behavior of the tooltip by providing different prop values.

## Placement

The `placement` prop determines the position of the tooltip relative to the wrapped content. It accepts one of the following values: `'top'`, `'right'`, `'bottom'`, or `'left'`. The default placement is `'top'`.

## Trigger

The `trigger` prop specifies the event that triggers the visibility of the tooltip. It can be either `'hover'` (default) or `'click'`. When set to `'hover'`, the tooltip will appear when the user hovers over the wrapped content. When set to `'click'`, the tooltip will toggle its visibility when the user clicks on the wrapped content.

## Delay

The `delay` prop allows you to specify a delay (in milliseconds) before showing the tooltip. This can be useful to prevent the tooltip from appearing immediately when the user accidentally hovers over the wrapped content. The default delay is `0`.

## Styling

The `Tooltip` component provides several props for customizing its appearance:

- `className` and `style` props can be used to apply additional CSS classes or inline styles to the tooltip wrapper.
- `tooltipClassName` and `tooltipStyle` props can be used to apply additional CSS classes or inline styles to the tooltip content.
- `arrow`, `arrowSize`, and `arrowClassName` props control the appearance of the arrow pointing to the wrapped content.

The component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the tooltip and arrow. You can customize the appearance further by providing your own CSS classes or inline styles.

## Accessibility

To ensure accessibility, it is recommended to provide meaningful and descriptive content for the tooltip. The tooltip should provide additional information or context that enhances the user experience and understanding of the wrapped content.