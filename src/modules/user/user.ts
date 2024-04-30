import { AuthProvider } from "../auth-provider/auth-provider.interface";

export interface User {
  id?: string;
  name: string;
  surname: string;
  email: string;
  cell?: string;
  SAID?: string | null;
  img?: string;
  selected?: boolean;
  authProviderId?: string;
  authProvider?: AuthProvider;
  pwd?: string;
}
