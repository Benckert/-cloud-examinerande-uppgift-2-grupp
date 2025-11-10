export interface Entry {
  _id: string;
  user_id: string;
  title: string;
  content: string;
  tags?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name?: string;
  email: string;
  password: string;
  token?: string;
}
