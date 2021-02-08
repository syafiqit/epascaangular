import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuSettingComponent } from './menu-setting/menu-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUserComponent } from './user-management/list-user/list-user.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { ListDisasterComponent } from './menu-setting/disaster/list-disaster/list-disaster.component';
import { ListMinistryComponent } from './menu-setting/ministry/list-ministry/list-ministry.component';
import { UserComponent } from './account/user/user.component';
import { ReferenceComponent } from './account/reference/reference.component';
import { AddSampleHouseComponent } from './account/reference/add-sample-house/add-sample-house.component';
import { AgencyComponent } from './menu-setting/agency/agency.component';
import { ExecutorComponent } from './menu-setting/executor/executor.component';
import { EntrepreneurLoanComponent } from './menu-setting/entrepreneur-loan/entrepreneur-loan.component';
import { HouseProjectOwnerComponent } from './menu-setting/house-project-owner/house-project-owner.component';
import { HelpDonationComponent } from './menu-setting/help-donation/help-donation.component';
import { ListProjectOwnerComponent } from './menu-setting/setting-project-owner/list-project-owner/list-project-owner.component';
import { ListDistrictComponent } from './menu-setting/setting-district/list-district/list-district.component';
import { ListDamageComponent } from './menu-setting/setting-damage/list-damage/list-damage.component';
import { ListFundsComponent } from './menu-setting/setting-funds/list-funds/list-funds.component';
import { ListEvacuateComponent } from './menu-setting/setting-evacuate/list-evacuate/list-evacuate.component';
import {VictimListComponent} from './admin/victim-profile/victim-list/victim-list.component';
import {AddVictimComponent} from './admin/victim-profile/add-victim/add-victim.component';
import { EditVictimDataComponent } from './admin/victim-profile/edit-victim/edit-victim-data.component';
import {HouseAidComponent} from './admin/victim-profile/edit-victim/victim-aid/house-aid/house-aid.component';
import {ParliamentComponent} from './menu-setting/parliament/parliament.component';
import {StateComponent} from './menu-setting/state/state.component';
import {DunComponent} from './menu-setting/dun/dun.component';
import { AnnouncementComponent } from './menu-setting/announcement/announcement.component';
import { ApprovalListComponent } from './funds-approval/approval-list/approval-list.component';
import { ApprovalEditComponent } from './funds-approval/approval-edit/approval-edit.component';
import { ApprovalAddComponent } from './funds-approval/approval-add/approval-add.component';
import { EditSKBComponent } from './funds-approval/approval-list/edit-skb/edit-skb.component';
import { DirectPaymentComponent } from './funds-approval/approval-list/direct-payment/direct-payment.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },

  {
    path: '',
    children: [
      {
        path: 'menu-setting',
        component: MenuSettingComponent
      },
      {
        path: 'menu-setting/agency',
        component: AgencyComponent
      },
      {
        path: 'menu-setting/executor',
        component: ExecutorComponent
      },
      {
        path: 'menu-setting/entrepreneur-loan',
        component: EntrepreneurLoanComponent
      },
      {
        path: 'menu-setting/house-project-owner',
        component: HouseProjectOwnerComponent
      },
      {
        path: 'menu-setting/announcement',
        component: AnnouncementComponent
      },
      {
        path: 'menu-setting/help-donation',
        component: HelpDonationComponent
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
      {
        path: 'account-user',
        component: UserComponent
      },
      {
        path: 'reference',
        component: ReferenceComponent
      },
      {
        path: 'sample-house',
        component: AddSampleHouseComponent
      },
      {
        path: 'list-project-owner',
        component: ListProjectOwnerComponent
      },
      {
        path: 'list-district',
        component: ListDistrictComponent
      },
      {
        path: 'list-damage',
        component: ListDamageComponent
      },
      {
        path: 'list-funds',
        component: ListFundsComponent
      },
      {
        path: 'list-evacuate',
        component: ListEvacuateComponent
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
        component: EditVictimDataComponent
      },
      {
        path: 'victim-aid/house-aid',
        component: HouseAidComponent
      },
      {
        path: 'list-parliament',
        component: ParliamentComponent
      },
      {
        path: 'list-state',
        component: StateComponent
      },
      {
        path: 'list-dun',
        component: DunComponent
      },
      {
        path: 'approval-list',
        component: ApprovalListComponent
      },
      {
        path: 'approval-edit',
        component: ApprovalEditComponent
      },
      {
        path: 'approval-add',
        component: ApprovalAddComponent
      },
      {
        path: 'edit-skb',
        component: EditSKBComponent
      },
      {
        path: 'direct-payment',
        component: DirectPaymentComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
