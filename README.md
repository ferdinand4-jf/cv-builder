# CV Builder SaaS

A complete SaaS platform for building professional CVs online, similar to modele-cv.com.

## Features

- **User Authentication**: Register, Login, Logout, Forgot Password
- **CV Management**: Create, Edit, Delete, Duplicate CVs
- **Templates**: Modern, Classic, ATS Friendly, Creative
- **Customization**: Colors, Fonts, Layouts
- **PDF Export**: Generate and download A4 PDFs
- **Admin Dashboard**: User management, Template management, Statistics
- **RESTful API**: Secure and documented API
- **Dockerized**: Complete containerization
- **CI/CD**: Jenkins pipeline for automated build and deployment

## Tech Stack

### Frontend
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Shadcn UI
- Zustand
- Axios

### Backend
- Node.js v24
- Express.js
- Prisma ORM
- JWT Authentication
- Multer Upload

### Database
- PostgreSQL 18

### Infrastructure
- Docker & Docker Compose
- Nginx Reverse Proxy
- Jenkins CI/CD

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cv-builder.git
cd cv-builder