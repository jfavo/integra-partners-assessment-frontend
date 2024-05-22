import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BackendService } from './backend.service';
import { User } from '../models/users.model';
import { BACKEND_API_USERS_PATH } from '../constants/backend-api.constants';
import { TEST_USERS } from '../constants/test-data.constants';

describe('BackendService', () => {
  let service: BackendService;
  let httpMock: HttpTestingController;

  const testUsers: User[] = TEST_USERS

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BackendService]
    });

    service = TestBed.inject(BackendService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all users successfully', (done: DoneFn) => {
    service.getAllUsers().subscribe({
      next: (users) => {
        expect(users.length).toBe(2);
        expect(users).toEqual(testUsers);
        done();
      },
      error: (error) => {
        fail('Expected successful fetching');
        done();
      }
    });

    const request = httpMock.expectOne(BACKEND_API_USERS_PATH);
    expect(request.request.method).toBe('GET');
    request.flush({ data: testUsers.map(user => service.mapUserToRequestBody(user)) });
  });

  it('should handle fetch all users failure', (done: DoneFn) => {
    const errorMessage = { error_code: 10002, error_message: "failed to fetch users from data store."}

    service.getAllUsers().subscribe({
      next: () => {
        fail('Expected to fail');
        done();
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.error).toBe(errorMessage);
        done();
      }
    });

    const request = httpMock.expectOne(BACKEND_API_USERS_PATH);
    expect(request.request.method).toBe('GET');
    request.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should create a new user successfully', (done: DoneFn) => {
    const newUser: User = testUsers[0];

    service.createUser(newUser).subscribe({
      next: (user) => {
        expect(user.UserId).toBe(newUser.UserId);
        expect(user.Username).toBe(newUser.Username);
        done();
      },
      error: (error) => {
        fail('Expected successful creation');
        done();
      }
    });

    const request = httpMock.expectOne(BACKEND_API_USERS_PATH);
    expect(request.request.method).toBe('POST');
    request.flush({ data: service.mapUserToRequestBody(newUser) });
  });

  it('should handle create user failure', (done: DoneFn) => {
    const newUser: User = testUsers[0];
    const errorMessage = { error_code: 10005, error_message: "failed to create user in data store."}

    service.createUser(newUser).subscribe({
      next: () => {
        fail('Expected to fail');
        done();
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.error).toBe(errorMessage);
        done();
      }
    });

    const request = httpMock.expectOne(BACKEND_API_USERS_PATH);
    expect(request.request.method).toBe('POST');
    request.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });

  it('should update an existing user successfully', (done: DoneFn) => {
    const updatedUser: User = testUsers[1];

    service.updateUser(updatedUser).subscribe({
      next: (user) => {
        expect(user.UserId).toBe(updatedUser.UserId);
        expect(user.UserStatus).toBe(updatedUser.UserStatus);
        done();
      },
      error: (error) => {
        fail('Expected successful update');
        done();
      }
    });

    const request = httpMock.expectOne(BACKEND_API_USERS_PATH);
    expect(request.request.method).toBe('PUT');
    request.flush({ data: service.mapUserToRequestBody(updatedUser) });
  });

  it('should handle update user failure', (done: DoneFn) => {
    const updatedUser: User = testUsers[1];
    const errorMessage = { error_code: 10007, error_message: "failed to update user in data store."}

    service.updateUser(updatedUser).subscribe({
      next: () => {
        fail('Expected to fail');
        done();
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.error).toBe(errorMessage);
        done();
      }
    });

    const request = httpMock.expectOne(BACKEND_API_USERS_PATH);
    expect(request.request.method).toBe('PUT');
    request.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });

  it('should delete a user successfully', (done: DoneFn) => {
    const userId = 1;

    service.deleteUser(userId).subscribe({
      next: (deleted) => {
        expect(deleted).toBeTruthy();
        done();
      },
      error: (error) => {
        fail('Expected successful deletion');
        done();
      }
    });

    const request = httpMock.expectOne(`${BACKEND_API_USERS_PATH}/${userId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ data: userId });
  });

  it('should handle delete user failure', (done: DoneFn) => {
    const userId = 1;
    const errorMessage = { error_code: 10009, error_message: "failed to delete user from data store."}

    service.deleteUser(userId).subscribe({
      next: () => {
        fail('Expected to fail');
        done();
      },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(error.error).toBe(errorMessage);
        done();
      }
    });

    const request = httpMock.expectOne(`${BACKEND_API_USERS_PATH}/${userId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });
});