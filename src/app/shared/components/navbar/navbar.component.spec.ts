import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule]
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
    expect(navigateSpy).toHaveBeenCalledWith('/users-list');
  });
  
  it('should navigate to create user page', () => {
    const navigateSpy = spyOn(component, 'navigateTo').and.callThrough();
  
    const createUserButton = fixture.nativeElement.querySelector('#create-user-button');
    createUserButton.click();
  
    expect(navigateSpy).toHaveBeenCalledWith('/create-user');
  });

  it('should disable users list button when current URL is /users-list', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/users-list');
    fixture.detectChanges();

    const userListButton = fixture.nativeElement.querySelector('#users-list-button');
    expect(userListButton.disabled).toBe(true);
  });

  it('should disable create user button when current URL is /create-user', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/create-user');
    fixture.detectChanges();

    const createUserButton = fixture.nativeElement.querySelector('#create-user-button');
    expect(createUserButton.disabled).toBe(true);
  });
});
