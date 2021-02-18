import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AkaunRoutingModule } from './akaun-routing.module';
import { AkaunComponent } from '../akaun/akaun.component';
import { LogMasukComponent } from '../akaun/log-masuk/log-masuk.component';
import { LupaKataLaluanComponent } from '../akaun/lupa-kata-laluan/lupa-kata-laluan.component';
import { DaftarAkaunComponent } from '../akaun/daftar-akaun/daftar-akaun.component';
import { TukarKataLaluanComponent } from '../akaun/tukar-kata-laluan/tukar-kata-laluan.component';
import { SharedModule } from '../shared/shared.module';
import { AccountRouteGuard } from '../shared/guards/account-route-guard';

@NgModule({
	declarations: [
		AkaunComponent,
		LogMasukComponent,
		LupaKataLaluanComponent,
		DaftarAkaunComponent,
		TukarKataLaluanComponent
	],
	imports: [CommonModule, SharedModule, AkaunRoutingModule],
	providers: [AccountRouteGuard]
})
export class AkaunModule {}
