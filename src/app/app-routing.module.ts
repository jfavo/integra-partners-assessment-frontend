import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './modules/users/components/list/user-list.component';
import { UserCreatePageComponent } from './modules/users/components/user-create-page/user-create-page.component';
import { NAV_CREATE_USER_ROUTE, NAV_USERS_LIST_ROUTE } from './core/constants/nav-routes.constants';

export const routes: Routes = [
  { path: '', redirectTo: NAV_USERS_LIST_ROUTE, pathMatch: 'full' },
  { path: NAV_USERS_LIST_ROUTE, component: UserListComponent },
  { path: NAV_CREATE_USER_ROUTE, component: UserCreatePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
