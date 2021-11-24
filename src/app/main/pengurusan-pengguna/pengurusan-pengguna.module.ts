import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { PengurusanPenggunaRoutingModule } from './pengurusan-pengguna-routing.module';
import { PengurusanPenggunaComponent } from '../pengurusan-pengguna/pengurusan-pengguna.component';
import { TambahEditPengurusanPenggunaComponent } from '../pengurusan-pengguna/tambah-edit-pengurusan-pengguna/tambah-edit-pengurusan-pengguna.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermohonanPenggunaComponent } from './permohonan-pengguna/permohonan-pengguna.component';
import { NgbDateParserFormatter, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDateCustomParserFormatter } from '@app/shared/date-parser/NgbDateCustomParserFormatter';


@NgModule({
	imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    SharedModule,
    PengurusanPenggunaRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule
	],
	declarations: [
    PengurusanPenggunaComponent,
    TambahEditPengurusanPenggunaComponent,
    PermohonanPenggunaComponent
  ],
  providers: [
		{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
	]
})
export class PengurusanPenggunaModule {}
