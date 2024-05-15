import { User } from "src/app/modules/users/models/users.model";

export const TEST_USERS: User[] = [
    new User(1, 'user1', 'John', 'Doe', 'john@example.com', 'A', 'IT'),
    new User(2, 'user2', 'Jane', 'Doe', 'jane@example.com', 'I', 'HR')
  ];