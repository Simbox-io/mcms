# CategoryFilter Component

The `CategoryFilter` component is a reusable React component that allows users to select a category from a dropdown menu and provides a search functionality to filter the available options. It utilizes the `framer-motion` library for animations.

## Props

The `CategoryFilter` component accepts the following props:

| Prop Name   | Type                                             | Default | Description                                                    |
|-------------|--------------------------------------------------|---------|----------------------------------------------------------------|
| `options`   | `{ label: string; icon?: React.ReactNode }[]`    | -       | An array of objects representing the available category options. Each object should have a `label` property and an optional `icon` property. |
| `onSelect`  | `(category: string) => void`                     | -       | A callback function that is invoked when a category is selected. It receives the selected category as an argument. |
| `className` | `string`                                         | `''`    | Additional CSS class name(s) to be applied to the component's root element. |
| `label`     | `string`                                         | `''`    | The label text for the category filter.                        |

## Usage

To use the `CategoryFilter` component in your React application, follow these steps:

1. Import the `CategoryFilter` component into your file:

```jsx
import CategoryFilter from './CategoryFilter';
```

2. Render the `CategoryFilter` component with the required props:

```jsx
<CategoryFilter
  options={[
    { label: 'Category 1', icon: <Icon1 /> },
    { label: 'Category 2', icon: <Icon2 /> },
    // ...
  ]}
  onSelect={handleCategorySelect}
  label="Select a category"
/>
```

3. Implement the `onSelect` callback function to handle the selected category:

```jsx
const handleCategorySelect = (category: string) => {
  // Handle the selected category
  console.log('Selected category:', category);
};
```

## Functionality

The `CategoryFilter` component provides the following functionality:

- Displays a dropdown button with the selected category or a placeholder text if no category is selected.
- Clicking the dropdown button toggles the visibility of the category options.
- The category options are rendered in a dropdown menu that animates in and out using the `framer-motion` library.
- Users can search for specific categories by typing in the search input field. The options are filtered based on the search term.
- Clicking on a category option selects that category, updates the selected category state, and invokes the `onSelect` callback with the selected category.
- The selected category is highlighted in the dropdown menu.
- If no categories match the search term, a "No categories found" message is displayed.

## Styling

The `CategoryFilter` component uses utility classes from a CSS framework (e.g., Tailwind CSS) to style the various elements. The appearance can be customized by modifying the CSS classes or providing additional styles through the `className` prop.

The component also supports dark mode styling by using CSS classes prefixed with `dark:`.

## Animation

The `CategoryFilter` component utilizes the `framer-motion` library to animate the dropdown menu. The menu fades in and slides down when opened, and fades out and slides up when closed. The animation duration is set to 0.2 seconds.