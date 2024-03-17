## Images

### Get Image by ID

- **URL:** `/api/images/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the image.
- **Response:**
  - `200 OK`: Returns the image data.
  - `404 Not Found`: The image was not found.
  - `500 Internal Server Error`: An error occurred while fetching the image.

### Update Image

- **URL:** `/api/images/:id`
- **Method:** `PUT`
- **Parameters:**
  - `id` (string): The ID of the image.
- **Request Body:**
  - `data` (string): The updated image data.
  - `contentType` (string): The updated content type of the image.
- **Response:**
  - `200 OK`: The image was successfully updated. Returns the updated image object.
  - `500 Internal Server Error`: An error occurred while updating the image.

### Delete Image

- **URL:** `/api/images/:id`
- **Method:** `DELETE`
- **Parameters:**
  - `id` (string): The ID of the image.
- **Response:**
  - `200 OK`: The image was successfully deleted.
  - `500 Internal Server Error`: An error occurred while deleting the image.
