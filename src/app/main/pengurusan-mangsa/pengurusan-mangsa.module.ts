import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { PengurusanMangsaRoutingModule } from './pengurusan-mangsa-routing.module';
import { PengurusanMangsaComponent } from './pengurusan-mangsa.component';
import { TambahPengurusanMangsaComponent } from './tambah-pengurusan-mangsa/tambah-pengurusan-mangsa.component';
import { EditPengurusanMangsaComponent } from './edit-pengurusan-mangsa/edit-pengurusan-mangsa.component';
import { MaklumatMangsaComponent } from './edit-pengurusan-mangsa/maklumat-mangsa/maklumat-mangsa.component';
import { AhliRumahMangsaComponent } from './edit-pengurusan-mangsa/ahli-rumah-mangsa/ahli-rumah-mangsa.component';
import { TambahEditAhliRumahMangsaComponent } from './edit-pengurusan-mangsa/ahli-rumah-mangsa/tambah-edit-ahli-rumah-mangsa/tambah-edit-ahli-rumah-mangsa.component';
import { MangsaBencanaComponent } from './edit-pengurusan-mangsa/mangsa-bencana/mangsa-bencana.component';
import { TambahEditMangsaBencanaComponent } from './edit-pengurusan-mangsa/mangsa-bencana/tambah-edit-mangsa-bencana/tambah-edit-mangsa-bencana.component';
import { BantuanMangsaComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-mangsa.component';
import { BantuanPertanianComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-pertanian/bantuan-pertanian.component';
import { BantuanRumahComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-rumah/bantuan-rumah.component';
import { BantuanWangIhsanComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-wang-ihsan/bantuan-wang-ihsan.component';
import { BantuanAntarabangsaComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-antarabangsa/bantuan-antarabangsa.component';
import { BantuanLainComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-lain/bantuan-lain.component';
import { BantuanPinjamanKhasComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-pinjaman-khas/bantuan-pinjaman-khas.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		PengurusanMangsaRoutingModule,
		NgxDatatableModule,
		TableModule,
		PaginatorModule,
    NgSelectModule
	],
	declarations: [
		PengurusanMangsaComponent,
		TambahPengurusanMangsaComponent,
		EditPengurusanMangsaComponent,
		MaklumatMangsaComponent,
		AhliRumahMangsaComponent,
		TambahEditAhliRumahMangsaComponent,
		MangsaBencanaComponent,
		TambahEditMangsaBencanaComponent,
		BantuanMangsaComponent,
		BantuanPertanianComponent,
		BantuanRumahComponent,
		BantuanWangIhsanComponent,
		BantuanAntarabangsaComponent,
		BantuanLainComponent,
		BantuanPinjamanKhasComponent
	]
})
export class PengurusanMangsaModule {}
