const productionBackendUrl = "https://aura-meet-production.up.railway.app";
const developmentBackendUrl = `http://${window.location.hostname}:8080`;

export const backendUrl = import.meta.env.VITE_BACKEND_URL
  || (import.meta.env.PROD ? productionBackendUrl : developmentBackendUrl);

export const apiUrl = `${backendUrl}/api/v1/users`;
