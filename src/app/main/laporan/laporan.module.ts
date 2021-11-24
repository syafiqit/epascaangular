import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'primeng/tooltip';
import { LaporanRoutingModule } from './laporan-routing.module';
import { LaporanSkbComponent } from './laporan-skb/laporan-skb.component';
import { LaporanRingkasanComponent } from './laporan-ringkasan/laporan-ringkasan.component';
import { LaporanKelulusanComponent } from './laporan-kelulusan/laporan-kelulusan.component';
import { LaporanBayaranTerusComponent } from './laporan-bayaran-terus/laporan-bayaran-terus.component';
import { LaporanBwiComponent } from './laporan-bwi/laporan-bwi.component';
import { LaporanBencanaKirComponent } from './laporan-bencana-kir/laporan-bencana-kir.component';
import { LaporanBencanaKelulusanComponent } from './laporan-bencana-kelulusan/laporan-bencana-kelulusan.component';
import { LaporanBwiNegeriComponent } from './laporan-bwi-negeri/laporan-bwi-negeri.component';
import { LaporanBwiKematianComponent } from './laporan-bwi-kematian/laporan-bwi-kematian.component';
import { LaporanPinjamanComponent } from './laporan-pinjaman/laporan-pinjaman.component';
import { LaporanPertanianComponent } from './laporan-pertanian/laporan-pertanian.component';
import { LaporanRumahComponent } from './laporan-rumah/laporan-rumah.component';
import { LaporanBwiPenerimaComponent } from './laporan-bwi-penerima/laporan-bwi-penerima.component';
import { LaporanComponent } from './laporan.component';
import { LaporanTiadaBantuanComponent } from './laporan-tiada-bantuan/laporan-tiada-bantuan.component';
import { LaporanMangsaComponent } from './laporan-mangsa/laporan-mangsa.component';
import { LaporanBantuanLainComponent } from './laporan-bantuan-lain/laporan-bantuan-lain.component';
import { LaporanAntarabangsaComponent } from './laporan-antarabangsa/laporan-antarabangsa.component';
import { LaporanWaranComponent } from './laporan-waran/laporan-waran.component';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '@app/shared/date-parser/NgbDateCustomParserFormatter';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		LaporanRoutingModule,
		TableModule,
		PaginatorModule,
    NgSelectModule,
    TooltipModule
	],
	declarations: [
    LaporanSkbComponent,
    LaporanRingkasanComponent,
    LaporanKelulusanComponent,
    LaporanBayaranTerusComponent,
    LaporanBwiComponent,
    LaporanBencanaKirComponent,
    LaporanBencanaKelulusanComponent,
    LaporanBwiNegeriComponent,
    LaporanBwiKematianComponent,
    LaporanPinjamanComponent,
    LaporanPertanianComponent,
    LaporanRumahComponent,
    LaporanBwiPenerimaComponent,
    LaporanComponent,
    LaporanTiadaBantuanComponent,
    LaporanMangsaComponent,
    LaporanBantuanLainComponent,
    LaporanAntarabangsaComponent,
    LaporanWaranComponent
	],
  providers: [
		{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
	]
})
export class LaporanModule {}
