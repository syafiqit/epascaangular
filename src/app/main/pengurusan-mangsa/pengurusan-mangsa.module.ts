import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { NgxDropzoneModule } from 'ngx-dropzone';
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
import { TambahEditBantuanAntarabangsaComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-antarabangsa/tambah-edit-bantuan-antarabangsa/tambah-edit-bantuan-antarabangsa.component';
import { TambahEditBantuanLainComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-lain/tambah-edit-bantuan-lain/tambah-edit-bantuan-lain.component';
import { TambahEditBantuanPertanianComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-pertanian/tambah-edit-bantuan-pertanian/tambah-edit-bantuan-pertanian.component';
import { TambahEditBantuanPinjamanKhasComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-pinjaman-khas/tambah-edit-bantuan-pinjaman-khas/tambah-edit-bantuan-pinjaman-khas.component';
import { TambahEditBantuanRumahComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-rumah/tambah-edit-bantuan-rumah/tambah-edit-bantuan-rumah.component';
import { TambahEditBantuanWangIhsanComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/bantuan-wang-ihsan/tambah-edit-bantuan-wang-ihsan/tambah-edit-bantuan-wang-ihsan.component';
import { LookupBencanaComponent } from './edit-pengurusan-mangsa/bantuan-mangsa/lookup-bencana/lookup-bencana.component';
import { SelectBencanaComponent } from './select-bencana/select-bencana.component';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '@app/shared/date-parser/NgbDateCustomParserFormatter';
import { EditMultipleBantuanWangIhsanComponent } from './edit-multiple-bantuan-wang-ihsan/edit-multiple-bantuan-wang-ihsan.component';
import { CreateMultipleBencanaComponent } from './create-multiple-bencana/create-multiple-bencana.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { ImportBulkUploadComponent } from './import-bulk-upload/import-bulk-upload.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		PengurusanMangsaRoutingModule,
		TableModule,
		PaginatorModule,
    NgSelectModule,
    NgxDropzoneModule,
    NgxCurrencyModule
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
		BantuanPinjamanKhasComponent,
		TambahEditBantuanAntarabangsaComponent,
		TambahEditBantuanLainComponent,
		TambahEditBantuanPertanianComponent,
		TambahEditBantuanPinjamanKhasComponent,
		TambahEditBantuanRumahComponent,
		TambahEditBantuanWangIhsanComponent,
    LookupBencanaComponent,
    SelectBencanaComponent,
    EditMultipleBantuanWangIhsanComponent,
    CreateMultipleBencanaComponent,
    ImportBulkUploadComponent
	],
	providers: [
		{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
	   ]
})
export class PengurusanMangsaModule {}
