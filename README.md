# MCMS - Modern Content Management System

MCMS is a powerful and flexible content management system built with modern web technologies. It provides a comprehensive set of features for managing and collaborating on various types of content, including posts, files, projects, and wikis.

MCMS (Modern Content Management System) is an exciting new open-source Content Management System designed specifically for developers and coding enthusiasts. Built using cutting-edge technologies such as TypeScript, React, PostgreSQL, and Prisma ORM, MCMS offers a comprehensive set of features that cater to the unique needs of the developer community.

At its core, MCMS provides a robust platform for creating and managing various types of content. With MCMS, you can effortlessly publish articles, create dynamic pages, and maintain a wiki-style documentation system. This allows you to showcase your projects, share insights, and provide valuable resources to the community.

One of the standout features of MCMS is its built-in forum functionality. Engage with fellow developers, ask questions, and participate in discussions on a wide range of topics. The forums serve as a hub for knowledge sharing and collaboration, fostering an active and supportive community within the developer space.

MCMS also offers a flexible membership system, enabling you to create different user roles and manage access to your content. With granular content restriction settings, you can control who can view, edit, or contribute to specific areas of your site. This ensures that your content remains secure and tailored to your desired audience.

In addition to its content management capabilities, MCMS provides a convenient file-sharing feature. Easily upload and share code snippets, project files, and resources with other developers. This promotes collaboration and facilitates the exchange of ideas and best practices among community members.

As an open-source project, MCMS is completely free to use and deploy. You have the freedom to host it on your own servers or utilize your preferred cloud providers. This flexibility allows you to have full control over your CMS environment and customize it to suit your specific requirements.

MCMS is particularly well-suited for developers interested in cloud technologies, infrastructure as code (IaC) using Terraform, and container orchestration with Kubernetes. The platform aims to provide a space where developers can showcase their projects, share tutorials, and engage in discussions related to these cutting-edge technologies.

With its modern architecture, extensive feature set, and focus on the developer community, MCMS is poised to become a go-to platform for developers seeking a powerful and flexible Content Management System. Whether you're looking to create a personal blog, document your projects, or build a thriving community around your favorite technologies, MCMS has you covered.

Join the MCMS community today and experience the future of content management for developers!

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
