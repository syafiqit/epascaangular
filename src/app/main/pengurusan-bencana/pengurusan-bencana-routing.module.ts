import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PengurusanBencanaComponent } from './pengurusan-bencana.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'senarai-pengurusan-bencana',
				component: PengurusanBencanaComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PengurusanBencanaRoutingModule {}
