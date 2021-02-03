import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuSettingComponent } from './menu-setting/menu-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
