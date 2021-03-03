import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { PengurusanBencanaRoutingModule } from './pengurusan-bencana-routing.module';
import { TambahEditPengurusanBencanaComponent } from './tambah-edit-pengurusan-bencana/tambah-edit-pengurusan-bencana.component';
import { PengurusanBencanaComponent } from './pengurusan-bencana.component';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		PengurusanBencanaRoutingModule,
		NgxDatatableModule,
		TableModule,
		PaginatorModule
	],
	declarations: [PengurusanBencanaComponent, TambahEditPengurusanBencanaComponent]
})
export class PengurusanBencanaModule {}
