## Reactions

### Delete Reaction

- **URL:** `/api/reactions/:id`
- **Method:** `DELETE`
- **Authentication:** Required
- **Parameters:**
  - `id` (string): The ID of the reaction.
- **Response:**
  - `200 OK`: The reaction was successfully deleted.
  - `401 Unauthorized`: The user is not authenticated.
  - `403 Forbidden`: The user is not authorized to delete the reaction.
  - `404 Not Found`: The reaction was not found.
  - `500 Internal Server Error`: An error occurred while deleting the reaction.