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
import { HubunganComponent } from './hubungan/hubungan.component';
import { PerananComponent } from './peranan/peranan.component';
import { RujukanComponent } from './rujukan/rujukan.component';
import { KadarComponent } from './kadar/kadar.component';
import { JenisBwiComponent } from './jenis-bwi/jenis-bwi.component';
import { TetapanComponent } from './tetapan.component';
import { JenisBayaranComponent } from './jenis-bayaran/jenis-bayaran.component';
import { KategoriKelulusanComponent } from './kategori-kelulusan/kategori-kelulusan.component';
import { KadarBwiComponent } from './kadar-bwi/kadar-bwi.component';

const routes: Routes = [
	{
		path: '',
    component: TetapanComponent,
		children: [
			{
				path: 'pengumuman',
        outlet: 'menu',
				component: PengumumanComponent
			},
			{
				path: 'bencana',
        outlet: 'menu',
				component: BencanaComponent
			},
			{
				path: 'dun',
        outlet: 'menu',
				component: DunComponent
			},
			{
				path: 'pinjaman',
        outlet: 'menu',
				component: PinjamanUsahawanComponent
			},
			{
				path: 'jenis-bantuan',
        outlet: 'menu',
				component: JenisBantuanComponent
			},
			{
				path: 'pemilik-projek-rumah',
        outlet: 'menu',
				component: PemilikProjekRumahComponent
			},
			{
				path: 'kementerian',
        outlet: 'menu',
				component: KementerianComponent
			},
			{
				path: 'parlimen',
        outlet: 'menu',
				component: ParlimenComponent
			},
			{
				path: 'kerosakan-rumah',
        outlet: 'menu',
				component: KerosakanRumahComponent
			},
			{
				path: 'daerah',
        outlet: 'menu',
				component: DaerahComponent
			},
			{
				path: 'status-berpindah',
        outlet: 'menu',
				component: StatusBerpindahComponent
			},
			{
				path: 'sumber-dana',
        outlet: 'menu',
				component: SumberDanaComponent
			},
			{
				path: 'pemilik-projek',
        outlet: 'menu',
				component: PemilikProjekComponent
			},
			{
				path: 'negeri',
        outlet: 'menu',
				component: NegeriComponent
			},
			{
				path: 'agensi',
        outlet: 'menu',
				component: AgensiComponent
			},
			{
				path: 'pelaksana',
        outlet: 'menu',
				component: PelaksanaComponent
			},
			{
				path: 'hubungan',
        outlet: 'menu',
				component: HubunganComponent
			},
			{
				path: 'peranan',
        outlet: 'menu',
				component: PerananComponent
			},
			{
				path: 'rujukan',
        outlet: 'menu',
				component: RujukanComponent,
        data: { permission: 'Halaman.Tetapan.Rujukan' }
			},
			{
				path: 'kadar',
        outlet: 'menu',
				component: KadarComponent
			},
			{
				path: 'kadar-bwi',
        outlet: 'menu',
				component: KadarBwiComponent
			},
			{
				path: 'jenis-bwi',
        outlet: 'menu',
				component: JenisBwiComponent
			},
			{
				path: 'jenis-bayaran',
        		outlet: 'menu',
				component: JenisBayaranComponent
			},
			{
				path: 'kategori-kelulusan',
        		outlet: 'menu',
				component: KategoriKelulusanComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TetapanRoutingModule {}
