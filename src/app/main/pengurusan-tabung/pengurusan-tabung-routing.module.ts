import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabungComponent } from './tabung/tabung.component';
import { WangIhsanComponent } from './wang-ihsan/wang-ihsan.component';
import { TambahEditWangIhsanComponent } from './wang-ihsan/tambah-edit-wang-ihsan/tambah-edit-wang-ihsan.component';
import { EditWangIhsanComponent } from './wang-ihsan/edit-wang-ihsan/edit-wang-ihsan.component';
import { MukaHalamanTabungComponent } from './muka-halaman-tabung/muka-halaman-tabung.component';
import { SkbComponent } from './skb/skb.component';
import { TambahSkbComponent } from './skb/tambah-skb/tambah-skb.component';
import { EditSkbComponent } from './skb/edit-skb/edit-skb.component';
import { BayaranSecaraTerusComponent } from './bayaran-secara-terus/bayaran-secara-terus.component';
import { TambahEditBayaranSecaraTerusComponent } from './bayaran-secara-terus/tambah-edit-bayaran-secara-terus/tambah-edit-bayaran-secara-terus.component';
import { KelulusanComponent } from './kelulusan/kelulusan.component';
import { TambahKelulusanComponent } from './kelulusan/tambah-kelulusan/tambah-kelulusan.component';
import { EditKelulusanComponent } from './kelulusan/edit-kelulusan/edit-kelulusan.component';
import { EditTabungComponent } from './tabung/edit-tabung/edit-tabung.component';
import { TambahEditKirComponent } from './wang-ihsan/edit-wang-ihsan/tambah-edit-kir/tambah-edit-kir.component';
import { WaranComponent } from './waran/waran.component';
import { TambahWaranComponent } from './waran/tambah-waran/tambah-waran.component';
import { EditWaranComponent } from './waran/edit-waran/edit-waran.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'senarai',
				component: TabungComponent
			},
			{
				path: 'senarai-wang-ihsan',
				component: WangIhsanComponent
			},
			{
				path: 'tambah-wang-ihsan',
				component: TambahEditWangIhsanComponent
			},
      {
        path: 'edit-wang-ihsan',
        component: EditWangIhsanComponent
      },
			{
				path: 'muka-halaman-tabung',
				component: MukaHalamanTabungComponent
			},
			{
				path: 'skb/senarai',
				component: SkbComponent,
        data: { permission: 'Halaman.Tabung.Bayaran.SKB' }
			},
			{
				path: 'skb/tambah',
				component: TambahSkbComponent,
        data: { permission: 'Halaman.Tabung.Bayaran.SKB.Tambah' }
			},
			{
				path: 'skb/edit',
				component: EditSkbComponent,
        data: { permission: 'Halaman.Tabung.Bayaran.SKB.Edit' }
			},
			{
				path: 'bayaran-terus/senarai',
				component: BayaranSecaraTerusComponent,
        data: { permission: 'Halaman.Tabung.Bayaran.Terus' }
			},
			{
				path: 'bayaran-terus/tambah',
				component: TambahEditBayaranSecaraTerusComponent,
        data: { permission: 'Halaman.Tabung.Bayaran.Terus.Tambah' }
			},
			{
				path: 'bayaran-terus/edit',
				component: TambahEditBayaranSecaraTerusComponent,
        data: { permission: 'Halaman.Tabung.Bayaran.Terus.Edit' }
			},
			{
				path: 'senarai-kelulusan',
				component: KelulusanComponent
			},
			{
				path: 'tambah-kelulusan',
				component: TambahKelulusanComponent
			},
			{
				path: 'edit-kelulusan',
				component: EditKelulusanComponent
			},
			{
				path: 'edit',
				component: EditTabungComponent
			},
			{
				path: 'edit-wang-ihsan/kir',
				component: TambahEditKirComponent
			},
			{
				path: 'waran/senarai',
				component: WaranComponent,
        data: { permission: 'Halaman.Tabung.Bayaran.Waran' }
			},
			{
				path: 'waran/tambah',
				component: TambahWaranComponent,
        data: { permission: 'Halaman.Tabung.Bayaran.Waran.Tambah' }
			},
			{
				path: 'waran/edit',
				component: EditWaranComponent,
        data: { permission: 'Halaman.Tabung.Bayaran.Waran.Edit' }
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PengurusanTabungRoutingModule {}
