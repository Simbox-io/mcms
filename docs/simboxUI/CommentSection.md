# CommentSection Component

The `CommentSection` component is a reusable React component that displays a list of comments and allows users to submit new comments for a specific post or content item.

## Props

The `CommentSection` component accepts the following props:

| Prop Name   | Type     | Description                                                 |
|-------------|----------|-------------------------------------------------------------|
| `postType`  | `string` | The type of the post or content item (e.g., 'blog', 'video'). |
| `contentId` | `string` | The unique identifier of the post or content item.          |

## State

The `CommentSection` component uses the following state variables:

- `comments`: An array of `Comment` objects representing the comments for the post or content item.
- `newComment`: A string representing the content of the new comment being entered by the user.

## Effects

The `CommentSection` component uses the `useEffect` hook to fetch the comments for the post or content item when the component mounts. It calls the `fetchComments` function to retrieve the comments from the server.

## Functions

The `CommentSection` component defines the following functions:

- `fetchComments`: An asynchronous function that fetches the comments for the post or content item from the server using the `/api/${postType}/${contentId}/comments` API endpoint. It updates the `comments` state with the retrieved data.
- `handleSubmitComment`: An asynchronous function that is called when the user submits a new comment. It sends a POST request to the `/api/${postType}/${contentId}/comments` API endpoint with the content of the new comment. If the request is successful, it adds the new comment to the `comments` state and clears the `newComment` state.

## Rendering

The `CommentSection` component renders the following elements:

- A heading displaying the text "Comments".
- A form with a textarea for entering a new comment and a submit button.
- A list of `CommentComponent` components, one for each comment in the `comments` state.

The component uses Tailwind CSS classes for styling.

## Usage

To use the `CommentSection` component in your React application, follow these steps:

1. Import the `CommentSection` component into your file:

```jsx
import CommentSection from './CommentSection';
```

2. Render the `CommentSection` component with the required props:

```jsx
<CommentSection postType="blog" contentId="123" />
```

Make sure to provide the appropriate values for the `postType` and `contentId` props based on the post or content item for which you want to display the comments.

## Dependencies

The `CommentSection` component depends on the following:

- React and the `useState` and `useEffect` hooks from the 'react' package.
- The `CommentComponent` component, which is imported from './CommentComponent'.
- The `Comment` type, which is imported from '@/lib/prisma'.

Make sure to have these dependencies installed and properly configured in your project.