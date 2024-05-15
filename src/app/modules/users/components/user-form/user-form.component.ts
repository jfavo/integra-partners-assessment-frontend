import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../../models/users.model';
import { UserStatus } from '../../models/user-status.model';
import { BackendService } from 'src/app/shared/services/backend.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent {
  /**
   * A user object to prefill the form with. If we pass a user then
   * the form will try to update it. Otherwise, it will try to create
   * a new user.
   */
  @Input() user: User | undefined;

  /**
   * Flag to determine if the delete button should be included
   * on the form.
   */
  @Input() allowDelete: boolean = false;

  /**
   * Event to emit when a user is created/updated
   */
  @Output() userUpdatedEvent = new EventEmitter<User>();

  /**
   * Event to emit when a user is deleted. Will return the UserId of the user
   */
  @Output() userDeletedEvent = new EventEmitter<Number>();

  /**
   * Flag to determine if we are currently waiting on the backend
   */
  fetchingFromBackend: boolean = false;

  /**
   * Error message for username that may come from the backend so
   * we can relay it to the user
   */
  usernameBackendError: string = '';
  /**
   * Error message for email that may come from the backend so
   * we can relay it to the user
   */
  emailBackendError: string = '';

  /**
   * Minimum length for our form inputs
   */
  minLength: number = 3;
  /**
   * Minimum length for our name form inputs
   */
  nameMinLength: number = 1;
  /**
   * Maximum length for our form inputs
   */
  maxLength: number = 15;

  /**
   * Key value pair collection containing our form input FormControls
   */
  formControls: { [key: string]: FormControl<any>} = {
    "username": new FormControl('', [
      Validators.required,
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength),
    ]),
    "email": new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    "firstName": new FormControl('', [
      Validators.required,
      Validators.minLength(this.nameMinLength),
      Validators.maxLength(this.maxLength),
    ]),
    "lastName": new FormControl('', [
      Validators.required,
      Validators.minLength(this.nameMinLength),
      Validators.maxLength(this.maxLength),
    ]),
    "department": new FormControl('', [
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength),
    ])
  }

  /**
   * List of valid user statuses for the user
   */
  readonly userStatuses: UserStatus[] = [
    { key: 'A', value: 'Active' },
    { key: 'I', value: 'Inactive' },
    { key: 'T', value: 'Terminated' },
  ];

  /**
   * Stores the UserStatus of our user so we can pre-select it
   * during editing
   */
  currentStatus: string = this.userStatuses[0].key;

  constructor(private backendService: BackendService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']?.currentValue) {
      const user = changes['user'].currentValue;

      this.currentStatus = user.UserStatus;
      this.formControls["username"].setValue(user.Username);
      this.formControls["email"].setValue(user.Email);
      this.formControls["firstName"].setValue(user.Firstname);
      this.formControls["lastName"].setValue(user.Lastname);
      this.formControls["department"].setValue(user.Department || '');
    }
  }

  /**
   * Handler that deletes the user from the backend
   */
  onDelete(): void {
    if (this.user) {
      if(confirm(`Are you sure you want to delete ${this.user.Username}`)) {
        this.fetchingFromBackend = true;

        const id = this.user.UserId;
        this.backendService.deleteUser(id).subscribe({
          next: deleted => {
            console.log(deleted);
            if (deleted) {
              this.userDeletedEvent.emit(id)
            }
          },
          error: (err) => this.onBackendError(err),
          complete: () => this.fetchingFromBackend = true
        })

      }
    }
  }

  /**
   * Click handler that will validate user data and request
   * our backend to create/update it
   */
  onSubmit(): void {
    // Ensure that our user data is valid
    if (!this.validateUserData()) {
      console.error(`Some user data is invalid.`)
      return;
    }

    // Determine if we are updating an existing user
    // or creating a new one
    const updating = this.user !== undefined;

    this.fetchingFromBackend = true;

    const userData = this.mapFormDataToUser();
    if (!userData) return;

    if (updating) {
      this.backendService.updateUser(userData).subscribe({
        next: user => this.onBackendSuccess(user),
        error: err => this.onBackendError(err),
      })
    } else {
      this.backendService.createUser(userData).subscribe({
        next: user => this.onBackendSuccess(user),
        error: err => this.onBackendError(err),
      })
    }
  }

  /**
   * Takes the output of the backend response and emits output events
   * @param user User data returned from backend API
   */
  onBackendSuccess(user: User): void {
    this.fetchingFromBackend = false;

    this.userUpdatedEvent.emit(user);
  }

  /**
   * Handles an errors that may have come from the backend during our request
   * @param err Error returned from backend API
   */
  onBackendError(err: any): void {
    if (err.error) {
      const code = err.error.error_code;
      const msg = err.error.error_message;

      switch (code) {
        case 10003:
          this.formControls['username'].setErrors({'duplicate': true})
          break;
        case 10004:
          this.formControls['email'].setErrors({'duplicate': true})
          break;
      }
    }

    console.log(err, this.usernameBackendError, this.emailBackendError);
    this.fetchingFromBackend = false;
  }

  /**
   * Loops through all form controls and checks if they are all valid
   * @returns True if all form data is valid. Otherwise false
   */
  validateUserData(): boolean {
    const valid = Array.from(Object.values(this.formControls)).every(f => f.valid);
    if (!valid) {
      // This will force our form controls to validate their forms to output any
      // error messages for invalid inputs.
      Object.values(this.formControls).forEach(f => f.markAllAsTouched());
    }

    return valid
  }

  /**
   * Maps our form input values to a User object
   * @returns User from mapped form data. Undefined if an error occurred
   */
  mapFormDataToUser(): User | undefined {
    let user: User;
    const id = this.user?.UserId || 0;
    try {
      user = new User(id,
        this.formControls["username"].value || "",
        this.formControls["firstName"].value || "",
        this.formControls["lastName"].value || "",
        this.formControls["email"].value || "",
        this.currentStatus,
        this.formControls["department"].value || "",
      )
      return user;
    } catch(err) {
      console.error(`Failed to map User form data to a User. ${err}`);
    }

    return undefined;
  }
}
