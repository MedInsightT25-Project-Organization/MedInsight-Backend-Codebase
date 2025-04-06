# MedInsight-API
This API will help patients to have access to medical healthcare such as lab tests, booking of medical appointments, etc.

## Environment Setup

### Required Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=27017
DB_NAME=medinsight
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Configuration (if needed)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# API Keys (if needed)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Environment Setup Instructions
1. Copy the `.env.example` file to `.env`
2. Update the values with your specific configuration
3. Never commit the `.env` file to version control
4. For production, set `NODE_ENV=production`
5. Use different JWT secrets for development and production

### Development Environment
- Install Node.js (v14 or higher)
- Install MongoDB (v4.4 or higher)
- Run `npm install` to install dependencies
- Run `npm run dev` to start the development server

### Production Environment
- Set up a production database
- Configure proper security settings
- Use environment-specific configurations
- Enable proper logging and monitoring

## Project Structure (MVC Architecture)
The project follows the Model-View-Controller (MVC) architectural pattern for better organization and maintainability:

```
MedInsight-API/
├── src/
│   ├── controllers/     # Handles request/response logic
│   ├── models/          # Database models and schemas
│   ├── views/           # Frontend templates (if needed)
│   ├── routes/          # API route definitions
│   ├── middleware/      # Custom middleware functions
│   ├── config/          # Configuration files
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── app.js           # Main application file
├── tests/               # Test files
├── .env                 # Environment variables
├── .gitignore          # Git ignore file
└── package.json        # Project dependencies
```

## GitHub Collaboration Guidelines

### Branching Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Pull Request Process
1. Create a new branch from `develop` for your feature/fix
2. Make your changes and commit with descriptive messages
3. Push your branch to GitHub
4. Create a Pull Request (PR) to `develop`
5. Request review from at least one team member
6. Address any feedback
7. Once approved, merge into `develop`

### Commit Message Guidelines
- Use present tense ("Add feature" not "Added feature")
- Keep messages concise but descriptive
- Reference issue numbers if applicable

### Code Review Checklist
- [ ] Code follows project style guide
- [ ] Tests are included for new features
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Security best practices are followed

