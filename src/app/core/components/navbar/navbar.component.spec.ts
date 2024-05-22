import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NAV_CREATE_USER_ROUTE, NAV_USERS_LIST_ROUTE } from '../../constants/nav-routes.constants';
import { CoreModule } from '../../core.module';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, RouterTestingModule]
    });
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.resolveTo(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to users list page', () => {
    const navigateSpy = spyOn(component, 'navigateTo').and.callThrough();
  
    // Simulate a click on the users list button using its ID
    const userListButton = fixture.nativeElement.querySelector('#users-list-button');
    userListButton.click();
  
    // Check if navigateTo method is called with the correct URL
    expect(navigateSpy).toHaveBeenCalledWith(`/${NAV_USERS_LIST_ROUTE}`);
  });
  
  it('should navigate to create user page', () => {
    const navigateSpy = spyOn(component, 'navigateTo').and.callThrough();
  
    const createUserButton = fixture.nativeElement.querySelector('#create-user-button');
    createUserButton.click();
  
    expect(navigateSpy).toHaveBeenCalledWith(`/${NAV_CREATE_USER_ROUTE}`);
  });

  it(`should disable users list button when current URL is /${NAV_USERS_LIST_ROUTE}`, () => {
    spyOnProperty(router, 'url', 'get').and.returnValue(`/${NAV_USERS_LIST_ROUTE}`);
    fixture.detectChanges();

    const userListButton = fixture.nativeElement.querySelector('#users-list-button');
    expect(userListButton.disabled).toBe(true);
  });

  it(`should disable create user button when current URL is /${NAV_CREATE_USER_ROUTE}`, () => {
    spyOnProperty(router, 'url', 'get').and.returnValue(`/${NAV_CREATE_USER_ROUTE}`);
    fixture.detectChanges();

    const createUserButton = fixture.nativeElement.querySelector('#create-user-button');
    expect(createUserButton.disabled).toBe(true);
  });
});
