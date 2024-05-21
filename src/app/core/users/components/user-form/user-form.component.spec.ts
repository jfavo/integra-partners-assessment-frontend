import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../../../shared/services/backend.service';
import { of, throwError } from 'rxjs';
import { User } from '../../models/users.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TEST_USERS } from 'src/app/shared/constants/test-data.constants';
import { By } from '@angular/platform-browser';
import { EMAIL_INVALID_ERROR_MESSAGE, EMAIL_REQUIRED_ERROR_MESSAGE, USERNAME_MAX_LENGTH_ERROR_MESSAGE, USERNAME_MIN_LENGTH_ERROR_MESSAGE, USERNAME_REQUIRED_ERROR_MESSAGE } from '../../constants/errors.constants';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;
  let testUser: User;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BackendService', [
      'createUser',
      'updateUser',
      'deleteUser',
    ]);
    await TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: BackendService, useValue: spy }],
    }).compileComponents();
    backendServiceSpy = TestBed.inject(
      BackendService
    ) as jasmine.SpyObj<BackendService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;

    testUser = TEST_USERS[0];
    component.user = testUser;
    component.formControls['username'].setValue(testUser.Username);
    component.formControls['firstName'].setValue(testUser.Firstname);
    component.formControls['lastName'].setValue(testUser.Lastname);
    component.formControls['email'].setValue(testUser.Email);
    component.currentStatus = testUser.UserStatus;
    component.formControls['department'].setValue(testUser.Department);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call backend service to create user when submitting form with new user', () => {
    // If the components user is defined then it will attempt to update the user
    component.user = undefined;
    backendServiceSpy.createUser.and.returnValue(of(testUser));

    component.onSubmit();

    const expected: User = new User(
      0,
      testUser.Username,
      testUser.Firstname,
      testUser.Lastname,
      testUser.Email,
      testUser.UserStatus,
      testUser.Department
    );
    expect(backendServiceSpy.createUser).toHaveBeenCalledWith(expected);
    expect(component.fetchingFromBackend).toBeFalse();
  });

  it('should call backend service to update user when submitting form with existing user', () => {
    backendServiceSpy.updateUser.and.returnValue(of(testUser));

    component.onSubmit();

    expect(backendServiceSpy.updateUser).toHaveBeenCalledWith(testUser);
    expect(component.fetchingFromBackend).toBeFalse();
  });

  it('should emit userUpdatedEvent when backend service returns user after updating user', () => {
    backendServiceSpy.updateUser.and.returnValue(of(testUser));

    spyOn(component.userUpdatedEvent, 'emit');

    component.onSubmit();

    expect(component.userUpdatedEvent.emit).toHaveBeenCalledWith(testUser);
  });

  it('should set username error when backend service returns duplicate username error', () => {
    const errorResponse = { error: { error_code: 10003 } };
    backendServiceSpy.updateUser.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(component.formControls['username'].hasError('duplicate')).toBeTrue();
    expect(component.fetchingFromBackend).toBeFalse();
  });

  it('should set email error when backend service returns duplicate email error', () => {
    const errorResponse = { error: { error_code: 10004 } };
    backendServiceSpy.updateUser.and.returnValue(throwError(errorResponse));

    component.onSubmit();

    expect(component.formControls['email'].hasError('duplicate')).toBeTrue();
    expect(component.fetchingFromBackend).toBeFalse();
  });
  
  it('should not call backend service to delete user when user cancels deletion', () => {
    component.user = testUser;
  
    spyOn(window, 'confirm').and.returnValue(false);
  
    component.onDelete();
  
    expect(window.confirm).toHaveBeenCalled();
    expect(backendServiceSpy.deleteUser).not.toHaveBeenCalled();
  });
  
  it('should emit userDeletedEvent when backend service returns true after deleting user', () => {
    component.user = testUser;
  
    spyOn(window, 'confirm').and.returnValue(true);
    const deleteObservable = of(true);
    backendServiceSpy.deleteUser.and.returnValue(deleteObservable);
    spyOn(component.userDeletedEvent, 'emit');
  
    component.onDelete();
  
    expect(component.userDeletedEvent.emit).toHaveBeenCalledWith(testUser.UserId);
  });
  
  it('should not emit userDeletedEvent when backend service returns false after deleting user', () => {
    component.user = testUser;
  
    spyOn(window, 'confirm').and.returnValue(true);
    const deleteObservable = of(false);
    backendServiceSpy.deleteUser.and.returnValue(deleteObservable);
    spyOn(component.userDeletedEvent, 'emit');
  
    component.onDelete();
  
    expect(component.userDeletedEvent.emit).not.toHaveBeenCalled();
  });

  describe('input form validation cases', () => {
    for (const {inputField, inputElemId, inputVal, errorElemId, expectedErrorMessage, errorType} of [
      // Username error validations
      { 
        inputField: 'username',
        inputElemId: '#username-input',
        inputVal: '',
        errorElemId: '#username-required-error',
        expectedErrorMessage: USERNAME_REQUIRED_ERROR_MESSAGE,
        errorType: 'input is not supplied'
      },
      { 
        inputField: 'username',
        inputElemId: '#username-input',
        inputVal: 'q',
        errorElemId: '#username-minlength-error',
        expectedErrorMessage: USERNAME_MIN_LENGTH_ERROR_MESSAGE,
        errorType: 'input is too short'
      },
      { 
        inputField: 'username',
        inputElemId: '#username-input',
        inputVal: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        errorElemId: '#username-maxlength-error',
        expectedErrorMessage: USERNAME_MAX_LENGTH_ERROR_MESSAGE,
        errorType: 'input is too long'
      },
      // Email error validations
      { 
        inputField: 'email',
        inputElemId: '#email-input',
        inputVal: '',
        errorElemId: '#email-required-error',
        expectedErrorMessage: EMAIL_REQUIRED_ERROR_MESSAGE,
        errorType: 'input is not supplied'
      },
      { 
        inputField: 'email',
        inputElemId: '#email-input',
        inputVal: 'bad@e',
        errorElemId: '#email-pattern-error',
        expectedErrorMessage: EMAIL_INVALID_ERROR_MESSAGE,
        errorType: 'input is not valid'
      },
      // We can add the test cases for First name, last name, etc similar to above...
    ]) {
      it(`${inputField} should return error message ${expectedErrorMessage} when ${errorType}`, () => {
        const inputElem = fixture.debugElement.query(By.css(inputElemId)).nativeElement;
        inputElem.value = inputVal;
        inputElem.dispatchEvent(new Event('input'));
        inputElem.dispatchEvent(new Event('blur'));
        
        fixture.detectChanges();
    
        const errorMessageDebugElement = fixture.debugElement.query(By.css(errorElemId));
        expect(errorMessageDebugElement).toBeTruthy();
        expect(errorMessageDebugElement.nativeElement.textContent).toContain(expectedErrorMessage);
      })
    }
  })
});
