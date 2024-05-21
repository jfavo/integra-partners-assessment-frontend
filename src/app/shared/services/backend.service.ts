import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../../core/users/models/users.model';
import { BACKEND_API_USERS_PATH } from '../constants/backend-api.constants';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient) {}

  /**
   * Maps our user data from its JSON format to a User model
   * @param data JSON response data
   * @returns User model
   */
  mapUserResponseToUser(data: {
    user_id: Number;
    user_name: string;
    first_name: string;
    last_name: string;
    email: string;
    user_status: string;
    department: string;
  }): User {
    return new User(
      data.user_id,
      data.user_name,
      data.first_name,
      data.last_name,
      data.email,
      data.user_status,
      data.department
    );
  }

  /**
   * Maps a User object to a JSON object that our backend API expects
   * @param user User object to be mapped to a JSON object
   * @returns JSON object
   */
  mapUserToRequestBody(user: User): any {
    return {
        "user_id": user.UserId,
        "first_name": user.Firstname,
        "last_name": user.Lastname,
        "user_name": user.Username,
        "email": user.Email,
        "user_status": user.UserStatus,
        "department": user.Department
    }
  }

  /**
   * Fetches all users from the backend API
   * @returns An Observable emitting an array of Users
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<any>(BACKEND_API_USERS_PATH).pipe(
      map((response) => {
        const users: User[] = [];
        response.data?.forEach(
          (element: {
            user_id: Number;
            user_name: string;
            first_name: string;
            last_name: string;
            email: string;
            user_status: string;
            department: string;
          }) => {
            users.push(this.mapUserResponseToUser(element));
          }
        );
        return users;
      })
    );
  }

  /**
   * Creates a new user entry in the backend
   * @param user The user to be created
   * @returns An Observable emitting the new user if successfully created
   */
  createUser(user: User): Observable<User> {
    return this.http.post<any>(BACKEND_API_USERS_PATH, this.mapUserToRequestBody(user)).pipe(
        map((response) => {
            return this.mapUserResponseToUser(response.data)
        })
    );
  }

  /**
   * Updates an existing user in the backend
   * @param user The user to be updated
   * @returns An Observable emitting the user if successfully updated
   */
  updateUser(user: User): Observable<User> {
    return this.http.put<any>(BACKEND_API_USERS_PATH, this.mapUserToRequestBody(user)).pipe(
        map((response) => {
            return this.mapUserResponseToUser(response.data)
        })
    );
  }

  /**
   * Deletes the user from the backend
   * @param user The id of the user to be deleted
   * @returns An Observable emitting a boolean to flag if the user was deleted
   */
  deleteUser(userId: Number): Observable<boolean> {
    return this.http.delete<any>(`${BACKEND_API_USERS_PATH}/${userId}`).pipe(
        map((response) => {
            return response.data === userId
        })
    );
  }
}
