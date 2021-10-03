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
				component: LaporanComponent,
        data: { permission: 'Halaman.Laporan'}
			},
			{
				path: 'ringkasan',
				component: LaporanRingkasanComponent,
        data: { permission: 'Halaman.Laporan.Ringkasan'}
			},
			{
				path: 'bayaran/skb',
				component: LaporanSkbComponent,
        data: { permission: 'Halaman.Laporan.Tabung.SKB'}
			},
			{
				path: 'kelulusan',
				component: LaporanKelulusanComponent,
        data: { permission: 'Halaman.Laporan.Tabung.Kelulusan'}
			},
			{
				path: 'bayaran/skb/bulan',
				component: LaporanSkbBulanComponent,
        data: { permission: 'Halaman.Laporan.Tabung.SKB'}
			},
			{
				path: 'bayaran/terus',
				component: LaporanBayaranTerusComponent,
        data: { permission: 'Halaman.Laporan.Tabung.Terus'}
			},
			{
				path: 'bwi',
				component: LaporanBwiComponent,
        data: { permission: 'Halaman.Laporan.Tabung.BWI'}
			},
			{
				path: 'bwi/bencana-kir',
				component: LaporanBencanaKirComponent,
        data: { permission: 'Halaman.Laporan.Tabung.BWI'}
			},
			{
				path: 'bwi/bencana-kelulusan',
				component: LaporanBencanaKelulusanComponent,
        data: { permission: 'Halaman.Laporan.Tabung.BWI'}
			},
			{
				path: 'bwi/negeri',
				component: LaporanBwiNegeriComponent,
        data: { permission: 'Halaman.Laporan.Tabung.BWI'}
			},
			{
				path: 'bwi/kematian',
				component: LaporanBwiKematianComponent,
        data: { permission: 'Halaman.Laporan.Tabung.BWI'}
			},
			{
				path: 'bantuan/pinjaman',
				component: LaporanPinjamanComponent,
        data: { permission: 'Halaman.Laporan.Mangsa.BantuanPinjaman'}
			},
			{
				path: 'bantuan/pertanian',
				component: LaporanPertanianComponent,
        data: { permission: 'Halaman.Laporan.Mangsa.BantuanPertanian'}
			},
			{
				path: 'bantuan/rumah/bina-baru',
				component: LaporanRumahComponent,
        data: { permission: 'Halaman.Laporan.Mangsa.BantuanRumah'}
			},
      {
				path: 'bantuan/rumah/baik-pulih',
				component: LaporanRumahComponent,
        data: { permission: 'Halaman.Laporan.Mangsa.BantuanRumah'}
			},
      {
				path: 'bwi/penerima',
				component: LaporanBwiPenerimaComponent,
        data: { permission: 'Halaman.Laporan.Tabung.BWI'}
			},
			{
				path: 'mangsa/pendaftaran',
				component: LaporanMangsaComponent,
        data: { permission: 'Halaman.Laporan.Mangsa'}
			},
			{
				path: 'mangsa/tiada-bantuan',
				component: LaporanTiadaBantuanComponent,
        data: { permission: 'Halaman.Laporan.Mangsa'}
			},
			{
				path: 'bantuan/lain-lain',
				component: LaporanBantuanLainComponent,
        data: { permission: 'Halaman.Laporan.Mangsa.BantuanLain'}
			},
			{
				path: 'bantuan/antarabangsa',
				component: LaporanAntarabangsaComponent,
        data: { permission: 'Halaman.Laporan.Mangsa.BantuanAntarabangsa'}
			},
      {
				path: 'waran',
				component: LaporanWaranComponent,
        data: { permission: 'Halaman.Laporan.Tabung.Waran'}
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LaporanRoutingModule {}
