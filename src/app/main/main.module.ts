import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MenuSettingComponent } from './menu-setting/menu-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [MenuSettingComponent, DashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule
  ]
})
export class MainModule { }
