#!/usr/bin/env python3
"""
Startup script for the Landing Page Generator backend.
Includes environment validation and helpful error messages.
"""

import os
import sys
from pathlib import Path

def check_environment():
    """Check that all required environment variables are set."""
    required_vars = ['NETLIFY_TOKEN']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n💡 Please create a .env file in the backend directory with:")
        print("   NETLIFY_TOKEN=your_netlify_token_here")
        print("\n🔗 Get your token from: https://app.netlify.com/user/applications#personal-access-tokens")
        return False
    
    return True

def check_dependencies():
    """Check that required Python packages are installed."""
    try:
        import flask
        import flask_cors
        import requests
        import jinja2
        import dotenv
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("\n💡 Please install dependencies with:")
        print("   pip install -r requirements.txt")
        return False

def main():
    """Main startup function."""
    print("🚀 Starting Landing Page Generator Backend...")
    print("=" * 50)
    
    # Check if .env file exists
    env_file = Path('.env')
    if not env_file.exists():
        print("⚠️  No .env file found. Creating from template...")
        template_file = Path('config.env.example')
        if template_file.exists():
            print("💡 Please copy config.env.example to .env and add your Netlify token")
        else:
            print("💡 Please create a .env file with your Netlify token")
        return False
    
    # Check dependencies
    if not check_dependencies():
        return False
    
    # Load environment and check variables
    from dotenv import load_dotenv
    load_dotenv()
    
    if not check_environment():
        return False
    
    # Import and start the Flask app
    try:
        from app import app
        print("✅ Environment configured successfully")
        print("🌐 Starting Flask server on http://localhost:5000")
        print("📖 API documentation available at: http://localhost:5000/health")
        print("=" * 50)
        
        app.run(
            debug=os.getenv('FLASK_DEBUG', 'False').lower() == 'true',
            host='0.0.0.0',
            port=5000
        )
        
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return False

if __name__ == '__main__':
    success = main()
    if not success:
        sys.exit(1) 