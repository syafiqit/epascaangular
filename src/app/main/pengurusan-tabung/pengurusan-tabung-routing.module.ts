import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabungComponent } from './tabung/tabung.component';
import { WangIhsanComponent } from './wang-ihsan/wang-ihsan.component';
import { TambahEditWangIhsanComponent } from './wang-ihsan/tambah-edit-wang-ihsan/tambah-edit-wang-ihsan.component';
import { MukaHalamanTabungComponent } from './muka-halaman-tabung/muka-halaman-tabung.component';
import { SkbComponent } from './skb/skb.component';
import { TambahEditSkbComponent } from './skb/tambah-edit-skb/tambah-edit-skb.component';
import { BayaranSecaraTerusComponent } from './bayaran-secara-terus/bayaran-secara-terus.component';
import { TambahEditBayaranSecaraTerusComponent } from './bayaran-secara-terus/tambah-edit-bayaran-secara-terus/tambah-edit-bayaran-secara-terus.component';
import { KelulusanComponent } from './kelulusan/kelulusan.component';
import { TambahKelulusanComponent } from './kelulusan/tambah-kelulusan/tambah-kelulusan.component';
import { EditKelulusanComponent } from './kelulusan/edit-kelulusan/edit-kelulusan.component';
import { EditTabungComponent } from './tabung/edit-tabung/edit-tabung.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'senarai-tabung',
				component: TabungComponent
			},
			{
				path: 'senarai-wang-ihsan',
				component: WangIhsanComponent
			},
			{
				path: 'tambah-edit-wang-ihsan',
				component: TambahEditWangIhsanComponent
			},
			{
				path: 'muka-halaman-tabung',
				component: MukaHalamanTabungComponent
			},
			{
				path: 'senarai-skb',
				component: SkbComponent
			},
			{
				path: 'tambah-edit-skb',
				component: TambahEditSkbComponent
			},
			{
				path: 'senarai-bayaran-secara-terus',
				component: BayaranSecaraTerusComponent
			},
			{
				path: 'tambah-edit-bayaran-secara-terus',
				component: TambahEditBayaranSecaraTerusComponent
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
				path: 'edit-tabung',
				component: EditTabungComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PengurusanTabungRoutingModule {}
