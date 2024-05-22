export class User {
  UserId: Number;
  Username: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  UserStatus: string;
  Department?: string;

  constructor(
    userId: Number,
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    userStatus: string,
    department?: string
  ) {
    this.UserId = userId;
    this.Username = userName;
    this.Firstname = firstName;
    this.Lastname = lastName;
    this.Email = email;
    this.UserStatus = userStatus;
    this.Department = department;
  }
}
