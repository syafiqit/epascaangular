import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PengurusanBencanaComponent } from '../pengurusan-bencana/pengurusan-bencana.component';
import { TambahEditPengurusanBencanaComponent } from '../pengurusan-bencana/tambah-edit-pengurusan-bencana/tambah-edit-pengurusan-bencana.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'pengurusan-bencana',
				component: PengurusanBencanaComponent,
        data: { permission: 'Halaman.Bencana' }
			},
			{
				path: 'tambah-edit-pengurusan-bencana',
				component: TambahEditPengurusanBencanaComponent,
        data: { permission: 'Halaman.Bencana.Tambah,Halaman.Bencana.Edit' }
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PengurusanBencanaRoutingModule {}
