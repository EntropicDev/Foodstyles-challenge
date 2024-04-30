// Dependency URL's
export const USERS_URL =
  process.env.USERS_URL || `http://localhost:${process.env.PORT}`;
export const GROUPS_URL =
  process.env.GROUPS_URL || `http://localhost:${process.env.PORT}`;

// API Key
export const API_KEY = process.env.AUTH_API_KEY as string;

// JWT Secret
export const API_KEY_JWT_SECRET = process.env.API_KEY_JWT_SECRET as string;
export const AUTH_API_KEY = process.env.AUTH_API_KEY as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET as string;
