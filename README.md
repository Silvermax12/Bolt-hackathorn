# AI Landing Page Generator

A comprehensive system that allows users to create and deploy professional landing pages to Netlify automatically without requiring them to have Netlify accounts.

## 🌟 Features

- **🤖 AI-Powered Generation**: Create professional landing pages with just a title and description
- **🚀 Automatic Deployment**: Deploy directly to Netlify with one click
- **📱 Responsive Design**: Mobile-first, modern landing pages that work on all devices
- **🎨 Beautiful Templates**: Professionally designed templates with gradient backgrounds and animations
- **⚡ Fast Performance**: Optimized HTML, CSS, and JavaScript for maximum speed
- **🛡️ Security**: Rate limiting, input validation, and secure token handling
- **🔧 Modular Architecture**: Easy to extend with themes, authentication, and more features

## 🏗️ Architecture

```
project/
├── src/                     # React Frontend
│   ├── components/          # React components
│   ├── services/           # API service layer
│   └── utils/              # Utility functions
├── backend/                # Flask Backend
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   ├── Dockerfile         # Backend container config
│   └── README.md          # Backend documentation
├── docker-compose.yml     # Development environment
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **Netlify Account** with Personal Access Token
- **Docker** (optional, for containerized development)

### Option 1: Manual Setup

#### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp config.env.example .env

# Edit .env and add your Netlify token
# NETLIFY_TOKEN=your_actual_netlify_token_here

# Start Flask server
python app.py
```

The backend API will be available at `http://localhost:5000`

#### 3. Get Your Netlify Token

1. Go to [Netlify Personal Access Tokens](https://app.netlify.com/user/applications#personal-access-tokens)
2. Click "New access token"
3. Give it a name (e.g., "Landing Page Generator")
4. Copy the token and add it to your `.env` file

### Option 2: Docker Setup

```bash
# Create backend environment file
cp backend/config.env.example backend/.env
# Edit backend/.env and add your Netlify token

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📖 How It Works

### User Flow

1. **Input**: User enters project title and description
2. **Theme Selection**: User chooses from available themes
3. **Preview**: Generated landing page is shown for review
4. **Deploy**: Page is automatically deployed to Netlify
5. **Success**: User receives live URL and admin access

### Technical Flow

1. **Frontend** collects user input and sends to backend
2. **Backend** generates HTML using Jinja2 templates
3. **ZIP Creation** packages HTML with configuration files
4. **Netlify API** creates new site and deploys content
5. **URL Return** provides live site URL back to user

## 🛠️ API Documentation

### Deploy Landing Page
```http
POST /api/deploy
Content-Type: application/json

{
  "title": "My Amazing Project",
  "description": "A comprehensive description of what makes this project special."
}
```

**Response:**
```json
{
  "success": true,
  "site_id": "abc123-def456-ghi789",
  "url": "https://landing-20240101120000-abcdef.netlify.app",
  "admin_url": "https://app.netlify.com/sites/site-name",
  "deployed_at": "2024-01-01T12:00:00Z"
}
```

### Preview Landing Page
```http
POST /api/preview
Content-Type: application/json

{
  "title": "My Amazing Project",
  "description": "A comprehensive description."
}
```

### Health Check
```http
GET /health
```

## 🔒 Security Features

- **Rate Limiting**: 10 deployments per hour per IP (configurable)
- **Input Validation**: Title (max 100 chars), Description (max 500 chars)
- **CORS Protection**: Configured for specific domains
- **Security Headers**: XSS protection, content type validation
- **Token Security**: Netlify token never exposed to frontend

## 🎨 Generated Landing Page Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern Styling**: Beautiful gradients, animations, and hover effects
- **Contact Form**: Functional contact form with validation
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Social Links**: Placeholder social media integration
- **Performance**: Optimized for fast loading and Core Web Vitals

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)
```env
NETLIFY_TOKEN=your_netlify_token_here
FLASK_DEBUG=false
MAX_DEPLOYS_PER_HOUR=10
```

#### Frontend
```env
VITE_API_URL=http://localhost:5000
```

## 🔧 Development

### Adding New Themes

1. Create template in `backend/app.py`:
```python
def create_theme_template(theme_name):
    if theme_name == 'minimal':
        return Template("""
        <!-- Your minimal theme HTML -->
        """)
    # Add more themes...
```

2. Update frontend theme selector in `ThemeStep.tsx`

### Adding Authentication

```python
from flask_jwt_extended import JWTManager, jwt_required

app.config['JWT_SECRET_KEY'] = 'your-secret-key'
jwt = JWTManager(app)

@app.route('/api/deploy', methods=['POST'])
@jwt_required()
def deploy_landing_page():
    # Existing code...
```

### Adding User Management

```python
class UserManager:
    def track_deployment(self, user_id, deployment_info):
        # Track user deployments
        
    def check_user_limits(self, user_id):
        # Check per-user limits
```

## 🚀 Production Deployment

### Backend (Heroku, Railway, DigitalOcean)

```bash
# Using Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Environment variables needed:
# NETLIFY_TOKEN=your_production_token
# FLASK_ENV=production
# MAX_DEPLOYS_PER_HOUR=100
```

### Frontend (Netlify, Vercel, Cloudflare Pages)

```bash
# Build command
npm run build

# Environment variables:
# VITE_API_URL=https://your-backend-url.com
```

## 📊 Rate Limiting

- **Default**: 10 deployments per hour per IP
- **Configurable**: Set `MAX_DEPLOYS_PER_HOUR` environment variable
- **Response**: Returns 429 status when exceeded
- **Reset**: Limits reset every hour

## 🛟 Troubleshooting

### Common Issues

**"NETLIFY_TOKEN not found"**
- Ensure `.env` file exists in backend directory
- Verify token has correct permissions in Netlify

**"CORS error"**
- Check `VITE_API_URL` environment variable
- Verify backend is running on correct port

**"Rate limit exceeded"**
- Wait for next hour or increase limit
- Check for multiple requests from same IP

**"Deployment failed"**
- Verify Netlify token permissions
- Check Netlify account limits
- Review backend logs for detailed errors

### Debug Mode

Enable debug mode for development:

```env
FLASK_DEBUG=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for commercial or personal projects.

## 🙋‍♂️ Support

For support:
1. Check this README for common issues
2. Review backend/README.md for detailed API documentation
3. Open an issue on GitHub
4. Check [Netlify's documentation](https://docs.netlify.com/api/get-started/) for API questions

## 🌟 What's Next

Planned features:
- [ ] Multiple theme options
- [ ] User authentication and project management
- [ ] Custom domain support
- [ ] Analytics integration
- [ ] Template marketplace
- [ ] Bulk deployment tools
- [ ] Custom CSS editor
- [ ] Form builder integration

---

**Built with ❤️ using React, Flask, and Netlify API** 