# Landing Page Generator Backend

A Flask backend service that automatically generates and deploys landing pages to Netlify without requiring users to have Netlify accounts.

## Features

- 🚀 **Automatic Deployment**: Deploy landing pages to Netlify with one API call
- 🎨 **Custom HTML Generation**: Generate beautiful, responsive landing pages
- 🛡️ **Security**: Rate limiting, input validation, and secure token handling
- 📱 **Responsive Design**: Mobile-first, modern landing pages
- ⚡ **Fast**: In-memory ZIP creation and efficient deployment
- 🔧 **Modular**: Easy to extend with themes, authentication, and more

## Prerequisites

- Python 3.8+
- Netlify account with Personal Access Token
- pip (Python package manager)

## Quick Setup

### 1. Get Your Netlify Token

1. Go to [Netlify Personal Access Tokens](https://app.netlify.com/user/applications#personal-access-tokens)
2. Click "New access token"
3. Give it a name (e.g., "Landing Page Generator")
4. Copy the generated token

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file in the backend directory:

```bash
cp config.env.example .env
```

Edit `.env` and add your Netlify token:

```env
NETLIFY_TOKEN=your_actual_netlify_token_here
FLASK_DEBUG=false
MAX_DEPLOYS_PER_HOUR=10
```

### 4. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Documentation

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00",
  "version": "1.0.0"
}
```

### Deploy Landing Page
```http
POST /api/deploy
Content-Type: application/json

{
  "title": "My Amazing Project",
  "description": "A comprehensive description of what makes this project special and unique."
}
```

**Response (Success):**
```json
{
  "success": true,
  "site_id": "abc123-def456-ghi789",
  "deploy_id": "deploy123",
  "url": "https://landing-20240101120000-abcdef.netlify.app",
  "admin_url": "https://app.netlify.com/sites/site-name",
  "title": "My Amazing Project",
  "description": "A comprehensive description...",
  "deployed_at": "2024-01-01T12:00:00Z"
}
```

**Response (Error):**
```json
{
  "error": "Deployment failed",
  "message": "Detailed error message"
}
```

### Preview Landing Page
```http
POST /api/preview
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
  "html": "<!DOCTYPE html>...",
  "title": "My Amazing Project",
  "description": "A comprehensive description..."
}
```

## Rate Limiting

- Default: 10 deployments per hour per IP address
- Configure via `MAX_DEPLOYS_PER_HOUR` environment variable
- Returns 429 status when limit exceeded

## Input Validation

- **Title**: Required, max 100 characters
- **Description**: Required, max 500 characters
- Both fields are trimmed and sanitized

## Security Features

- **Input Sanitization**: All user inputs are validated and sanitized
- **Rate Limiting**: Prevents abuse with configurable limits
- **CORS Protection**: Configured for frontend domains
- **Security Headers**: Added via netlify.toml
- **Token Security**: Netlify token never exposed to frontend

## Generated Landing Page Features

- 📱 **Fully Responsive**: Works perfectly on all devices
- 🎨 **Modern Design**: Beautiful gradient backgrounds and animations
- 📧 **Contact Form**: Functional contact form with validation
- 🔗 **Social Links**: Placeholder social media links
- 🛡️ **Security Headers**: XSS protection, content type validation
- ⚡ **Performance**: Optimized CSS and JavaScript
- 🔍 **SEO Ready**: Meta tags, Open Graph, and structured data

## Architecture

```
Backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── config.env.example    # Environment configuration template
└── README.md             # This file

Classes:
├── NetlifyDeployer       # Handles Netlify API operations
├── HTMLGenerator         # Creates HTML content and ZIP files
└── Config                # Application configuration
```

## Production Deployment

### Using Gunicorn

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### Environment Variables for Production

```env
NETLIFY_TOKEN=your_production_token
FLASK_ENV=production
FLASK_DEBUG=false
MAX_DEPLOYS_PER_HOUR=50
```

## Extending the System

### Adding Authentication

```python
from flask_jwt_extended import JWTManager, jwt_required

# Add to app.py
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
jwt = JWTManager(app)

@app.route('/api/deploy', methods=['POST'])
@jwt_required()
def deploy_landing_page():
    # Existing code...
```

### Adding Custom Themes

```python
class ThemeManager:
    THEMES = {
        'modern': 'path/to/modern_template.html',
        'minimal': 'path/to/minimal_template.html',
        'corporate': 'path/to/corporate_template.html'
    }
    
    @classmethod
    def get_template(cls, theme_name):
        # Return appropriate template
```

### Adding User Management

```python
class UserManager:
    def __init__(self, db_connection):
        self.db = db_connection
    
    def track_deployment(self, user_id, deployment_info):
        # Track user deployments for analytics
        
    def check_user_limits(self, user_id):
        # Check per-user deployment limits
```

## Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `400`: Bad Request (invalid input)
- `429`: Rate Limit Exceeded
- `500`: Internal Server Error

## Logging

Logs are written to stdout with the following levels:
- `INFO`: Successful deployments, startup messages
- `ERROR`: Deployment failures, configuration errors
- `WARNING`: Rate limit violations, validation errors

## Troubleshooting

### Common Issues

1. **"NETLIFY_TOKEN not found"**
   - Ensure `.env` file exists with valid token
   - Check token has correct permissions

2. **"Rate limit exceeded"**
   - Wait for next hour or increase `MAX_DEPLOYS_PER_HOUR`
   - Check if multiple requests from same IP

3. **"Failed to create site"**
   - Verify Netlify token permissions
   - Check Netlify account limits

4. **CORS errors**
   - Verify frontend domain in CORS configuration
   - Check if running on different ports

### Debug Mode

Enable debug mode for development:

```env
FLASK_DEBUG=true
```

This provides detailed error messages and auto-reload on file changes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - feel free to use this for commercial or personal projects.

## Support

For support, please check:
1. This README for common issues
2. Netlify's API documentation
3. Flask documentation for framework questions 