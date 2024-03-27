# SearchResults Component

The `SearchResults` component is a React component that displays search results categorized into different tabs. It receives search results as props and renders them in a tabbed interface.

## Props

The `SearchResults` component accepts the following props:

| Prop Name        | Type                                             | Description                                                 |
|------------------|--------------------------------------------------|-------------------------------------------------------------|
| `results`        | `{ posts: SearchResult[]; files: SearchResult[]; projects: SearchResult[]; spaces: SearchResult[]; tutorials: SearchResult[]; users: SearchResult[]; }` | An object containing search results categorized into different arrays. |
| `onResultClick`  | `(result: SearchResult) => void`                | A callback function to be invoked when a search result is clicked. |

## Usage

To use the `SearchResults` component in your React application, follow these steps:

1. Import the `SearchResults` component into your file:

```jsx
import SearchResults from './SearchResults';
```

2. Render the `SearchResults` component with the required props:

```jsx
<SearchResults
  results={searchResults}
  onResultClick={handleResultClick}
/>
```

3. Provide the search results as the `results` prop, categorized into different arrays for posts, files, projects, spaces, tutorials, and users.

4. Implement the `onResultClick` callback function to handle the click event when a search result is clicked.

## Rendering Logic

The `SearchResults` component renders the search results in a tabbed interface using the `Tabs` component. Each tab represents a different category of search results.

The component iterates over the search results for each category and renders them as individual items within the corresponding tab. If there are no search results for a particular category, a "No results found" message is displayed.

Each search result item is rendered with the following information:
- Avatar image (if available)
- Title
- Content snippet (truncated to 120 characters)
- Author (if available)

Clicking on a search result item triggers the `onResultClick` callback function, passing the clicked result as an argument.

## Icon Rendering

The `renderIcon` function is used to render the appropriate icon for each search result category. It takes the category name as input and returns the corresponding icon component from the `react-icons` library.

## Styling

The `SearchResults` component uses Tailwind CSS classes for styling. The component is wrapped in a container with a white background (dark mode: gray-800) and a shadow effect. The search results are displayed in a scrollable area with a maximum height of 512 pixels.

The individual search result items have hover effects and are styled using Tailwind CSS utility classes.

## Dependencies

The `SearchResults` component has the following dependencies:
- `react`: The React library for building user interfaces.
- `react-icons`: A library that provides a collection of popular icons as React components.
- `./SearchBar`: A module that exports the `SearchResult` type used for the search results.
- `./Avatar`: A custom `Avatar` component used to display user avatars.
- `./Tabs`: A custom `Tabs` component used to render the tabbed interface for search results.

Make sure to install these dependencies and import them correctly in your project.