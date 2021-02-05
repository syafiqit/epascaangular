import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MenuSettingComponent } from './menu-setting/menu-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUserComponent } from './user-management/list-user/list-user.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { ListDisasterComponent } from './menu-setting/disaster/list-disaster/list-disaster.component';
import { AddDisasterComponent } from './menu-setting/disaster/add-disaster/add-disaster.component';
import { ListMinistryComponent } from './menu-setting/ministry/list-ministry/list-ministry.component';
import { AddMinistryComponent } from './menu-setting/ministry/add-ministry/add-ministry.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { UserComponent } from './account/user/user.component';
import { ReferenceComponent } from './account/reference/reference.component';
import { AddSampleHouseComponent } from './account/reference/add-sample-house/add-sample-house.component';
import { AgencyComponent } from './menu-setting/agency/agency.component';
import { AddAgencyComponent } from './menu-setting/agency/add-agency/add-agency.component';
import { EditAgencyComponent } from './menu-setting/agency/edit-agency/edit-agency.component';
import { ExecutorComponent } from './menu-setting/executor/executor.component';
import { AddExecutorComponent } from './menu-setting/executor/add-executor/add-executor.component';
import { EditExecutorComponent } from './menu-setting/executor/edit-executor/edit-executor.component';
import { EntrepreneurLoanComponent } from './menu-setting/entrepreneur-loan/entrepreneur-loan.component';
import { EditEntrepreneurLoanComponent } from './menu-setting/entrepreneur-loan/edit-entrepreneur-loan/edit-entrepreneur-loan.component';
import { HouseProjectOwnerComponent } from './menu-setting/house-project-owner/house-project-owner.component';
import { AddHouseProjectOwnerComponent } from './menu-setting/house-project-owner/add-house-project-owner/add-house-project-owner.component';
import { EditHouseProjectOwnerComponent } from './menu-setting/house-project-owner/edit-house-project-owner/edit-house-project-owner.component';
import { HelpDonationComponent } from './menu-setting/help-donation/help-donation.component';
import { EditHelpDonationComponent } from './menu-setting/help-donation/edit-help-donation/edit-help-donation.component';
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
import { ParliamentComponent } from './menu-setting/parliament/parliament.component';
import { AddParliamentComponent } from './menu-setting/parliament/add-parliament/add-parliament.component';


@NgModule({
  declarations: [

    MenuSettingComponent,
    DashboardComponent,
    ListUserComponent,
    AddUserComponent,
    ListDisasterComponent,
    AddDisasterComponent,
    ListMinistryComponent,
    AddMinistryComponent,
    ChangePasswordComponent,
    UserComponent,
    ReferenceComponent,
    AddSampleHouseComponent,
    AgencyComponent,
    AddAgencyComponent,
    EditAgencyComponent,
    ExecutorComponent,
    AddExecutorComponent,
    EditExecutorComponent,
    EntrepreneurLoanComponent,
    EditEntrepreneurLoanComponent,
    HouseProjectOwnerComponent,
    AddHouseProjectOwnerComponent,
    EditHouseProjectOwnerComponent,
    HelpDonationComponent,
    EditHelpDonationComponent,
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
    EditVictimComponent,
    ParliamentComponent,
    AddParliamentComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
    NgxDatatableModule
  ]
})
export class MainModule { }
