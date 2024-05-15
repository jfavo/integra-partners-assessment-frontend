import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreatePageComponent } from './user-create-page.component';
import { HttpClientModule } from '@angular/common/http';
import { UserFormComponent } from '../user-form/user-form.component';
import { RouterModule } from '@angular/router';
import { BackendService } from 'src/app/shared/services/backend.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserCreatePageComponent', () => {
  let component: UserCreatePageComponent;
  let fixture: ComponentFixture<UserCreatePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      declarations: [UserCreatePageComponent, UserFormComponent],
      providers: [RouterModule, BackendService],
    });
    fixture = TestBed.createComponent(UserCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
