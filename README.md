# Portfolio Canvas

A modern, responsive portfolio website built with React, TypeScript, and database integration.

## Features

- 🎨 **Dynamic Content**: All content loaded from database
- 🚀 **Performance Optimized**: Lazy loading, memoization, and efficient animations
- 📱 **Responsive Design**: Works perfectly on all devices
- 🌙 **Dark Mode**: Built-in theme switching
- 🗄️ **Database Integration**: PostgreSQL with Drizzle ORM
- 🔄 **Real-time Updates**: Content updates without code changes

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express
- **Database**: PostgreSQL, Drizzle ORM
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: React Query

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-canvas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db
   ```

4. **Database Setup**
   ```bash
   # Push database schema
   npm run db:push

   # Seed with sample data
   npm run db:seed
   ```

5. **Development**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5001`

## Database Schema

### Tables

- **users**: User authentication
- **profile**: Personal information and social links
- **skills**: Expertise areas
- **experiences**: Work experience
- **projects**: Portfolio projects

### API Endpoints

- `GET /api/skills` - Get all skills
- `GET /api/experiences` - Get all experiences
- `GET /api/projects` - Get all projects
- `GET /api/profile` - Get profile information
- `POST /api/seed` - Seed database with sample data

## Content Management

### Adding New Content

1. **Skills**: Add to database via API or direct database insertion
2. **Projects**: Include image URLs or base64 encoded images
3. **Profile**: Update personal information and social links

### Image Storage Options

1. **External URLs**: Store image URLs in `imageUrl` field
2. **Base64 Encoding**: Store images as base64 strings in `imageData` field
3. **File System**: Store images in `attached_assets/` and reference by path

## Performance Optimizations

- ✅ Lazy loading for images
- ✅ React.memo for components
- ✅ React Query for caching
- ✅ Reduced animation complexity
- ✅ Optimized backdrop filters

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details