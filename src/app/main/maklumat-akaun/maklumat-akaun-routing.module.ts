import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PenggunaComponent } from './pengguna/pengguna.component';
import { RujukanComponent } from './rujukan/rujukan.component';
import { PaparContohRumahComponent } from './rujukan/papar-contoh-rumah/papar-contoh-rumah.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'pengguna',
				component: PenggunaComponent
			},
			{
				path: 'rujukan',
				component: RujukanComponent
			},
			{
				path: 'contoh-rumah',
				component: PaparContohRumahComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MaklumatAkaunRoutingModule {}
