import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MenuSettingComponent } from './menu-setting/menu-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUserComponent } from './user-management/list-user/list-user.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { ListProjectOwnerComponent } from './menu-setting/setting-project-owner/list-project-owner/list-project-owner.component';
import { AddProjectOwnerComponent } from './menu-setting/setting-project-owner/add-project-owner/add-project-owner.component';
import { ListDistrictComponent } from './menu-setting/setting-district/list-district/list-district.component';
import { AddDistrictComponent } from './menu-setting/setting-district/add-district/add-district.component';
import { ListDamageComponent } from './menu-setting/setting-damage/list-damage/list-damage.component';
import { EditDamageComponent } from './menu-setting/setting-damage/edit-damage/edit-damage.component';
import { ListFundsComponent } from './menu-setting/setting-funds/list-funds/list-funds.component';
import { EditFundsComponent } from './menu-setting/setting-funds/edit-funds/edit-funds.component';
import { ListVictimComponent } from './menu-setting/setting-victim/list-victim/list-victim.component';
import { EditVictimComponent } from './menu-setting/setting-victim/edit-victim/edit-victim.component';


@NgModule({
  declarations: [

    MenuSettingComponent,
    DashboardComponent,
    ListUserComponent,
    AddUserComponent,
    ListProjectOwnerComponent,
    AddProjectOwnerComponent,
    ListDistrictComponent,
    AddDistrictComponent,
    ListDamageComponent,
    EditDamageComponent,
    ListFundsComponent,
    EditFundsComponent,
    ListVictimComponent,
    EditVictimComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
    NgxDatatableModule
  ]
})
export class MainModule { }
