## Comments

### Create a Comment

- **URL:** `/api/comments`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  - `content` (string): The content of the comment.
  - `postId` (string, optional): The ID of the post the comment belongs to.
  - `fileId` (string, optional): The ID of the file the comment belongs to.
  - `projectId` (string, optional): The ID of the project the comment belongs to.
  - `pageId` (string, optional): The ID of the page the comment belongs to.
  - `parentId` (string, optional): The ID of the parent comment if it's a nested comment.
  - `tutorialId` (string, optional): The ID of the tutorial the comment belongs to.
- **Response:**
  - `201 Created`: The comment was successfully created. Returns the created comment object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the comment.

### Get Comment Reactions

- **URL:** `/api/comments/:id/reactions`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the comment.
- **Response:**
  - `200 OK`: Returns an array of comment reactions.
  - `500 Internal Server Error`: An error occurred while fetching the comment reactions.

### Add or Remove Comment Reaction

- **URL:** `/api/comments/:id/reactions`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the comment.
- **Request Body:**
  - `type` (string): The type of the reaction.
- **Response:**
  - `201 Created`: The reaction was successfully added. Returns the created reaction object.
  - `200 OK`: The reaction was successfully removed.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating or removing the comment reaction.

### Get Comment by ID

- **URL:** `/api/comments/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the comment.
- **Response:**
  - `200 OK`: Returns the comment object.
  - `404 Not Found`: The comment was not found.
  - `500 Internal Server Error`: An error occurred while fetching the comment.

### Update Comment

- **URL:** `/api/comments/:id`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the comment.
- **Request Body:**
  - `content` (string): The updated content of the comment.
  - `settings` (object, optional): The updated settings of the comment.
- **Response:**
  - `200 OK`: The comment was successfully updated. Returns the updated comment object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to update the comment.
  - `404 Not Found`: The comment was not found.
  - `500 Internal Server Error`: An error occurred while updating the comment.

### Delete Comment

- **URL:** `/api/comments/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the comment.
- **Response:**
  - `200 OK`: The comment was successfully deleted.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to delete the comment.
  - `404 Not Found`: The comment was not found.
  - `500 Internal Server Error`: An error occurred while deleting the comment.