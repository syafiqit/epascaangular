import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuSettingComponent } from './menu-setting/menu-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {VictimListComponent} from './admin/victim-profile/victim-list/victim-list.component';
import {AddVictimComponent} from './admin/victim-profile/add-victim/add-victim.component';
import {EditVictimComponent} from './admin/victim-profile/edit-victim/edit-victim.component';
import {HouseAidComponent} from './admin/victim-profile/edit-victim/victim-aid/house-aid/house-aid.component';

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
        path: 'victim-list',
        component: VictimListComponent
      },
      {
        path: 'victim-add',
        component: AddVictimComponent
      },
      {
        path: 'victim-edit',
        component: EditVictimComponent
      },
      {
        path: 'victim-aid/house-aid',
        component: HouseAidComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
