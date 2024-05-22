import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../../../../core/models/users.model';
import { BackendService } from '../../../../core/services/backend.service';
import { USER_STATUSES } from '../../../../core/constants/backend-api.constants';
import { MAX_INPUT_LENGTH, MIN_NAME_LENGTH, MIN_USERNAME_LENGTH } from '../../constants/form.constants';
import { DEPARTMENT_MAX_LENGTH_ERROR_MESSAGE, DEPARTMENT_MIN_LENGTH_ERROR_MESSAGE, EMAIL_DUPLICATE_ERROR_MESSAGE, EMAIL_INVALID_ERROR_MESSAGE, EMAIL_REQUIRED_ERROR_MESSAGE, FIRSTNAME_MAX_LENGTH_ERROR_MESSAGE, FIRSTNAME_MIN_LENGTH_ERROR_MESSAGE, FIRSTNAME_REQUIRED_ERROR_MESSAGE, LASTNAME_MAX_LENGTH_ERROR_MESSAGE, LASTNAME_MIN_LENGTH_ERROR_MESSAGE, LASTNAME_REQUIRED_ERROR_MESSAGE, USERNAME_DUPLICATE_ERROR_MESSAGE, USERNAME_MAX_LENGTH_ERROR_MESSAGE, USERNAME_MIN_LENGTH_ERROR_MESSAGE, USERNAME_REQUIRED_ERROR_MESSAGE } from '../../constants/errors.constants';

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
   * Object containing all form error messages to be sent to the client
   */
  errorMessages = {
    "username": {
      "required": USERNAME_REQUIRED_ERROR_MESSAGE,
      "minlength": USERNAME_MIN_LENGTH_ERROR_MESSAGE,
      "maxlength": USERNAME_MAX_LENGTH_ERROR_MESSAGE,
      "duplicate": USERNAME_DUPLICATE_ERROR_MESSAGE,
    },
    "email": {
      "required": EMAIL_REQUIRED_ERROR_MESSAGE,
      "pattern": EMAIL_INVALID_ERROR_MESSAGE,
      "duplicate": EMAIL_DUPLICATE_ERROR_MESSAGE,
    },
    "firstName": {
      "required":  FIRSTNAME_REQUIRED_ERROR_MESSAGE,
      "minlength": FIRSTNAME_MIN_LENGTH_ERROR_MESSAGE,
      "maxlength": FIRSTNAME_MAX_LENGTH_ERROR_MESSAGE,
    },
    "lastName": {
      "required":  LASTNAME_REQUIRED_ERROR_MESSAGE,
      "minlength": LASTNAME_MIN_LENGTH_ERROR_MESSAGE,
      "maxlength": LASTNAME_MAX_LENGTH_ERROR_MESSAGE,
    },
    "department": {
      "minlength": DEPARTMENT_MIN_LENGTH_ERROR_MESSAGE,
      "maxlength": DEPARTMENT_MAX_LENGTH_ERROR_MESSAGE,
    },
  }

  /**
   * Key value pair collection containing our form input FormControls
   */
  formControls: { [key: string]: FormControl<any>} = {
    "username": new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_USERNAME_LENGTH),
      Validators.maxLength(MAX_INPUT_LENGTH),
    ]),
    "email": new FormControl('', [
      Validators.required,
      // Using regex instead of the built in email validator for better accuracy
      Validators.pattern("^[a-zA-Z0-9._-]+@[a-z0-9-]+\\.[a-z]{2,4}$"),
    ]),
    "firstName": new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_NAME_LENGTH),
      Validators.maxLength(MAX_INPUT_LENGTH),
    ]),
    "lastName": new FormControl('', [
      Validators.required,
      Validators.minLength(MIN_NAME_LENGTH),
      Validators.maxLength(MAX_INPUT_LENGTH),
    ]),
    "department": new FormControl('', [
      Validators.minLength(MIN_NAME_LENGTH),
      Validators.maxLength(MAX_INPUT_LENGTH),
    ])
  }

  /**
   * Getter to retrieve the collection of valid User Statuses
   */
  get userStatuses() { return USER_STATUSES; }

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
            if (deleted) {
              this.userDeletedEvent.emit(id)
            }
          },
          error: err => this.onBackendError(err),
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
      return;
    }

    // Map our data to a User object
    const userData = this.mapFormDataToUser();
    if (!userData) return;

    this.fetchingFromBackend = true;

    // Determine if we are updating an existing user
    // or creating a new one
    const updating = this.user !== undefined;

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
