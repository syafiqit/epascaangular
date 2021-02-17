import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PengumumanComponent } from './pengumuman/pengumuman.component';
import { BencanaComponent } from './bencana/bencana.component';
import { DunComponent } from './dun/dun.component';
import { PinjamanUsahawanComponent } from './pinjaman-usahawan/pinjaman-usahawan.component';
import { JenisBantuanComponent } from './jenis-bantuan/jenis-bantuan.component';
import { PemilikProjekRumahComponent } from './pemilik-projek-rumah/pemilik-projek-rumah.component';
import { KementerianComponent } from './kementerian/kementerian.component';
import { ParlimenComponent } from './parlimen/parlimen.component';
import { KerosakanRumahComponent } from './kerosakan-rumah/kerosakan-rumah.component';
import { DaerahComponent } from './daerah/daerah.component';
import { StatusBerpindahComponent } from './status-berpindah/status-berpindah.component';
import { SumberDanaComponent } from './sumber-dana/sumber-dana.component';
import { PemilikProjekComponent } from './pemilik-projek/pemilik-projek.component';
import { NegeriComponent } from './negeri/negeri.component';
import { AgensiComponent } from './agensi/agensi.component';
import { PelaksanaComponent } from './pelaksana/pelaksana.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'senarai-pengumuman',
				component: PengumumanComponent
			},
			{
				path: 'senarai-bencana',
				component: BencanaComponent
			},
			{
				path: 'senarai-dun',
				component: DunComponent
			},
			{
				path: 'senarai-pinjaman-usahawan',
				component: PinjamanUsahawanComponent
			},
			{
				path: 'senarai-jenis-bantuan',
				component: JenisBantuanComponent
			},
			{
				path: 'senarai-pemilik-projek-rumah',
				component: PemilikProjekRumahComponent
			},
			{
				path: 'senarai-kementerian',
				component: KementerianComponent
			},
			{
				path: 'senarai-parlimen',
				component: ParlimenComponent
			},
			{
				path: 'senarai-kerosakan-rumah',
				component: KerosakanRumahComponent
			},
			{
				path: 'senarai-daerah',
				component: DaerahComponent
			},
			{
				path: 'senarai-status-berpindah',
				component: StatusBerpindahComponent
			},
			{
				path: 'senarai-sumber-dana',
				component: SumberDanaComponent
			},
			{
				path: 'senarai-pemilik-projek',
				component: PemilikProjekComponent
			},
			{
				path: 'senarai-negeri',
				component: NegeriComponent
			},
			{
				path: 'senarai-agensi',
				component: AgensiComponent
			},
			{
				path: 'senarai-pelaksana',
				component: PelaksanaComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TetapanRoutingModule {}
