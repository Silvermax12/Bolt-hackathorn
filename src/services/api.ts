// API configuration and service functions
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

export interface DeployRequest {
  title: string;
  description: string;
}

export interface DeployResponse {
  success: boolean;
  site_id: string;
  deploy_id: string;
  url: string;
  admin_url?: string;
  title: string;
  description: string;
  deployed_at: string;
}

export interface PreviewRequest {
  title: string;
  description: string;
}

export interface PreviewResponse {
  success: boolean;
  html: string;
  title: string;
  description: string;
}

export interface APIError {
  error: string;
  message: string;
}

class APIService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async deployLandingPage(data: DeployRequest): Promise<DeployResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Deploy API error:', error);
      throw error;
    }
  }

  async previewLandingPage(data: PreviewRequest): Promise<PreviewResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error('Preview API error:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return result;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new APIService();

// Export utility functions
export const validateDeployRequest = (data: DeployRequest): string | null => {
  if (!data.title || data.title.trim().length === 0) {
    return 'Title is required';
  }
  
  if (data.title.length > 100) {
    return 'Title must be 100 characters or less';
  }
  
  if (!data.description || data.description.trim().length === 0) {
    return 'Description is required';
  }
  
  if (data.description.length > 500) {
    return 'Description must be 500 characters or less';
  }
  
  return null; // No errors
};

export const formatDeployData = (projectName: string, projectDescription?: string): DeployRequest => {
  return {
    title: projectName.trim(),
    description: projectDescription?.trim() || `Landing page for ${projectName.trim()} - created with AI Landing Page Generator`
  };
}; 