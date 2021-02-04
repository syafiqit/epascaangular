import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuSettingComponent } from './menu-setting/menu-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUserComponent } from './user-management/list-user/list-user.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { ListDisasterComponent } from './menu-setting/disaster/list-disaster/list-disaster.component';
import { ListMinistryComponent } from './menu-setting/ministry/list-ministry/list-ministry.component';

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
      {
        path: 'list-disaster',
        component: ListDisasterComponent
      },
      {
        path: 'list-ministry',
        component: ListMinistryComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
