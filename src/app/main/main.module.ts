import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MenuSettingComponent } from './menu-setting/menu-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VictimListComponent } from './admin/victim-profile/victim-list/victim-list.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import { AddVictimComponent } from './admin/victim-profile/add-victim/add-victim.component';
import { EditVictimComponent } from './admin/victim-profile/edit-victim/edit-victim.component';
import { VictimProfileComponent } from './admin/victim-profile/edit-victim/victim-profile/victim-profile.component';
import { VictimHouseholdComponent } from './admin/victim-profile/edit-victim/victim-household/victim-household.component';
import { VictimDisasterComponent } from './admin/victim-profile/edit-victim/victim-disaster/victim-disaster.component';
import { VictimAidComponent } from './admin/victim-profile/edit-victim/victim-aid/victim-aid.component';
import { IhsanDonationComponent } from './admin/victim-profile/edit-victim/victim-aid/ihsan-donation/ihsan-donation.component';
import { HouseAidComponent } from './admin/victim-profile/edit-victim/victim-aid/house-aid/house-aid.component';
import { SpecialLoanComponent } from './admin/victim-profile/edit-victim/victim-aid/special-loan/special-loan.component';
import { AgricultureAidComponent } from './admin/victim-profile/edit-victim/victim-aid/agriculture-aid/agriculture-aid.component';
import { InternationalAidComponent } from './admin/victim-profile/edit-victim/victim-aid/international-aid/international-aid.component';
import { OtherAidComponent } from './admin/victim-profile/edit-victim/victim-aid/other-aid/other-aid.component';
import { AddHouseholdComponent } from './admin/victim-profile/edit-victim/victim-household/add-household.component';
import { AddVictimDisasterComponent } from './admin/victim-profile/edit-victim/victim-disaster/add-victim-disaster.component';

@NgModule({
  declarations: [MenuSettingComponent, DashboardComponent, VictimListComponent, AddVictimComponent, EditVictimComponent, VictimProfileComponent, VictimHouseholdComponent, VictimDisasterComponent, VictimAidComponent, IhsanDonationComponent, HouseAidComponent, SpecialLoanComponent, AgricultureAidComponent, InternationalAidComponent, OtherAidComponent, AddHouseholdComponent, AddVictimDisasterComponent],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
    NgxDatatableModule,
  ]
})
export class MainModule { }
