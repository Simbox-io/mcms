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

## Getting Started

### Prerequisites
- Node.js 18+ and npm installed
- PostgreSQL database
- AWS account (for file storage) [optional]

### Installation

There are two ways to set up MCMS: using Docker (recommended) or manual installation.

#### Using Docker (Recommended)

1. Clone the repository
```bash
git clone https://github.com/Simbox-io/mcms.git
cd mcms
```

2. Start with Docker Compose
```bash
docker-compose up
```

This will:
- Start PostgreSQL database
- Run migrations automatically
- Seed the database with initial data
- Start the Next.js development server
- Open [http://localhost:3000](http://localhost:3000) in your browser

**Default Admin Credentials:**
- Email: admin@example.com
- Password: password123

#### Manual Installation

1. Clone the repository
```bash
git clone https://github.com/Simbox-io/mcms.git
cd mcms
```

2. Install dependencies
```bash
npm install
```

3. Set up PostgreSQL database and update .env file with your database connection string
```
DATABASE_URL="postgresql://username:password@localhost:5432/mcms?schema=public"
```

4. Run database migrations
```bash
npx prisma migrate deploy
```

5. Generate Prisma client
```bash
npx prisma generate
```

6. Seed the database
```bash
npm run seed
```

7. Run the development server
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Troubleshooting Database Issues

If you encounter database errors about missing tables, you can run:

```bash
npm run fix:schema
```

This will:
1. Compare your Prisma schema with the actual database
2. Create a new migration to add any missing tables
3. Apply the migration and regenerate the Prisma client

## Features

- **User Authentication**: Secure user registration and login functionality using Clerk.
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
- **Prisma**: Modern database toolkit for TypeScript and Node.js.
- **PostgreSQL**: Powerful open-source relational database.
- **Tailwind CSS**: Utility-first CSS framework for rapidly building custom user interfaces.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **AWS S3**: Cloud storage service for storing and retrieving files.
- **Nodemailer**: Module for sending emails from Node.js applications.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **Node-Cache**: A simple caching module for Node.js applications.
- **SWR**: Stale-while-revalidate, a React Hooks library for data fetching.
- **React**: A JavaScript library for building user interfaces.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [GNU GPL v2 License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [AWS S3](https://aws.amazon.com/s3/)
- [Nodemailer](https://nodemailer.com/)
