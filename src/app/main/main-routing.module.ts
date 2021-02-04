import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuSettingComponent } from './menu-setting/menu-setting.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListUserComponent } from './user-management/list-user/list-user.component';
import { AddUserComponent } from './user-management/add-user/add-user.component';
import { AgencyComponent } from './menu-setting/agency/agency.component';
import { ExecutorComponent } from './menu-setting/executor/executor.component';
import { EntrepreneurLoanComponent } from './menu-setting/entrepreneur-loan/entrepreneur-loan.component';
import { HouseProjectOwnerComponent } from './menu-setting/house-project-owner/house-project-owner.component';
import { HelpDonationComponent } from './menu-setting/help-donation/help-donation.component';

const routes: Routes = [
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
