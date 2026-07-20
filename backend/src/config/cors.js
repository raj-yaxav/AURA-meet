const localFrontendPattern = /^http:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+):5173$/;

export const isAllowedOrigin = (origin) => (
  !origin
  || origin === (process.env.FRONTEND_URL || "https://aura-meet-hazel.vercel.app")
  || localFrontendPattern.test(origin)
);

export const corsOrigin = (origin, callback) => {
  if (isAllowedOrigin(origin)) callback(null, true);
  else callback(new Error("Origin is not allowed by CORS"));
};
