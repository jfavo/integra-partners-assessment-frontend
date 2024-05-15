import { Component } from '@angular/core';
import { BackendService } from 'src/app/shared/services/backend.service';
import { User } from '../../models/users.model';

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

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.fetchingFromBackend = true;
    this.fetchUsers()
  }

  /**
   * Fetches all users from the backend API and 
   */
  fetchUsers(): void {
    this.backendService.getAllUsers().subscribe({
      next: value => this.users = value,
      error: err => {
        // Errors won't make it to the complete callback so we have
        // to set this flag here
        this.fetchingFromBackend = false
        console.error(`Error while fetching users: ${err}`);
      },
      complete: () => this.fetchingFromBackend = false
    })
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

}
