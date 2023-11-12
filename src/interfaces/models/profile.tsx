export interface Profile {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  username: string;
  admin?: boolean;
  online?: boolean;
  status: number;
}
