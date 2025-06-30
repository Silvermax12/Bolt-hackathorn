import { ProjectInfo, ThemeOption, GeneratedPage } from '../types';
import { previewLandingPage } from '../services/api';

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

export const buildLandingPage = async ({
  projectName,
  projectDescription,
  themeChoice
}: ProjectInfo & { themeChoice: ThemeOption }): Promise<GeneratedPage> => {
  try {
    // Use the API to generate preview with theme
    const response = await previewLandingPage(projectName, projectDescription, themeChoice);
    
    if (response.success) {
      const metaTags = generateMetaTags(projectName, projectDescription);
      
      return {
        html: response.html,
        metaTags,
        analyticsId: 'G-XXXXXXXXXX' // Placeholder analytics ID
      };
    } else {
      throw new Error('Failed to generate preview');
    }
  } catch (error) {
    console.error('Error generating landing page:', error);
    
    // Fallback to basic template if API fails
    const metaTags = generateMetaTags(projectName, projectDescription);
    
    return {
      html: createFallbackHTML(projectName, projectDescription, themeChoice, metaTags),
      metaTags,
      analyticsId: 'G-XXXXXXXXXX'
    };
  }
};

// Fallback HTML template for when API is unavailable
const createFallbackHTML = (
  projectName: string, 
  projectDescription: string, 
  themeChoice: ThemeOption,
  metaTags: { title: string; description: string; keywords: string }
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaTags.title}</title>
    <meta name="description" content="${metaTags.description}">
    <meta name="keywords" content="${metaTags.keywords}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: ${themeChoice.colors.text};
            background-color: ${themeChoice.colors.background};
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header {
            background: linear-gradient(135deg, ${themeChoice.colors.primary} 0%, ${themeChoice.colors.secondary} 100%);
            color: white;
            padding: 100px 0;
            text-align: center;
        }
        h1 { font-size: 3.5rem; font-weight: 700; margin-bottom: 20px; }
        .tagline { font-size: 1.3rem; margin-bottom: 30px; opacity: 0.9; }
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
        }
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
            z-index: 1000;
        }
        .bolt-badge::before { content: '⚡'; margin-right: 6px; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>${projectName}</h1>
            <p class="tagline">${projectDescription}</p>
            <a href="#" class="cta-button">Get Started</a>
        </div>
    </header>
    
    <main>
        <div class="container" style="padding: 80px 20px; text-align: center;">
            <h2>API Preview Unavailable</h2>
            <p>This is a fallback preview. The full preview will be available when the backend is connected.</p>
        </div>
    </main>
    
    <a href="https://bolt.new" target="_blank" class="bolt-badge">Built with Bolt.new</a>
</body>
</html>
  `;
};