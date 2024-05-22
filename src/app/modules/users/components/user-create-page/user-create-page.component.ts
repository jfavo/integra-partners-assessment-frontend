import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../core/models/users.model';

@Component({
  selector: 'app-user-create-page',
  templateUrl: './user-create-page.component.html',
  styleUrls: ['./user-create-page.component.css']
})
export class UserCreatePageComponent {

  constructor(private router: Router) { }

  /**
   * Handler to be called once the user form returns a new user
   * @param user User data that was recently created
   */
  onUserCreated(): void {
    this.router.navigateByUrl('/users-list');
  }
}
