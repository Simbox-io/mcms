# CommentComponent

The `CommentComponent` is a React functional component that represents a comment in a comment section. It displays the comment's author, content, timestamp, and provides functionality for upvoting, downvoting, saving, and reporting the comment.

## Props

The `CommentComponent` accepts the following prop:

| Prop Name | Type     | Description                                       |
|-----------|----------|---------------------------------------------------|
| `comment` | `Comment` | The comment object to be displayed in the component. |

## State

The `CommentComponent` uses the following state variables:

| State Variable | Type      | Default | Description                                                 |
|----------------|-----------|---------|-------------------------------------------------------------|
| `isUpvoted`    | `boolean` | `false` | Indicates whether the comment is upvoted by the user.       |
| `isDownvoted`  | `boolean` | `false` | Indicates whether the comment is downvoted by the user.     |
| `isSaved`      | `boolean` | `false` | Indicates whether the comment is saved by the user.         |
| `isReported`   | `boolean` | `false` | Indicates whether the comment is reported by the user.      |

## Functionality

The `CommentComponent` provides the following functionality:

- Displaying the comment's author, content, and timestamp.
- Recursive rendering of child comments if the comment has any.
- Upvoting and downvoting the comment with visual feedback.
- Saving and reporting the comment with visual feedback.
- Deleting the comment if the current user is the author of the comment.

## Usage

To use the `CommentComponent`, follow these steps:

1. Import the `CommentComponent` into your file:

```jsx
import CommentComponent from './CommentComponent';
```

2. Render the `CommentComponent` with the required `comment` prop:

```jsx
<CommentComponent comment={comment} />
```

## Dependencies

The `CommentComponent` relies on the following dependencies:

- `react`: The React library for building user interfaces.
- `next-auth/react`: A library for authentication in Next.js applications.
- `@/lib/prisma`: A custom library that defines the `Comment` and `User` types.

## Styling

The `CommentComponent` uses Tailwind CSS classes for styling. The component is styled with a gray background, rounded corners, and appropriate spacing. The comment's author, content, and timestamp are displayed with different font styles and colors.

The upvote, downvote, save, and report buttons are styled with appropriate icons and colors based on their state. The delete button is only visible if the current user is the author of the comment.

## Icons

The `CommentComponent` uses SVG icons for the upvote, downvote, save, and report buttons. The icons are defined as separate functional components (`UpvoteIcon`, `DownvoteIcon`, `SaveIcon`, and `ReportIcon`) and are rendered within the respective buttons.
Add to Conversation