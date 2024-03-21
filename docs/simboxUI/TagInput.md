# TagInput Component

The `TagInput` component is a reusable React component that allows users to enter and manage a list of tags. It provides an input field where users can type in new tags and displays the existing tags as removable elements.

## Props

The `TagInput` component accepts the following props:

| Prop Name      | Type                  | Default           | Description                                                    |
|----------------|----------------------|-------------------|----------------------------------------------------------------|
| `tags`         | `string[]`           | -                 | An array of strings representing the current tags.             |
| `onChange`     | `(tags: string[]) => void` | -                 | A callback function to be invoked when the tags array changes. |
| `placeholder`  | `string`             | `'Enter tags...'` | The placeholder text for the input field.                      |
| `className`    | `string`             | `''`              | Additional CSS class name(s) to be applied to the component.   |
| `id`           | `string`             | -                 | The ID attribute for the component.                            |

## Usage

To use the `TagInput` component in your React application, follow these steps:

1. Import the `TagInput` component into your file:

```jsx
import TagInput from './TagInput';
```

2. Render the `TagInput` component with the required props:

```jsx
const [tags, setTags] = useState(['react', 'component']);

const handleTagsChange = (newTags: string[]) => {
  setTags(newTags);
};

return (
  <TagInput
    tags={tags}
    onChange={handleTagsChange}
    placeholder="Enter tags..."
    className="my-4"
    id="tag-input"
  />
);
```

3. Customize the appearance and behavior of the component by providing different prop values.

## Functionality

The `TagInput` component allows users to:

- Enter new tags by typing in the input field and pressing the Enter key.
- Remove existing tags by clicking on the remove button (×) next to each tag.
- Remove the last tag by pressing the Backspace key when the input field is empty.

The component maintains the list of tags in the `tags` prop and invokes the `onChange` callback whenever the tags array is modified.

## Styling

The `TagInput` component is styled using Tailwind CSS classes. It has a white background (dark mode: gray-800) with a border and rounded corners. The tags are displayed as blue pills with white text and a remove button.

You can customize the appearance of the component by providing additional CSS classes through the `className` prop.

## Accessibility

The `TagInput` component uses semantic HTML elements and follows accessibility best practices. The input field is properly labeled and focusable, and the remove buttons have appropriate ARIA attributes.

## Example

Here's an example of how to use the `TagInput` component:

```jsx
import React, { useState } from 'react';
import TagInput from './TagInput';

const MyComponent = () => {
  const [tags, setTags] = useState(['react', 'component']);

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  return (
    <div>
      <h2>Enter Tags:</h2>
      <TagInput
        tags={tags}
        onChange={handleTagsChange}
        placeholder="Enter tags..."
        className="my-4"
        id="tag-input"
      />
      <p>Current Tags: {tags.join(', ')}</p>
    </div>
  );
};

export default MyComponent;
```

In this example, the `TagInput` component is used to manage a list of tags. The initial tags are set using the `useState` hook, and the `handleTagsChange` function is called whenever the tags array is modified. The current tags are displayed below the component.