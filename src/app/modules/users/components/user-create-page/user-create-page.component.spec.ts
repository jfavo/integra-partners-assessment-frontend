import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreatePageComponent } from './user-create-page.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { Router, RouterModule } from '@angular/router';
import { BackendService } from '../../../../core/services/backend.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserCreatePageComponent', () => {
  let component: UserCreatePageComponent;
  let fixture: ComponentFixture<UserCreatePageComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      declarations: [UserCreatePageComponent, UserFormComponent],
      providers: [RouterModule, BackendService],
    });
    fixture = TestBed.createComponent(UserCreatePageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to users list when user is created', () => {
    // Trigger the method with the user data
    component.onUserCreated();

    // Check if the router's navigateByUrl method was called with the expected URL
    expect(router.navigateByUrl).toHaveBeenCalledWith('/users-list');
  });
});
