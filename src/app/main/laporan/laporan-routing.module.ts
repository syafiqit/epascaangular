import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LaporanKelulusanComponent } from './laporan-kelulusan/laporan-kelulusan.component';
import { LaporanRingkasanComponent } from './laporan-ringkasan/laporan-ringkasan.component';
import { LaporanSkbBulanComponent } from './laporan-skb-bulan/laporan-skb-bulan.component';
import { LaporanSkbComponent } from './laporan-skb/laporan-skb.component';
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
import { LaporanMangsaComponent } from './laporan-mangsa/laporan-mangsa.component';
import { LaporanTiadaBantuanComponent } from './laporan-tiada-bantuan/laporan-tiada-bantuan.component';
import { LaporanBantuanLainComponent } from './laporan-bantuan-lain/laporan-bantuan-lain.component';
import { LaporanAntarabangsaComponent } from './laporan-antarabangsa/laporan-antarabangsa.component';
import { LaporanWaranComponent } from './laporan-waran/laporan-waran.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'senarai',
				component: LaporanComponent
			},
			{
				path: 'ringkasan',
				component: LaporanRingkasanComponent
			},
			{
				path: 'bayaran/skb',
				component: LaporanSkbComponent
			},
			{
				path: 'kelulusan',
				component: LaporanKelulusanComponent
			},
			{
				path: 'bayaran/skb/bulan',
				component: LaporanSkbBulanComponent
			},
			{
				path: 'bayaran/terus',
				component: LaporanBayaranTerusComponent
			},
			{
				path: 'bwi',
				component: LaporanBwiComponent
			},
			{
				path: 'bwi/bencana-kir',
				component: LaporanBencanaKirComponent
			},
			{
				path: 'bwi/bencana-kelulusan',
				component: LaporanBencanaKelulusanComponent
			},
			{
				path: 'bwi/negeri',
				component: LaporanBwiNegeriComponent
			},
			{
				path: 'bwi/kematian',
				component: LaporanBwiKematianComponent
			},
			{
				path: 'bantuan/pinjaman',
				component: LaporanPinjamanComponent
			},
			{
				path: 'bantuan/pertanian',
				component: LaporanPertanianComponent
			},
			{
				path: 'bantuan/rumah/bina-baru',
				component: LaporanRumahComponent
			},
      {
				path: 'bantuan/rumah/baik-pulih',
				component: LaporanRumahComponent
			},
      {
				path: 'bwi/penerima',
				component: LaporanBwiPenerimaComponent
			},
			{
				path: 'mangsa/pendaftaran',
				component: LaporanMangsaComponent
			},
			{
				path: 'mangsa/tiada-bantuan',
				component: LaporanTiadaBantuanComponent
			},
			{
				path: 'bantuan/lain-lain',
				component: LaporanBantuanLainComponent
			},
			{
				path: 'bantuan/antarabangsa',
				component: LaporanAntarabangsaComponent
			},
      {
				path: 'waran',
				component: LaporanWaranComponent
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LaporanRoutingModule {}
