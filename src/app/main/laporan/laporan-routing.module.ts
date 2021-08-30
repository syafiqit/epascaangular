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
import { LaporanRumahBaruComponent } from './laporan-rumah-baru/laporan-rumah-baru.component';
import { LaporanBaikPulihRumahComponent } from './laporan-baik-pulih-rumah/laporan-baik-pulih-rumah.component';
import { LaporanBwiPenerimaBantuanComponent } from './laporan-bwi-penerima-bantuan/laporan-bwi-penerima-bantuan.component';
import { LaporanComponent } from './laporan.component';

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
				path: 'pinjaman',
				component: LaporanPinjamanComponent
			},
			{
				path: 'pertanian',
				component: LaporanPertanianComponent
			},
			{
				path: 'rumah/bina',
				component: LaporanRumahBaruComponent
			},
      {
				path: 'rumah/baik-pulih',
				component: LaporanBaikPulihRumahComponent
			},
      {
				path: 'bwi/penerima',
				component: LaporanBwiPenerimaBantuanComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LaporanRoutingModule {}
