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
import { EditProjectOwnerComponent } from './menu-setting/setting-project-owner/edit-project-owner/edit-project-owner.component';
import { ListDistrictComponent } from './menu-setting/setting-district/list-district/list-district.component';
import { AddDistrictComponent } from './menu-setting/setting-district/add-district/add-district.component';
import { EditDistrictComponent } from './menu-setting/setting-district/edit-district/edit-district.component';
import { ListDamageComponent } from './menu-setting/setting-damage/list-damage/list-damage.component';
import { EditDamageComponent } from './menu-setting/setting-damage/edit-damage/edit-damage.component';
import { AddDamageComponent } from './menu-setting/setting-damage/add-damage/add-damage.component';
import { ListFundsComponent } from './menu-setting/setting-funds/list-funds/list-funds.component';
import { EditFundsComponent } from './menu-setting/setting-funds/edit-funds/edit-funds.component';
import { AddFundsComponent } from './menu-setting/setting-funds/add-funds/add-funds.component';
import { ListEvacuateComponent } from './menu-setting/setting-evacuate/list-evacuate/list-evacuate.component';
import { EditEvacuateComponent } from './menu-setting/setting-evacuate/edit-evacuate/edit-evacuate.component';
import { AddEvacuateComponent } from './menu-setting/setting-evacuate/add-evacuate/add-evacuate.component';
import { VictimListComponent } from './admin/victim-profile/victim-list/victim-list.component';
import { AddVictimComponent } from './admin/victim-profile/add-victim/add-victim.component';
import { EditVictimDataComponent } from './admin/victim-profile/edit-victim/edit-victim-data.component';
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
import { ParliamentComponent } from './menu-setting/parliament/parliament.component';
import { AddParliamentComponent } from './menu-setting/parliament/add-parliament/add-parliament.component';
import { StateComponent } from './menu-setting/state/state.component';
import { AddStateComponent } from './menu-setting/state/add-state/add-state.component';
import { DunComponent } from './menu-setting/dun/dun.component';
import { AddDunComponent } from './menu-setting/dun/add-dun/add-dun.component';
import { AnnouncementComponent } from './menu-setting/announcement/announcement.component';
import { AddAnnouncementComponent } from './menu-setting/announcement/add-announcement/add-announcement.component';
import { EditAnnouncementComponent } from './menu-setting/announcement/edit-announcement/edit-announcement.component';
import { AddEntrepreneurLoanComponent } from './menu-setting/entrepreneur-loan/add-entrepreneur-loan/add-entrepreneur-loan.component';
import { AddHelpDonationComponent } from './menu-setting/help-donation/add-help-donation/add-help-donation.component';


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
    EditProjectOwnerComponent,
    ListDistrictComponent,
    AddDistrictComponent,
    EditDistrictComponent,
    ListDamageComponent,
    EditDamageComponent,
    AddDamageComponent,
    ListFundsComponent,
    EditFundsComponent,
    AddFundsComponent,
    ListEvacuateComponent,
    EditEvacuateComponent,
    AddEvacuateComponent,
    VictimListComponent,
    AddVictimComponent,
    EditVictimDataComponent,
    VictimProfileComponent,
    VictimHouseholdComponent,
    VictimDisasterComponent,
    VictimAidComponent,
    IhsanDonationComponent,
    HouseAidComponent,
    SpecialLoanComponent,
    AgricultureAidComponent,
    InternationalAidComponent,
    OtherAidComponent,
    AddHouseholdComponent,
    AddVictimDisasterComponent,
    ParliamentComponent,
    AddParliamentComponent,
    StateComponent,
    AddStateComponent,
    DunComponent,
    AddDunComponent,
    AnnouncementComponent,
    AddAnnouncementComponent,
    EditAnnouncementComponent,
    AddEntrepreneurLoanComponent,
    AddHelpDonationComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
    NgxDatatableModule
  ]
})
export class MainModule { }
