import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './modules/users/components/list/user-list.component';
import { UserCreatePageComponent } from './modules/users/components/user-create-page/user-create-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'users-list', pathMatch: 'full' },
  { path: 'users-list', component: UserListComponent },
  { path: 'create-user', component: UserCreatePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
