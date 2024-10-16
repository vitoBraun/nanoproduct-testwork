declare namespace Express {
  interface User {
    id: string;
    role?: string;
    email: string;
    isAuthenticated: boolean;
  }

  interface Request {
    user?: User;
    logout: () => void;
    isAuthenticated: () => boolean;
  }
}
