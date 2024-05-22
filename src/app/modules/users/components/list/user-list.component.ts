import { Component } from '@angular/core';
import { BackendService } from '../../../../core/services/backend.service';
import { User } from '../../../../core/models/users.model';
import { USER_STATUSES } from '../../../../core/constants/backend-api.constants';
import { BACKEND_API_USERS_FAILED_ACTION, BACKEND_API_USERS_FAILED_MESSAGE } from '../../constants/errors.constants';
import { ErrorService } from 'src/app/core/services/errors.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  /**
   * Collection of users supplied from the backend
   */
  users: User[] = [];

  /**
   * Flag to determine if we are fetching data from the backend
   */
  fetchingFromBackend: boolean = false;

  /**
   * Flag set to indicate that there was a backend API error
   */
  backendErrorOccurred: boolean = false;

  constructor(private backendService: BackendService, private errorService: ErrorService) { }

  ngOnInit(): void {
    this.fetchingFromBackend = true;
    this.fetchUsers()
  }

  /**
   * Fetches all users from the backend API and 
   */
  fetchUsers(): void {
    this.backendService.getAllUsers().subscribe({
      next: users => this.onBackendSuccess(users),
      error: err => this.onBackendError(err),
      complete: () => this.onBackendComplete()
    })
  }

  /**
 * Takes the output of the backend response and stores them for display
 * @param user Users data returned from backend API
 */
  onBackendSuccess(users: User[]): void {
    this.users = users;
  }

  /**
   * Handles any errors that may have come from the backend during our request
   * @param err Error returned from backend API
   */
  onBackendError(err: any): void {
    // Errors won't make it to the complete callback so we have
    // to set this flag here
    this.fetchingFromBackend = false
    this.errorService.showError(
      BACKEND_API_USERS_FAILED_MESSAGE,
      BACKEND_API_USERS_FAILED_ACTION);

    console.error(`Error while fetching users: ${err.message}`);
  }

  /**
   * Handler that fires after the observable for the backend API call completes
   */
  onBackendComplete(): void {
    this.backendErrorOccurred = false;
    this.fetchingFromBackend = false;
  }

  /**
   * Updates the user collection with a new user
   * Either updates an existing user if one with the same UserId exists
   * Otherwise, just add them to the list
   * @param newUser User to be updated/added
   */
  onUserUpdated(newUser: User): void {
    const idx = this.users.findIndex(u => u.UserId === newUser.UserId);
    if (idx >= 0) {
      this.users[idx] = newUser;
    } else {
      this.users.push(newUser);
    }
  }

  /**
   * Handler to update the user list to remove the deleted user
   * @param userId User id of the deleted user
   */
  onUserDeleted(userId: Number): void {
    this.users = this.users.filter(u => u.UserId !== userId);
  }

  /**
   * Returns the status for the specified status key
   * @param statusKey Character key for the status
   * @returns Status string
   */
  getUserStatus(statusKey: string): string | undefined {
    return USER_STATUSES.find(s => s.key === statusKey)?.value
  }
}
