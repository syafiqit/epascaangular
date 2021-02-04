import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MenuSettingComponent } from './menu-setting/menu-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUserComponent } from './user-management/list-user/list-user.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { UserComponent } from './account/user/user.component';
import { ReferenceComponent } from './account/reference/reference.component';

@NgModule({
  declarations: [
    
    MenuSettingComponent, 
    DashboardComponent,
    ListUserComponent,
    AddUserComponent,
    ChangePasswordComponent,
    UserComponent,
    ReferenceComponent
  
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
    NgxDatatableModule
  ]
})
export class MainModule { }
