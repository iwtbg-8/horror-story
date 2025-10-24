# 🎃 Dark Tales - Horror Stories Website

A full-featured horror story website with an immersive reading experience and comprehensive admin panel. Built with the MERN stack (MongoDB, Express, React, Node.js).

![Horror Theme](https://img.shields.io/badge/Theme-Horror-8B0000)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-18+-green)

## ✨ Features

### 🌟 User Features
- **Immersive Reading Experience**: Dark, horror-themed UI with atmospheric effects
- **Story Discovery**: Browse stories by category, difficulty, tags, and popularity
- **Advanced Search**: Filter stories by multiple criteria
- **User Authentication**: Secure JWT-based login and registration
- **Favorites & Reading History**: Save favorite stories and track reading progress
- **Like & Bookmark**: Engage with stories through likes and bookmarks
- **Responsive Design**: Fully responsive on all devices

### 👻 Story Features
- **Rich Story Content**: Full-text horror stories with excerpts
- **Categories**: Organize stories into multiple horror categories
- **Difficulty Levels**: Mild, Moderate, Intense, and Extreme ratings
- **Reading Time**: Auto-calculated reading time estimates
- **View Counter**: Track story popularity
- **Featured Stories**: Highlight special stories on the homepage
- **Tags System**: Organize stories with custom tags

### 🔐 Admin Panel Features
- **Dashboard Analytics**: 
  - Total stories, users, categories statistics
  - View and like counters
  - Recent and popular stories overview
  
- **Story Management**:
  - Create, edit, and delete stories
  - Rich text editor for story content
  - Set story status (published/draft/archived)
  - Mark stories as featured
  - Upload cover images
  - Tag management
  
- **Category Management**:
  - Create and edit categories
  - Custom icons and colors
  - Track stories per category
  - Prevent deletion of categories with stories
  
- **User Management**:
  - View all registered users
  - User role management
  - Delete non-admin users
  - Track user activity

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd "New Folder"
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/horror_stories
JWT_SECRET=your_secure_jwt_secret_here
ADMIN_EMAIL=admin@horrorstories.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:3000
```

5. **Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

6. **Run the application**

Development mode (both frontend and backend):
```bash
npm run dev
```

Or run separately:

Backend only:
```bash
npm run server
```

Frontend only:
```bash
npm run client
```

Production build:
```bash
npm run build
npm start
```

## 📁 Project Structure

```
horror-stories-website/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   ├── Story.js         # Story schema
│   │   └── Category.js      # Category schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── stories.js       # Story routes
│   │   ├── categories.js    # Category routes
│   │   └── admin.js         # Admin routes
│   ├── middleware/
│   │   └── auth.js          # Auth middleware
│   └── server.js            # Express server
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── StoryCard.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Stories.js
│   │   │   ├── StoryDetail.js
│   │   │   ├── Categories.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   └── admin/
│   │   │       ├── Dashboard.js
│   │   │       ├── Stories.js
│   │   │       ├── StoryForm.js
│   │   │       ├── Categories.js
│   │   │       └── Users.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Design Features

### Horror Theme
- **Dark Color Scheme**: Deep blacks with blood-red accents
- **Gothic Typography**: Creepy fonts for titles and headers
- **Atmospheric Effects**: Glowing shadows and pulse animations
- **Smooth Transitions**: Hover effects and page transitions
- **Custom Scrollbar**: Themed scrollbar matching the horror aesthetic

### UI Components
- **Responsive Navigation**: Mobile-friendly menu with smooth animations
- **Story Cards**: Beautiful cards with difficulty badges and stats
- **Loading States**: Themed loading spinners
- **Toast Notifications**: Dark-themed success/error messages
- **Form Inputs**: Custom-styled form elements

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Stories
- `GET /api/stories` - Get all stories (with filters)
- `GET /api/stories/featured` - Get featured stories
- `GET /api/stories/:slug` - Get single story
- `POST /api/stories/:id/like` - Like a story
- `POST /api/stories/:id/favorite` - Add to favorites
- `POST /api/stories/:id/progress` - Update reading progress

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get single category

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/stories` - Get all stories (admin view)
- `POST /api/admin/stories` - Create story
- `PUT /api/admin/stories/:id` - Update story
- `DELETE /api/admin/stories/:id` - Delete story
- `GET /api/admin/categories` - Get categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user

## 🔐 Default Admin Access

After setup, create an admin user by registering with these credentials or modify a user in MongoDB:

1. Register a new account
2. In MongoDB, update the user document:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Or use MongoDB Compass to change the user's role to "admin".

## 🎯 Usage Guide

### For Readers
1. Browse stories on the homepage
2. Use filters to find stories by category, difficulty, or search
3. Click on a story to read the full content
4. Register to like stories, save favorites, and track reading progress
5. View your profile to see saved stories and reading history

### For Admins
1. Log in with admin credentials
2. Access the Admin Panel from the navigation
3. View dashboard statistics and insights
4. Create/Edit/Delete stories through the story management interface
5. Manage categories with custom icons and colors
6. View and manage registered users

## 🛠️ Technology Stack

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Framer Motion** - Animations
- **React Icons** - Icon library

## 📱 Screenshots

*(Add your screenshots here once deployed)*

- Homepage with featured stories
- Story reading interface
- Admin dashboard
- Story management
- Category management

## 🚧 Future Enhancements

- [ ] Comments and discussions on stories
- [ ] User ratings and reviews
- [ ] Story recommendations based on reading history
- [ ] Dark/Light theme toggle
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Advanced text editor for story creation
- [ ] Image upload functionality
- [ ] Story series/chapters support
- [ ] User profiles with avatars
- [ ] Reading time tracking
- [ ] Mobile app

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- None at the moment

## 📞 Support

For support, email support@horrorstories.com or open an issue in the repository.

## 🙏 Acknowledgments

- Horror font from Google Fonts
- Icons from React Icons
- Inspiration from classic horror literature

---

**Happy Horror Reading! 👻🎃💀**

*May your nightmares be entertaining!*
