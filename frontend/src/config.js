export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const WS_BASE_URL = API_URL.replace(/^http/, 'ws');
export const WS_URL = `${WS_BASE_URL}/api/v1/ws`;
