import { UserStatus } from "src/app/core/users/models/user-status.model";

export const BACKEND_API_URL: string = 'http://localhost:8080';
export const BACKEND_API_USERS_PATH: string = `${BACKEND_API_URL}/users`;

  /**
   * List of valid user statuses for the user
   */
  export const USER_STATUSES: UserStatus[] = [
    { key: 'A', value: 'Active' },
    { key: 'I', value: 'Inactive' },
    { key: 'T', value: 'Terminated' },
  ];