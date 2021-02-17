import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PengurusanPenggunaComponent } from '../pengurusan-pengguna/pengurusan-pengguna.component';
import { TambahEditPengurusanPenggunaComponent } from '../pengurusan-pengguna/tambah-edit-pengurusan-pengguna/tambah-edit-pengurusan-pengguna.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'senarai-pengurusan-pengguna',
				component: PengurusanPenggunaComponent
			},
			{
				path: 'tambah-edit-pengurusan-pengguna',
				component: TambahEditPengurusanPenggunaComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PengurusanPenggunaRoutingModule {}
