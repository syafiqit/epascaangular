import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { PengurusanBencanaRoutingModule } from './pengurusan-bencana-routing.module';
import { PengurusanBencanaComponent } from '../pengurusan-bencana/pengurusan-bencana.component';
import { TambahEditPengurusanBencanaComponent } from '../pengurusan-bencana/tambah-edit-pengurusan-bencana/tambah-edit-pengurusan-bencana.component';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '@app/shared/date-parser/NgbDateCustomParserFormatter';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		PengurusanBencanaRoutingModule,
		TableModule,
		PaginatorModule,
		NgSelectModule
	],
	declarations: [PengurusanBencanaComponent, TambahEditPengurusanBencanaComponent],
	providers: [
		{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
	   ]
})
export class PengurusanBencanaModule {}
