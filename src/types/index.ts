export interface ProjectInfo {
  projectName: string;
  projectDescription: string;
}

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  preview: string;
  isCustom?: boolean;
}

export interface CustomTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface GeneratedPage {
  html: string;
  metaTags: {
    title: string;
    description: string;
    keywords: string;
  };
  analyticsId?: string;
}

export type Step = 'input' | 'theme' | 'preview' | 'deploy';