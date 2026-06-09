// Environment variable validation and configuration
interface EnvConfig {
  VITE_API_BASE_URL: string;
  VITE_GEMINI_API_KEY?: string;
  VITE_PYTHON_BACKEND_URL?: string;
}

const validateEnv = (): EnvConfig => {
  const config: Partial<EnvConfig> = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
    VITE_PYTHON_BACKEND_URL: import.meta.env.VITE_PYTHON_BACKEND_URL,
  };

  // Validate required environment variables
  if (!config.VITE_API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is required but not defined in environment variables');
  }

  // Warn about optional but important variables
  if (!config.VITE_GEMINI_API_KEY) {
    console.warn('VITE_GEMINI_API_KEY is not defined. ChatBot functionality will be limited.');
  }

  if (!config.VITE_PYTHON_BACKEND_URL) {
    console.warn('VITE_PYTHON_BACKEND_URL is not defined. AI and vector search features may be limited.');
  }

  return config as EnvConfig;
};

export const env = validateEnv();

// Export individual values with fallbacks
export const API_BASE_URL = env.VITE_API_BASE_URL;
export const GEMINI_API_KEY = env.VITE_GEMINI_API_KEY || '';
export const PYTHON_BACKEND_URL = env.VITE_PYTHON_BACKEND_URL || 'http://localhost:8000';
export const DATABASE_URL = PYTHON_BACKEND_URL; // Alias for backward compatibility

// Helper functions
export const isGeminiEnabled = (): boolean => !!GEMINI_API_KEY;
export const isPythonBackendEnabled = (): boolean => !!PYTHON_BACKEND_URL;
export const isDatabaseEnabled = (): boolean => !!DATABASE_URL; // Alias for backward compatibility
