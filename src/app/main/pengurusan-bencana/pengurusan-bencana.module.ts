import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { PengurusanBencanaRoutingModule } from './pengurusan-bencana-routing.module';
import { PengurusanBencanaComponent } from '../pengurusan-bencana/pengurusan-bencana.component';
import { TambahEditPengurusanBencanaComponent } from '../pengurusan-bencana/tambah-edit-pengurusan-bencana/tambah-edit-pengurusan-bencana.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		PengurusanBencanaRoutingModule,
		NgxDatatableModule,
		TableModule,
		PaginatorModule,
		NgSelectModule
	],
	declarations: [PengurusanBencanaComponent, TambahEditPengurusanBencanaComponent]
})
export class PengurusanBencanaModule {}
