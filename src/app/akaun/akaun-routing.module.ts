import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AkaunComponent } from './akaun.component';
import { DaftarAkaunComponent } from './daftar-akaun/daftar-akaun.component';
import { AccountRouteGuard } from '../shared/guards/account-route-guard';
import { LogMasukComponent } from './log-masuk/log-masuk.component';
import { LupaKataLaluanComponent } from './lupa-kata-laluan/lupa-kata-laluan.component';
import { TukarKataLaluanComponent } from './tukar-kata-laluan/tukar-kata-laluan.component';
import { ResetKataLaluanComponent } from './reset-kata-laluan/reset-kata-laluan.component';

const routes: Routes = [
  {
		path: '',
		component: AkaunComponent,
		children: [
			{ path: '', redirectTo: 'log-masuk', pathMatch: 'full' },
			{ path: 'log-masuk', component: LogMasukComponent, canActivate: [AccountRouteGuard] },
			{ path: 'lupa-katalaluan', component: LupaKataLaluanComponent, canActivate: [AccountRouteGuard] },
      { path: 'reset', component: ResetKataLaluanComponent, canActivate: [AccountRouteGuard] },
			{ path: 'tukar', component: TukarKataLaluanComponent}
		]
	},
  { path: 'daftar', component: DaftarAkaunComponent, canActivate: [AccountRouteGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AkaunRoutingModule { }
