## Search

### Search

- **URL:** `/api/search`
- **Method:** `GET`
- **Authentication:** Required
- **Query Parameters:**
  - `q` (string): The search query.
  - `page` (number, optional): The page number for pagination. Default is 1.
- **Response:**
  - `200 OK`: Returns an object containing the search results (posts, files, projects, spaces, tutorials) and pagination information.
  - `401 Unauthorized`: The user is not authenticated.
  - `500 Internal Server Error`: An error occurred while performing the search.
