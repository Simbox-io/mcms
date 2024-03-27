# SearchBar Component

The `SearchBar` component is a reusable React component that provides a search input field with real-time search results and debounced search functionality.

## Props

The `SearchBar` component accepts the following props:

| Prop Name      | Type                  | Default         | Description                                                    |
|----------------|----------------------|-----------------|----------------------------------------------------------------|
| `onSearch`     | `(query: string) => void` | -               | A callback function to be invoked when a search is performed.  |
| `className`    | `string`             | `''`            | Additional CSS class name(s) to be applied to the search bar.  |
| `placeholder`  | `string`             | `'Search...'`   | The placeholder text for the search input field.               |
| `value`        | `string`             | -               | The current value of the search input field.                   |
| `onChange`     | `(value: string) => void` | -               | A callback function to be invoked when the search input value changes. |

## Usage

To use the `SearchBar` component in your React application, follow these steps:

1. Import the `SearchBar` component into your file:

```jsx
import SearchBar from './SearchBar';
```

2. Render the `SearchBar` component with the desired props:

```jsx
<SearchBar
  onSearch={handleSearch}
  placeholder="Search..."
  className="my-search-bar"
/>
```

3. Implement the `onSearch` callback function to handle the search functionality when a search is performed.

## Functionality

The `SearchBar` component provides the following functionality:

- Real-time search results: As the user types in the search input field, the component fetches search results from an API endpoint (`/api/search`) and displays them in a dropdown below the search bar.
- Debounced search: The search functionality is debounced using the `debounce` function from the `lodash` library to avoid making excessive API requests while the user is typing.
- Loading state: While the search results are being fetched, a loading skeleton is displayed in the dropdown to indicate that the search is in progress.
- Search result categories: The search results are categorized into different types such as posts, files, projects, spaces, tutorials, and users. Each category is displayed separately in the search results dropdown.
- Click outside to close: Clicking outside the search bar or the search results dropdown will close the dropdown.
- Navigation on result click: When a search result is clicked, the component navigates to the corresponding URL using the `useRouter` hook from Next.js.

## Styling

The `SearchBar` component is styled using Tailwind CSS classes. The appearance of the search bar and search results dropdown can be customized by modifying the CSS classes or providing additional styles through the `className` prop.

The component also supports dark mode styling by using the `dark:` prefix for Tailwind CSS classes.

## Animation

The `SearchBar` component uses the `framer-motion` library to animate the appearance and disappearance of the search results dropdown. The dropdown fades in and slides up when opened, and fades out and slides down when closed.

## Dependencies

The `SearchBar` component has the following dependencies:

- `react`: The React library for building the component.
- `framer-motion`: A library for adding animations to React components.
- `lodash`: A utility library that provides the `debounce` function for debouncing the search functionality.
- `@/components/base/Skeleton`: A custom `Skeleton` component used for displaying loading skeletons.
- `@/components/base/SearchResults`: A custom `SearchResults` component used for rendering the search results dropdown.
- `next/navigation`: The Next.js navigation library for handling navigation on search result clicks.

Make sure to install these dependencies and import them correctly in your project.