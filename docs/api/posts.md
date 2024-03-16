## Posts

### Get Posts

- **URL:** `/api/posts`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (number, optional): The page number for pagination. Default is 1.
- **Response:**
  - `200 OK`: Returns an object containing the paginated posts and the total number of pages.
  - `500 Internal Server Error`: An erroroccurred while fetching the posts.

### Create Post

- **URL:** `/api/posts`
- **Method:** `POST`
- **Authentication:** Required
- **Request Body:**
  - `title` (string): The title of the post.
  - `content` (string): The content of the post.
  - `tags` (array of strings): The tags associated with the post.
  - `settings` (object, optional): The settings for the post.
- **Response:**
  - `201 Created`: The post was successfully created. Returns the created post object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the post.

### Get Post Comments

- **URL:** `/api/posts/:id/comments`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the post.
- **Response:**
  - `200 OK`: Returns an array of comments for the post.
  - `500 Internal Server Error`: An error occurred while fetching the post comments.

### Create Post Comment

- **URL:** `/api/posts/:id/comments`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the post.
- **Request Body:**
  - `content` (string): The content of the comment.
  - `parentId` (string, optional): The ID of the parent comment if it's a nested comment.
- **Response:**
  - `201 Created`: The comment was successfully created. Returns the created comment object.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while creating the post comment.

### Get Post Tags

- **URL:** `/api/posts/:id/tags`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the post.
- **Response:**
  - `200 OK`: Returns an array of tags associated with the post.
  - `500 Internal Server Error`: An error occurred while fetching the post tags.

### Add Post Tags

- **URL:** `/api/posts/:id/tags`
- **Method:** `POST`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the post.
- **Request Body:**
  - `tags` (array of strings): The tags to add to the post.
- **Response:**
  - `200 OK`: The tags were successfully added to the post. Returns the updated post object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to add tags to the post.
  - `404 Not Found`: The post was not found.
  - `500 Internal Server Error`: An error occurred while adding the post tags.

### Get Post by ID

- **URL:** `/api/posts/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the post.
- **Response:**
  - `200 OK`: Returns the post object.
  - `404 Not Found`: The post was not found.
  - `500 Internal Server Error`: An error occurred while fetching the post.

### Update Post

- **URL:** `/api/posts/:id`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the post.
- **Request Body:**
  - `title` (string): The updated title of the post.
  - `content` (string): The updated content of the post.
  - `tags` (array of strings): The updated tags associated with the post.
  - `settings` (object, optional): The updated settings for the post.
- **Response:**
  - `200 OK`: The post was successfully updated. Returns the updated post object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to update the post.
  - `404 Not Found`: The post was not found.
  - `500 Internal Server Error`: An error occurred while updating the post.

### Delete Post

- **URL:** `/api/posts/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the post.
- **Response:**
  - `200 OK`: The post was successfully deleted.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to delete the post.
  - `404 Not Found`: The post was not found.
  - `500 Internal Server Error`: An error occurred while deleting the post.
