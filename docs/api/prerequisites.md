## Prerequisites

### Get Prerequisite by ID

- **URL:** `/api/prerequisites/:id`
- **Method:** `GET`
- **Parameters:**
  - `id` (string): The ID of the prerequisite.
- **Response:**
  - `200 OK`: Returns the prerequisite object.
  - `404 Not Found`: The prerequisite was not found.
  - `500 Internal Server Error`: An error occurred while fetching the prerequisite.

### Update Prerequisite

- **URL:** `/api/prerequisites/:id`
- **Method:** `PUT`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the prerequisite.
- **Request Body:**
  - `requiredKnowledge` (string): The updated required knowledge for the prerequisite.
  - `requiredTutorialId` (string, optional): The updated ID of the required tutorial for the prerequisite.
- **Response:**
  - `200 OK`: The prerequisite was successfully updated. Returns the updated prerequisite object.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to update the prerequisite.
  - `404 Not Found`: The prerequisite was not found.
  - `500 Internal Server Error`: An error occurred while updating the prerequisite.

### Delete Prerequisite

- **URL:** `/api/prerequisites/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the prerequisite.
- **Response:**
  - `200 OK`: The prerequisite was successfully deleted.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to delete the prerequisite.
  - `404 Not Found`: The prerequisite was not found.
  - `500 Internal Server Error`: An error occurred while deleting the prerequisite.
