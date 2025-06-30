import os
import io
import zipfile
import requests
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from jinja2 import Template
import secrets
import string
import random
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configuration
class Config:
    NETLIFY_TOKEN = os.getenv('NETLIFY_TOKEN')
    MAX_DEPLOYS_PER_HOUR = int(os.getenv('MAX_DEPLOYS_PER_HOUR', '10'))
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'

config = Config()

# Validate required environment variables
if not config.NETLIFY_TOKEN:
    logger.error("NETLIFY_TOKEN environment variable is required")
    raise ValueError("NETLIFY_TOKEN environment variable is required")

# Rate limiting storage (in production, use Redis or database)
deploy_tracker = {}

class NetlifyDeployer:
    """Handles Netlify deployment operations"""
    
    def __init__(self, token):
        self.token = token
        self.base_url = "https://api.netlify.com/api/v1"
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    
    def create_site(self, site_name):
        """Create a new Netlify site"""
        url = f"{self.base_url}/sites"
        payload = {
            "name": site_name,
            "custom_domain": None,
            "force_ssl": True,
            "published": True
        }
        
        response = requests.post(url, json=payload, headers=self.headers)
        if response.status_code == 201:
            return response.json()
        else:
            logger.error(f"Failed to create site: {response.text}")
            raise Exception(f"Failed to create site: {response.text}")
    
    def deploy_site(self, site_id, zip_content):
        """Deploy files to an existing Netlify site"""
        url = f"{self.base_url}/sites/{site_id}/deploys"
        
        files = {"zip": ("site.zip", zip_content, "application/zip")}
        headers = {"Authorization": f"Bearer {self.token}"}
        
        response = requests.post(url, files=files, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            logger.error(f"Failed to deploy site: {response.text}")
            raise Exception(f"Failed to deploy site: {response.text}")

class HTMLGenerator:
    """Generates HTML content for landing pages"""
    
    @staticmethod
    def generate_site_name():
        """Generate a unique site name"""
        timestamp = int(datetime.now().timestamp())
        random_suffix = ''.join(random.choices(string.ascii_lowercase, k=4))
        return f"landing-{timestamp}-{random_suffix}"
    
    @staticmethod
    def create_html_template():
        """Create Jinja2 template for HTML generation"""
        return Template("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <meta name="description" content="{{ description }}">
    <meta name="keywords" content="landing page, business, professional, {{ title }}">
    <meta name="author" content="{{ title }}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="{{ title }}">
    <meta property="og:description" content="{{ description }}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="/og-image.jpg">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ title }}">
    <meta name="twitter:description" content="{{ description }}">
    <meta name="twitter:image" content="/og-image.jpg">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: {{ theme.colors.text if theme else '#333' }};
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header Section */
        .header {
            background: {{ theme.colors.primary if theme else 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }};
            {% if theme and theme.colors %}
            background: linear-gradient(135deg, {{ theme.colors.primary }} 0%, {{ theme.colors.secondary }} 100%);
            {% endif %}
            color: white;
            padding: 100px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><polygon fill="rgba(255,255,255,0.1)" points="1000,0 1000,100 0,100"/></svg>');
            background-size: cover;
        }
        
        .header h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        .header p {
            font-size: 1.3rem;
            margin-bottom: 40px;
            opacity: 0.95;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            z-index: 1;
        }
        
        .cta-button {
            display: inline-block;
            background: {{ theme.colors.accent if theme else '#ff6b6b' }};
            color: white;
            padding: 18px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        /* Features Section */
        .features {
            padding: 100px 0;
            background: {{ theme.colors.background if theme else '#f8f9fa' }};
        }
        
        .features h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 60px;
            color: {{ theme.colors.text if theme else '#2c3e50' }};
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
            margin-top: 60px;
        }
        
        .feature-card {
            background: white;
            padding: 40px 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border-top: 4px solid {{ theme.colors.accent if theme else '#3498db' }};
        }
        
        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .feature-card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: {{ theme.colors.text if theme else '#2c3e50' }};
        }
        
        .feature-card p {
            color: {{ theme.colors.text if theme else '#666' }};
            opacity: 0.8;
        }
        
        /* Contact Section */
        .contact {
            padding: 100px 0;
            background: {{ theme.colors.primary if theme else 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }};
            {% if theme and theme.colors %}
            background: linear-gradient(135deg, {{ theme.colors.primary }} 0%, {{ theme.colors.secondary }} 100%);
            {% endif %}
            color: white;
            text-align: center;
        }
        
        .contact h2 {
            font-size: 2.5rem;
            margin-bottom: 20px;
        }
        
        .contact p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.9;
        }
        
        .contact-form {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }
        
        .form-group input::placeholder,
        .form-group textarea::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: {{ theme.colors.accent if theme else '#ff6b6b' }};
            background: rgba(255, 255, 255, 0.15);
        }
        
        .form-group textarea {
            height: 120px;
            resize: vertical;
        }
        
        .submit-button {
            background: {{ theme.colors.accent if theme else '#ff6b6b' }};
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .submit-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        
        /* Footer */
        .footer {
            background: #1a252f;
            color: white;
            padding: 40px 0;
            text-align: center;
        }
        
        .footer p {
            margin-bottom: 20px;
        }
        
        .social-links a {
            color: {{ theme.colors.accent if theme else '#ff6b6b' }};
            text-decoration: none;
            margin: 0 15px;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .social-links a:hover {
            opacity: 0.8;
        }
        
        /* Built with Bolt.new Badge */
        .bolt-badge {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 0.85rem;
            font-weight: 600;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
            border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .bolt-badge:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
            color: white;
        }
        
        .bolt-badge::before {
            content: '⚡';
            margin-right: 6px;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2.5rem;
            }
            
            .header p {
                font-size: 1.1rem;
            }
            
            .features h2,
            .contact h2 {
                font-size: 2rem;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
            
            .bolt-badge {
                bottom: 10px;
                right: 10px;
                padding: 6px 12px;
                font-size: 0.8rem;
            }
        }
    </style>
</head>
<body>
    <!-- Header Section -->
    <section class="header">
        <div class="container">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <a href="#contact" class="cta-button">Get Started Today</a>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features">
        <div class="container">
            <h2>Why Choose Us?</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>Fast & Reliable</h3>
                    <p>Built with modern technology to ensure optimal performance and reliability for your needs.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💡</div>
                    <h3>Innovative Solutions</h3>
                    <p>Cutting-edge features and functionalities designed to give you a competitive advantage.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3>Results Focused</h3>
                    <p>Every feature is designed with your success in mind, delivering measurable results.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact" id="contact">
        <div class="container">
            <h2>Ready to Get Started?</h2>
            <p>Contact us today and let's discuss how we can help you achieve your goals.</p>
            
            <form class="contact-form" id="contactForm">
                <div class="form-group">
                    <input type="text" name="name" placeholder="Your Name" required>
                </div>
                <div class="form-group">
                    <input type="email" name="email" placeholder="Your Email" required>
                </div>
                <div class="form-group">
                    <textarea name="message" placeholder="Your Message" required></textarea>
                </div>
                <button type="submit" class="submit-button">Send Message</button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; {{ current_year }} {{ title }}. All rights reserved.</p>
            <div class="social-links">
                <a href="#" target="_blank">Twitter</a>
                <a href="#" target="_blank">LinkedIn</a>
                <a href="#" target="_blank">Facebook</a>
                <a href="#" target="_blank">Instagram</a>
            </div>
        </div>
    </footer>

    <!-- Built with Bolt.new Badge -->
    <a href="https://bolt.new" target="_blank" class="bolt-badge">
        Built with Bolt.new
    </a>

    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Form submission handler
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Simulate form submission
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
        
        // Add scroll effect for header
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('.header');
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    </script>
</body>
</html>
        """)
    
    @classmethod
    def generate_landing_page(cls, title, description, theme=None):
        """Generate HTML content for a landing page with optional theme"""
        template = cls.create_html_template()
        current_year = datetime.now().year
        
        return template.render(
            title=title,
            description=description,
            current_year=current_year,
            theme=theme
        )
    
    @staticmethod
    def create_zip_file(html_content):
        """Create a ZIP file containing the HTML content"""
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Add index.html
            zip_file.writestr('index.html', html_content)
            
            # Add _redirects file for Netlify SPA routing
            zip_file.writestr('_redirects', '/* /index.html 200')
            
            # Add netlify.toml for configuration
            netlify_config = """
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
"""
            zip_file.writestr('netlify.toml', netlify_config)
        
        zip_buffer.seek(0)
        return zip_buffer.getvalue()

def check_rate_limit(client_ip):
    """Basic rate limiting implementation"""
    current_hour = datetime.now().hour
    if client_ip not in deploy_tracker:
        deploy_tracker[client_ip] = {}
    
    if current_hour not in deploy_tracker[client_ip]:
        deploy_tracker[client_ip][current_hour] = 0
    
    # Clean old hours
    deploy_tracker[client_ip] = {
        hour: count for hour, count in deploy_tracker[client_ip].items()
        if hour >= current_hour - 1
    }
    
    if deploy_tracker[client_ip][current_hour] >= config.MAX_DEPLOYS_PER_HOUR:
        return False
    
    deploy_tracker[client_ip][current_hour] += 1
    return True

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/deploy', methods=['POST'])
def deploy_landing_page():
    """
    Deploy a landing page to Netlify
    
    Expected JSON payload:
    {
        "title": "My Project",
        "description": "A great project description",
        "theme": {
            "id": "custom",
            "name": "My Theme",
            "colors": {
                "primary": "#3B82F6",
                "secondary": "#1E40AF",
                "accent": "#F59E0B",
                "text": "#1F2937",
                "background": "#FFFFFF"
            }
        }
    }
    """
    try:
        # Get client IP for rate limiting
        client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        
        # Check rate limiting
        if not check_rate_limit(client_ip):
            return jsonify({
                'error': 'Rate limit exceeded',
                'message': f'Maximum {config.MAX_DEPLOYS_PER_HOUR} deployments per hour allowed'
            }), 429
        
        # Validate request data
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        theme = data.get('theme')  # Optional theme data
        
        if not title:
            return jsonify({'error': 'Title is required'}), 400
        
        if not description:
            return jsonify({'error': 'Description is required'}), 400
        
        # Validate input lengths
        if len(title) > 100:
            return jsonify({'error': 'Title must be 100 characters or less'}), 400
        
        if len(description) > 500:
            return jsonify({'error': 'Description must be 500 characters or less'}), 400
        
        logger.info(f"Starting deployment for: {title} with theme: {theme.get('name') if theme else 'default'}")
        
        # Initialize services
        deployer = NetlifyDeployer(config.NETLIFY_TOKEN)
        
        # Generate unique site name
        site_name = HTMLGenerator.generate_site_name()
        
        # Generate HTML content with theme
        html_content = HTMLGenerator.generate_landing_page(title, description, theme)
        
        # Create ZIP file
        zip_content = HTMLGenerator.create_zip_file(html_content)
        
        # Create Netlify site
        site_info = deployer.create_site(site_name)
        site_id = site_info['id']
        
        # Deploy to Netlify
        deploy_info = deployer.deploy_site(site_id, zip_content)
        
        logger.info(f"Successfully deployed site: {deploy_info.get('ssl_url')}")
        
        # Return deployment information
        return jsonify({
            'success': True,
            'site_id': site_id,
            'deploy_id': deploy_info['id'],
            'url': deploy_info['ssl_url'],
            'admin_url': deploy_info.get('admin_url'),
            'title': title,
            'description': description,
            'theme': theme.get('name') if theme else 'default',
            'deployed_at': deploy_info['created_at']
        }), 200
        
    except Exception as e:
        logger.error(f"Deployment failed: {str(e)}")
        return jsonify({
            'error': 'Deployment failed',
            'message': str(e)
        }), 500

@app.route('/api/preview', methods=['POST'])
def preview_landing_page():
    """
    Generate a preview of the landing page without deploying
    
    Expected JSON payload:
    {
        "title": "My Project",
        "description": "A great project description",
        "theme": {
            "id": "custom",
            "name": "My Theme",
            "colors": {
                "primary": "#3B82F6",
                "secondary": "#1E40AF",
                "accent": "#F59E0B",
                "text": "#1F2937",
                "background": "#FFFFFF"
            }
        }
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        title = data.get('title', '').strip()
        description = data.get('description', '').strip()
        theme = data.get('theme')  # Optional theme data
        
        if not title:
            return jsonify({'error': 'Title is required'}), 400
        
        if not description:
            return jsonify({'error': 'Description is required'}), 400
        
        # Generate HTML content with theme
        html_content = HTMLGenerator.generate_landing_page(title, description, theme)
        
        return jsonify({
            'success': True,
            'html': html_content,
            'title': title,
            'description': description,
            'theme': theme.get('name') if theme else 'default'
        }), 200
        
    except Exception as e:
        logger.error(f"Preview generation failed: {str(e)}")
        return jsonify({
            'error': 'Preview generation failed',
            'message': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=config.DEBUG, host='0.0.0.0', port=5000) 