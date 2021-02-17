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
				path: 'senarai-pengurusan-mangsa',
				component: PengurusanMangsaComponent
			},
			{
				path: 'tambah-pengurusan-mangsa',
				component: TambahPengurusanMangsaComponent
			},
			{
				path: 'edit-pengurusan-mangsa',
				component: EditPengurusanMangsaComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PengurusanMangsaRoutingModule {}
