# MCMS - Modern Content Management System

MCMS is a powerful and flexible content management system built with modern web technologies. It provides a comprehensive set of features for managing and collaborating on various types of content, including posts, files, projects, and wikis.

## Features

- **User Authentication**: Secure user registration and login functionality using Next Auth.
- **User Roles and Permissions**: Granular access control based on user roles and permissions.
- **Post Management**: Create, edit, and delete posts with rich text editing capabilities.
- **File Management**: Upload, organize, and manage files with support for multiple file storage providers.
- **Project Management**: Create and collaborate on projects with team members.
- **Wiki System**: Create and maintain a knowledge base using a wiki-style documentation system.
- **Search Functionality**: Powerful search capabilities to easily find posts, files, and projects.
- **Tagging and Categorization**: Organize content using tags and categories for better discoverability.
- **User Profiles**: Comprehensive user profiles with avatars, bios, and social links.
- **Activity Feed**: Stay up to date with recent activities and notifications.
- **Admin Dashboard**: Powerful admin interface for managing users, content, and site settings.
- **Responsive UI**: Beautifully designed, mobile-friendly user interface built with Tailwind CSS.
- **Dark Mode**: Toggle between light and dark modes for optimal viewing experience.
- **Extensibility**: Plugin system and API support for extending the functionality of MCMS.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered and statically generated applications.
- **Next Auth**: Authentication library for Next.js applications.
- **Prisma**: Modern database toolkit for TypeScript and Node.js.
- **PostgreSQL**: Powerful open-source relational database.
- **Tailwind CSS**: Utility-first CSS framework for rapidly building custom user interfaces.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **AWS S3**: Cloud storage service for storing and retrieving files.
- **Nodemailer**: Module for sending emails from Node.js applications.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL database
- AWS S3 bucket (optional, for file storage)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/mcms.git
   ```

2. Install the dependencies:

   ```bash
   cd mcms
   npm install
   ```

3. Set up the environment variables:

   - Create a `.env` file in the root directory.
   - Provide the necessary environment variables (database connection, AWS S3 credentials, email configuration, etc.).

4. Set up the database:

   - Create a new PostgreSQL database for MCMS.
   - Update the `DATABASE_URL` in the `.env` file with your database connection string.

5. Run the database migrations:

   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open your browser and visit `http://localhost:3000` to access the MCMS application.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next Auth](https://next-auth.js.org/)
- [AWS S3](https://aws.amazon.com/s3/)
- [Nodemailer](https://nodemailer.com/)
