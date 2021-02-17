import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AkaunComponent } from './akaun.component';
import { DaftarAkaunComponent } from './daftar-akaun/daftar-akaun.component';
import { LogMasukComponent } from './log-masuk/log-masuk.component';
import { LupaKataLaluanComponent } from './lupa-kata-laluan/lupa-kata-laluan.component';
import { TukarKataLaluanComponent } from './tukar-kata-laluan/tukar-kata-laluan.component';

const routes: Routes = [
  {
		path: '',
		component: AkaunComponent,
		children: [
			{ path: '', redirectTo: 'log-masuk', pathMatch: 'full' },
			{ path: 'log-masuk', component: LogMasukComponent },
			{ path: 'lupa-katalaluan', component: LupaKataLaluanComponent },
			{ path: 'daftar', component: DaftarAkaunComponent },
			{ path: 'tukar-katalaluan', component: TukarKataLaluanComponent }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AkaunRoutingModule { }
