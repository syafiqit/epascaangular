import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PengurusanMangsaComponent } from './pengurusan-mangsa.component';
import { TambahPengurusanMangsaComponent } from './tambah-pengurusan-mangsa/tambah-pengurusan-mangsa.component';
import { EditPengurusanMangsaComponent } from './edit-pengurusan-mangsa/edit-pengurusan-mangsa.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'senarai',
				component: PengurusanMangsaComponent,
        data: { permission: 'Halaman.Mangsa' }
			},
			{
				path: 'tambah',
				component: TambahPengurusanMangsaComponent,
        data: { permission: 'Halaman.Mangsa.Tambah' }
			},
			{
				path: 'edit',
				component: EditPengurusanMangsaComponent,
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PengurusanMangsaRoutingModule {}
