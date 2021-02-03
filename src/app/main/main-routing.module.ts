import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuSettingComponent } from './menu-setting/menu-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUserComponent } from './user-management/list-user/list-user.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'menu-setting',
        component: MenuSettingComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'list-user',
        component: ListUserComponent
      },
      {
        path: 'add-user',
        component: AddUserComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
