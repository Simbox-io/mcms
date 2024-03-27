## Tags

### Get Tags

- **URL:** `/api/tags`
- **Method:** `GET`
- **Response:**
  - `200 OK`: Returns an array of tags.
  - `500 Internal Server Error`: An error occurred while fetching the tags.

### Create Tag

- **URL:** `/api/tags`
- **Method:** `POST`
- **Request Body:**
  - `name` (string): The name of the tag.
- **Response:**
  - `201 Created`: The tag was successfully created. Returns the created tag object.
  - `500 Internal Server Error`: An error occurred while creating the tag.

### Get Tag by ID

- **URL:** `/api/tags/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the tag.
- **Response:**
  - `200 OK`: Returns the tag object.
  - `404 Not Found`: The tag was not found.
  - `500 Internal Server Error`: An error occurred while fetching the tag.

### Update Tag

- **URL:** `/api/tags/:id`
- **Method:** `PUT`
- **Parameters:**
  - `id` (string): The ID of the tag.
- **Request Body:**
  - `name` (string): The updated name of the tag.
- **Response:**
  - `200 OK`: The tag was successfully updated. Returns the updated tag object.
  - `500 Internal Server Error`: An error occurred while updating the tag.

### Delete Tag

- **URL:** `/api/tags/:id`
- **Method:** `DELETE`
- **Parameters:**
  - `id` (string): The ID of the tag.
- **Response:**
  - `200 OK`: The tag was successfully deleted.
  - `500 Internal Server Error`: An error occurred while deleting the tag.
