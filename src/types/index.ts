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

export interface DeploymentRecord {
  id: string;
  projectName: string;
  projectDescription: string;
  themeName: string;
  url: string;
  adminUrl?: string;
  deployedAt: string;
  siteId: string;
  deployId: string;
}

export interface HistoryContextType {
  deployments: DeploymentRecord[];
  addDeployment: (deployment: Omit<DeploymentRecord, 'id'>) => void;
  removeDeployment: (id: string) => void;
  clearHistory: () => void;
}

export type Step = 'input' | 'theme' | 'preview' | 'deploy' | 'history';