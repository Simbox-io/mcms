# MasonryGrid Component

The `MasonryGrid` component is a reusable React component that renders a masonry-style grid layout with customizable column width and gap between items.

## Props

The `MasonryGrid` component accepts the following props:

| Prop Name      | Type            | Default | Description                                                    |
|----------------|-----------------|---------|----------------------------------------------------------------|
| `items`        | `React.ReactNode[]` | -       | An array of React nodes representing the items to be rendered in the grid. |
| `columnWidth`  | `number`        | `300`   | The width of each column in the grid.                          |
| `gap`          | `number`        | `20`    | The gap between items in the grid.                             |

## Usage

To use the `MasonryGrid` component in your React application, follow these steps:

1. Import the `MasonryGrid` component into your file:

```jsx
import MasonryGrid from './components/MasonryGrid';
```

2. Prepare an array of items to be rendered in the grid:

```jsx
const items = [
  <div>Item 1</div>,
  <div>Item 2</div>,
  <div>Item 3</div>,
  // ...
];
```

3. Render the `MasonryGrid` component with the desired props:

```jsx
<MasonryGrid items={items} columnWidth={250} gap={15} />
```

4. Customize the column width and gap between items by providing different values for the `columnWidth` and `gap` props.

## Responsive Layout

The `MasonryGrid` component automatically adjusts the number of columns based on the available width of the grid container. It calculates the number of columns that can fit within the container width while considering the specified `columnWidth` and `gap` values.

The component uses the `useEffect` hook to update the layout whenever the grid container's width changes or the `columnWidth` or `gap` props are modified. It adds a `resize` event listener to the window to recalculate the number of columns when the window is resized.

## Grid Styling

The `MasonryGrid` component applies the calculated number of columns and gap between items using inline styles. The `getColumnStyles` function generates the necessary CSS styles based on the current number of columns and gap value.

The grid items are wrapped in a `<div>` element with the class name `"masonry-grid-item"`, allowing for further styling if needed.

## Example

Here's an example of how to use the `MasonryGrid` component:

```jsx
import MasonryGrid from './components/MasonryGrid';

const MyComponent = () => {
  const items = [
    <div>Item 1</div>,
    <div>Item 2</div>,
    <div>Item 3</div>,
    // ...
  ];

  return (
    <div>
      <h1>My Masonry Grid</h1>
      <MasonryGrid items={items} columnWidth={250} gap={15} />
    </div>
  );
};

export default MyComponent;
```

In this example, the `MasonryGrid` component is rendered with an array of items, a column width of 250 pixels, and a gap of 15 pixels between items. The component will automatically adjust the number of columns based on the available width of the grid container.