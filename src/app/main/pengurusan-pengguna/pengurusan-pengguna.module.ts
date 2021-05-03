import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { PengurusanPenggunaRoutingModule } from './pengurusan-pengguna-routing.module';
import { PengurusanPenggunaComponent } from '../pengurusan-pengguna/pengurusan-pengguna.component';
import { TambahEditPengurusanPenggunaComponent } from '../pengurusan-pengguna/tambah-edit-pengurusan-pengguna/tambah-edit-pengurusan-pengguna.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		PengurusanPenggunaRoutingModule,
		NgxDatatableModule,
		TableModule,
		PaginatorModule,
    NgSelectModule
	],
	declarations: [PengurusanPenggunaComponent, TambahEditPengurusanPenggunaComponent]
})
export class PengurusanPenggunaModule {}
