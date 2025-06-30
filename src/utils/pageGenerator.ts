import { ProjectInfo, ThemeOption, GeneratedPage } from '../types';

export const generateMetaTags = (projectName: string, projectDescription: string) => {
  const title = `${projectName} - Professional Landing Page`;
  const description = projectDescription.length > 160 
    ? projectDescription.substring(0, 157) + '...' 
    : projectDescription;
  
  // Generate keywords from project name and description
  const keywords = [
    projectName.toLowerCase(),
    ...projectDescription.toLowerCase().split(/\W+/).filter(word => word.length > 3)
  ].slice(0, 10).join(', ');

  return {
    title,
    description,
    keywords
  };
};

export const attachAnalytics = (trackingId: string = 'G-XXXXXXXXXX') => {
  return `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${trackingId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}');
    </script>
  `;
};

export const buildLandingPage = ({
  projectName,
  projectDescription,
  themeChoice
}: ProjectInfo & { themeChoice: ThemeOption }): GeneratedPage => {
  const metaTags = generateMetaTags(projectName, projectDescription);
  const analytics = attachAnalytics();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaTags.title}</title>
    <meta name="description" content="${metaTags.description}">
    <meta name="keywords" content="${metaTags.keywords}">
    <meta property="og:title" content="${metaTags.title}">
    <meta property="og:description" content="${metaTags.description}">
    <meta property="og:type" content="website">
    ${analytics}
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: ${themeChoice.colors.text};
            background-color: ${themeChoice.colors.background};
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header Styles */
        header {
            background: linear-gradient(135deg, ${themeChoice.colors.primary} 0%, ${themeChoice.colors.secondary} 100%);
            color: white;
            padding: 100px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="white" opacity="0.1"><polygon points="0,100 1000,0 1000,100"/></svg>') no-repeat center bottom;
            background-size: cover;
        }
        
        h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            position: relative;
            z-index: 1;
        }
        
        .tagline {
            font-size: 1.3rem;
            margin-bottom: 30px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }
        
        .cta-button {
            display: inline-block;
            background-color: ${themeChoice.colors.accent};
            color: white;
            padding: 15px 30px;
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
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        /* Features Section */
        .features {
            padding: 80px 0;
            background-color: ${themeChoice.colors.background};
        }
        
        .features h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 50px;
            color: ${themeChoice.colors.text};
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
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, ${themeChoice.colors.primary}, ${themeChoice.colors.accent});
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }
        
        .feature-card h3 {
            font-size: 1.5rem;
            margin-bottom: 15px;
            color: ${themeChoice.colors.text};
        }
        
        .feature-card p {
            color: #666;
            line-height: 1.8;
        }
        
        /* Footer */
        footer {
            background-color: ${themeChoice.colors.text};
            color: white;
            padding: 60px 0 20px;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .contact-form {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 10px;
        }
        
        .contact-form h3 {
            margin-bottom: 20px;
            color: white;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 5px;
            background: rgba(255,255,255,0.9);
            font-size: 1rem;
        }
        
        .form-group textarea {
            height: 100px;
            resize: vertical;
        }
        
        .submit-btn {
            background-color: ${themeChoice.colors.accent};
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .submit-btn:hover {
            background-color: ${themeChoice.colors.primary};
        }
        
        .social-links {
            text-align: center;
        }
        
        .social-links h3 {
            margin-bottom: 20px;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: white;
            font-size: 1.2rem;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .social-links a:hover {
            color: ${themeChoice.colors.accent};
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.2);
            color: rgba(255,255,255,0.7);
        }
        
        .built-with {
            font-size: 0.9rem;
            margin-top: 10px;
        }
        
        .built-with a {
            color: ${themeChoice.colors.accent};
            text-decoration: none;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            h1 {
                font-size: 2.5rem;
            }
            
            .tagline {
                font-size: 1.1rem;
            }
            
            .features h2 {
                font-size: 2rem;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
            
            .footer-content {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>${projectName}</h1>
            <p class="tagline">${projectDescription.split('.')[0]}.</p>
            <a href="#contact" class="cta-button">Get Started</a>
        </div>
    </header>

    <section class="features">
        <div class="container">
            <h2>Why Choose ${projectName}?</h2>
            <p style="text-align: center; font-size: 1.1rem; color: #666; max-width: 600px; margin: 0 auto;">
                ${projectDescription}
            </p>
            
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

    <footer id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="contact-form">
                    <h3>Get In Touch</h3>
                    <form>
                        <div class="form-group">
                            <input type="text" placeholder="Your Name" required>
                        </div>
                        <div class="form-group">
                            <input type="email" placeholder="Your Email" required>
                        </div>
                        <div class="form-group">
                            <textarea placeholder="Your Message" required></textarea>
                        </div>
                        <button type="submit" class="submit-btn">Send Message</button>
                    </form>
                </div>
                
                <div class="social-links">
                    <h3>Connect With Us</h3>
                    <a href="#" title="Twitter">Twitter</a>
                    <a href="#" title="LinkedIn">LinkedIn</a>
                    <a href="#" title="Facebook">Facebook</a>
                    <a href="#" title="Instagram">Instagram</a>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 ${projectName}. All rights reserved.</p>
                <p class="built-with">Built with <a href="https://bolt.new" target="_blank">Bolt.new</a></p>
            </div>
        </div>
    </footer>

    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Form submission handler
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    </script>
</body>
</html>`;

  return {
    html,
    metaTags,
    analyticsId: 'G-XXXXXXXXXX'
  };
};