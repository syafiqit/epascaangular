import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PengurusanPenggunaComponent } from '../pengurusan-pengguna/pengurusan-pengguna.component';
import { TambahEditPengurusanPenggunaComponent } from '../pengurusan-pengguna/tambah-edit-pengurusan-pengguna/tambah-edit-pengurusan-pengguna.component';
import { PermohonanPenggunaComponent } from './permohonan-pengguna/permohonan-pengguna.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'senarai',
				component: PengurusanPenggunaComponent
			},
			{
				path: 'tambah-edit',
				component: TambahEditPengurusanPenggunaComponent
			},
			{
				path: 'permohonan',
				component: PermohonanPenggunaComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PengurusanPenggunaRoutingModule {}
