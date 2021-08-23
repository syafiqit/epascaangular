import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from 'angular-archwizard';
import { LaporanRoutingModule } from './laporan-routing.module';
import { LaporanSkbComponent } from './laporan-skb/laporan-skb.component';
import { LaporanRingkasanComponent } from './laporan-ringkasan/laporan-ringkasan.component';
import { LaporanKelulusanComponent } from './laporan-kelulusan/laporan-kelulusan.component';
import { LaporanSkbBulanComponent } from './laporan-skb-bulan/laporan-skb-bulan.component';
import { LaporanBayaranTerusComponent } from './laporan-bayaran-terus/laporan-bayaran-terus.component';
import { LaporanBwiComponent } from './laporan-bwi/laporan-bwi.component';
import { LaporanBencanaKirComponent } from './laporan-bencana-kir/laporan-bencana-kir.component';
import { LaporanBencanaKelulusanComponent } from './laporan-bencana-kelulusan/laporan-bencana-kelulusan.component';
import { LaporanBwiNegeriComponent } from './laporan-bwi-negeri/laporan-bwi-negeri.component';
import { LaporanBwiKematianComponent } from './laporan-bwi-kematian/laporan-bwi-kematian.component';
import { LaporanPinjamanComponent } from './laporan-pinjaman/laporan-pinjaman.component';
import { LaporanPertanianComponent } from './laporan-pertanian/laporan-pertanian.component';
import { LaporanRumahBaruComponent } from './laporan-rumah-baru/laporan-rumah-baru.component';
import { LaporanBaikPulihRumahComponent } from './laporan-baik-pulih-rumah/laporan-baik-pulih-rumah.component';
import { LaporanBwiPenerimaBantuanComponent } from './laporan-bwi-penerima-bantuan/laporan-bwi-penerima-bantuan.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		LaporanRoutingModule,
		NgxDatatableModule,
		TableModule,
		PaginatorModule,
    NgSelectModule,
    ArchwizardModule
	],
	declarations: [
    LaporanSkbComponent,
    LaporanRingkasanComponent,
    LaporanKelulusanComponent,
    LaporanSkbBulanComponent,
    LaporanBayaranTerusComponent,
    LaporanBwiComponent,
    LaporanBencanaKirComponent,
    LaporanBencanaKelulusanComponent,
    LaporanBwiNegeriComponent,
    LaporanBwiKematianComponent,
    LaporanPinjamanComponent,
    LaporanPertanianComponent,
    LaporanRumahBaruComponent,
    LaporanBaikPulihRumahComponent,
    LaporanBwiPenerimaBantuanComponent
	]
})
export class LaporanModule {}