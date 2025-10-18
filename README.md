# SC3040-SoftwareEng-School4U

**School4U** - A comprehensive web application designed to help students and parents find the right school in Singapore. This platform simplifies the school selection process by providing detailed information about schools, including programs, CCAs, and location-based recommendations.

## 🚀 Features

- **School Search & Discovery**: Search for schools by name, level, and location
- **Detailed School Information**: View comprehensive details including contact info, programs, and CCAs
- **Interactive Comparison**: Compare multiple schools side-by-side
- **Parent Chat Forums**: Connect with other parents for advice and discussions
- **Favorites System**: Save and manage your preferred schools
- **Location-based Services**: Find schools near specific areas
- **Authentication System**: Secure user registration and login

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - Database and authentication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (usually comes with Node.js)
- **Git** (for version control)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/AtariGoh/SC3040-SoftwareEng-School4U.git
cd SC3040-SoftwareEng-School4U
```

### 2. Set Up Environment Variables

Create a `.env` file in the `SC3040/Backend` directory:

```bash
cd SC3040/Backend
touch .env
```

Add the following environment variables to the `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Node Environment
NODE_ENV=development

# Server Port (optional, defaults to 5001)
PORT=5001
```

### 3. Install Dependencies

#### Install Frontend Dependencies
```bash
cd SC3040
npm install
```

#### Install Backend Dependencies
```bash
cd Backend
npm install
```

### 4. Start the Development Servers

You'll need to run both the frontend and backend servers simultaneously. Open **two terminal windows**:

#### Terminal 1 - Start Backend Server
```bash
cd SC3040/Backend
npm start
# or for development with auto-restart:
npm run dev
```
The backend server will start on **http://localhost:5001**

#### Terminal 2 - Start Frontend Server
```bash
cd SC3040
npm run dev
```
The frontend development server will start on **http://localhost:5173** (or another port if 5173 is occupied)

### 5. Access the Application

Open your web browser and navigate to the frontend URL (usually **http://localhost:5173** or **http://localhost:5174**)

## 📁 Project Structure

```
SC3040-SoftwareEng-School4U/
├── SC3040/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   ├── pages/                   # Page components
│   │   ├── context/                 # React Context (Auth, etc.)
│   │   ├── assets/                  # Images and static files
│   │   ├── App.jsx                  # Main App component
│   │   └── main.jsx                 # Entry point
│   ├── Backend/                     # Backend (Node.js + Express)
│   │   ├── database/                # Database query functions
│   │   ├── routes/                  # API route handlers
│   │   ├── server.js                # Main server file
│   │   ├── Auth.js                  # Authentication middleware
│   │   └── .env                     # Environment variables
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   └── tailwind.config.js          # Tailwind CSS configuration
└── README.md                        # This file
```

## 🔧 Available Scripts

### Frontend Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint for code quality
```

### Backend Scripts
```bash
npm start        # Start production server
npm run dev      # Start development server with auto-restart (nodemon)
npm test         # Run tests (not implemented yet)
```

## 🌐 API Endpoints

The backend provides the following API endpoints:

### Authentication
- `POST /api/login` - User login
- `POST /api/signup` - User registration
- `POST /api/logout` - User logout
- `GET /api/verifySession` - Verify user session

### Schools Data
- `GET /api/schools` - Get schools with filters (query, level, location)
- `POST /api/addToFav` - Add school to favorites
- `GET /api/fetchFav` - Get user's favorite schools

### Chat & Communication
- `POST /api/chat/verify-access` - Verify chat access
- Other chat routes for parent forums

### Utilities
- `POST /api/get-coordinates` - Get coordinates for addresses

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- **Access tokens** - Short-lived tokens for API access
- **Refresh tokens** - Long-lived tokens for session management
- **HTTP-only cookies** - Secure token storage

## 🗄️ Database

The application uses **Supabase** as the backend database service, which provides:
- PostgreSQL database
- Real-time subscriptions
- Built-in authentication
- Row Level Security (RLS)

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes using the ports
   lsof -ti:5001 | xargs kill -9  # Backend port
   lsof -ti:5173 | xargs kill -9  # Frontend port
   ```

2. **Module Not Found Errors**
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **CORS Errors**
   - Ensure backend is running on port 5001
   - Check that frontend port (5173/5174) is included in CORS settings

4. **Authentication Issues**
   - Verify JWT_SECRET is set in .env file
   - Check browser cookies are enabled
   - Clear browser cache and cookies

### Development Tips

- **Hot Reload**: Both frontend and backend support hot reload during development
- **Console Logging**: Check browser console and terminal output for debugging
- **Network Tab**: Use browser DevTools Network tab to monitor API calls
- **Database**: Use Supabase dashboard to inspect database tables and data

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Team

Developed as part of SC3040 Software Engineering course at NTU.

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Contact the development team

---

**Happy Coding! 🎉**
