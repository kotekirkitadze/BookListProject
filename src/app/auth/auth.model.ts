export interface ResetFormUser {
  email: string;
}

export interface SignInFormUser {
  email: string;
  password: string;
}

export interface SignUpFormUser {
  fullName: string;
  email: string;
  password: string;
}

export interface User {
  uid?: string;
  email?: string;
  name?: string;
}
