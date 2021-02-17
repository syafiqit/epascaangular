import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MukaHalamanComponent } from './muka-halaman.component';

const routes: Routes = [
	{
		path: '',
		component: MukaHalamanComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MukaHalamanRoutingModule {}
