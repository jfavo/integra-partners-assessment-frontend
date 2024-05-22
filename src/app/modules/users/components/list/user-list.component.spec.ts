import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserListComponent } from './user-list.component';
import { BackendService } from '../../../../core/services/backend.service';
import { of, throwError } from 'rxjs';
import { User } from '../../../../core/models/users.model';
import { UserFormComponent } from '../user-form/user-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TEST_USERS } from '../../../../core/constants/test-data.constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ErrorService } from 'src/app/core/services/errors.service';
import { BACKEND_API_USERS_FAILED_ACTION, BACKEND_API_USERS_FAILED_MESSAGE } from '../../constants/errors.constants';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;

  beforeEach(async () => {
    const backendSpy = jasmine.createSpyObj('BackendService', ['getAllUsers']);
    const errorSpy = jasmine.createSpyObj('ErrorService', ['showError'])
    await TestBed.configureTestingModule({
      declarations: [UserListComponent, UserFormComponent],
      imports: [
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: BackendService, useValue: backendSpy }, { provide: ErrorService, useValue: errorSpy}],
    }).compileComponents();
    backendServiceSpy = TestBed.inject(
      BackendService
    ) as jasmine.SpyObj<BackendService>;
    errorServiceSpy = TestBed.inject(
      ErrorService
    ) as jasmine.SpyObj<ErrorService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users from backend on initialization', () => {
    const users: User[] = TEST_USERS;
    backendServiceSpy.getAllUsers.and.returnValue(of(users));

    fixture.detectChanges();

    expect(component.users).toEqual(users);
    expect(component.fetchingFromBackend).toBeFalse();
  });

  it('should handle error when fetching users from backend', () => {
    const errorSpy = spyOn(console, 'error');
    const errorMessage = { message: 'Error fetching users' };
    backendServiceSpy.getAllUsers.and.returnValue(throwError(() => errorMessage));

    fixture.detectChanges();

    expect(component.users.length).toBe(0);
    expect(component.fetchingFromBackend).toBeFalse();
    expect(errorServiceSpy.showError).toHaveBeenCalledWith(
      BACKEND_API_USERS_FAILED_MESSAGE,
      BACKEND_API_USERS_FAILED_ACTION
    );
    expect(errorSpy).toHaveBeenCalledWith(
      `Error while fetching users: ${errorMessage.message}`
    );
  });

  it('should update user list when user is updated', () => {
    const users: User[] = TEST_USERS;
    component.users = users;

    const updatedUser = new User(
      1,
      'user1-updated',
      'John',
      'Doe',
      'john@example.com',
      'I',
      'IT'
    );
    component.onUserUpdated(updatedUser);

    expect(component.users[0].Username).toBe('user1-updated');
    expect(component.users[0].UserStatus).toBe('I');
  });

  it('should remove user from user list when user is deleted', () => {
    const users: User[] = TEST_USERS;
    component.users = users;

    component.onUserDeleted(1);

    expect(component.users.length).toBe(1);
    expect(component.users[0].UserId).toBe(2);
  });
});
