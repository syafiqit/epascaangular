import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from 'angular-archwizard';
import { PengurusanTabungRoutingModule } from './pengurusan-tabung-routing.module';
import { TabungComponent } from './tabung/tabung.component';
import { TambahEditTabungComponent } from './tabung/tambah-edit-tabung/tambah-edit-tabung.component';
import { WangIhsanComponent } from './wang-ihsan/wang-ihsan.component';
import { TambahEditWangIhsanComponent } from './wang-ihsan/tambah-edit-wang-ihsan/tambah-edit-wang-ihsan.component';
import { EditWangIhsanComponent } from './wang-ihsan/edit-wang-ihsan/edit-wang-ihsan.component';
import { MukaHalamanTabungComponent } from './muka-halaman-tabung/muka-halaman-tabung.component';
import { SkbComponent } from './skb/skb.component';
import { TambahSkbComponent } from './skb/tambah-skb/tambah-skb.component';
import { EditSkbComponent } from './skb/edit-skb/edit-skb.component';
import { PilihanRujukanKelulusanComponent } from './skb/pilihan-rujukan-kelulusan/pilihan-rujukan-kelulusan.component';
import { TambahBelanjaBulanan } from './skb/tambah-belanja-bulanan/tambah-belanja-bulanan.component';
import { BayaranSecaraTerusComponent } from './bayaran-secara-terus/bayaran-secara-terus.component';
import { TambahEditBayaranSecaraTerusComponent } from './bayaran-secara-terus/tambah-edit-bayaran-secara-terus/tambah-edit-bayaran-secara-terus.component';
import { KelulusanComponent } from './kelulusan/kelulusan.component';
import { TambahKelulusanComponent } from './kelulusan/tambah-kelulusan/tambah-kelulusan.component';
import { EditKelulusanComponent } from './kelulusan/edit-kelulusan/edit-kelulusan.component';
import { TambahRujukanBencanaComponent } from './kelulusan/tambah-kelulusan/tambah-rujukan-bencana/tambah-rujukan-bencana.component';
import { TambahKetuaIsiRumahComponent } from './wang-ihsan/tambah-ketua-isi-rumah/tambah-ketua-isi-rumah.component';
import { TambahNoRujukanComponent } from './wang-ihsan/tambah-no-rujukan/tambah-no-rujukan.component';
import { EditTabungComponent } from './tabung/edit-tabung/edit-tabung.component';
import { TambahPeruntukanComponent } from './tabung/edit-tabung/tambah-peruntukan/tambah-peruntukan.component';
import { PilihanBencanaComponent } from './skb/pilihan-bencana/pilihan-bencana.component';
import { PilihRujukanKelulusanComponent } from './bayaran-secara-terus/pilih-rujukan-kelulusan/pilih-rujukan-kelulusan.component';
import { PilihTabungComponent } from './bayaran-secara-terus/pilih-tabung/pilih-tabung.component';
import { PilihBencanaComponent } from './bayaran-secara-terus/pilih-bencana/pilih-bencana.component';
import { PilihPembayaranComponent } from './wang-ihsan/pilih-pembayaran/pilih-pembayaran.component';
import { TambahEditKirComponent } from './wang-ihsan/edit-wang-ihsan/tambah-edit-kir/tambah-edit-kir.component';
import { TambahBantuanComponent } from './wang-ihsan/tambah-bantuan/tambah-bantuan.component';
import { TambahEditPembayaranComponent } from './wang-ihsan/edit-wang-ihsan/tambah-edit-pembayaran/tambah-edit-pembayaran.component';
import { TambahEditBantuanComponent } from './wang-ihsan/edit-wang-ihsan/tambah-edit-bantuan/tambah-edit-bantuan.component';
import { PilihBencanaBwiComponent } from './wang-ihsan/pilih-bencana/pilih-bencana-bwi.component';
import { PilihBencanaKelulusanComponent } from './kelulusan/pilih-bencana-kelulusan/pilih-bencana-kelulusan.component';
import { PeruntukanDiambilComponent } from './kelulusan/peruntukan-diambil/peruntukan-diambil.component';
import { TambahEditKawasanBantuanComponent } from './wang-ihsan/edit-wang-ihsan/tambah-edit-kawasan-bantuan/tambah-edit-kawasan-bantuan.component';
import { TambahEditKirBwiComponent } from './wang-ihsan/edit-wang-ihsan/tambah-edit-kir/tambah-edit-kir-bwi/tambah-edit-kir-bwi.component';
import { MaklumatSuratComponent } from './kelulusan/edit-kelulusan/maklumat-surat/maklumat-surat.component';
import { PerbelanjaanComponent } from './kelulusan/edit-kelulusan/perbelanjaan/perbelanjaan.component';
import { JenisBayaranSkbComponent } from './kelulusan/edit-kelulusan/perbelanjaan/jenis-bayaran-skb/jenis-bayaran-skb.component';
import { JenisBayaranTerusComponent } from './kelulusan/edit-kelulusan/perbelanjaan/jenis-bayaran-terus/jenis-bayaran-terus.component';
import { PeruntukanDiambilListComponent } from './kelulusan/edit-kelulusan/peruntukan-diambil/peruntukan-diambil-list.component';
import { KategoriSkbComponent } from './kelulusan/edit-kelulusan/perbelanjaan/kategori-skb/kategori-skb.component';
import { KategoriTerusComponent } from './kelulusan/edit-kelulusan/perbelanjaan/kategori-terus/kategori-terus.component';
import { NgbDateCustomParserFormatter } from '@app/shared/date-parser/NgbDateCustomParserFormatter';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		PengurusanTabungRoutingModule,
		NgxDatatableModule,
		TableModule,
		PaginatorModule,
    NgSelectModule,
    ArchwizardModule
	],
	declarations: [
		TabungComponent,
		TambahEditTabungComponent,
		WangIhsanComponent,
    TambahEditWangIhsanComponent,
    EditWangIhsanComponent,
		MukaHalamanTabungComponent,
		SkbComponent,
		TambahSkbComponent,
    EditSkbComponent,
    PilihanRujukanKelulusanComponent,
    TambahBelanjaBulanan,
		BayaranSecaraTerusComponent,
		TambahEditBayaranSecaraTerusComponent,
		KelulusanComponent,
		TambahKelulusanComponent,
		EditKelulusanComponent,
		TambahRujukanBencanaComponent,
		TambahKetuaIsiRumahComponent,
		TambahNoRujukanComponent,
		EditTabungComponent,
		TambahPeruntukanComponent,
    PilihanBencanaComponent,
		PilihRujukanKelulusanComponent,
		PilihTabungComponent,
		PilihBencanaComponent,
		PilihPembayaranComponent,
		TambahEditKirComponent,
    TambahBantuanComponent,
    TambahEditPembayaranComponent,
    TambahEditBantuanComponent,
    PilihBencanaKelulusanComponent,
    PeruntukanDiambilComponent,
    PilihBencanaBwiComponent,
    TambahEditKawasanBantuanComponent,
    TambahEditKirBwiComponent,
    MaklumatSuratComponent,
    PerbelanjaanComponent,
    JenisBayaranSkbComponent,
    JenisBayaranTerusComponent,
	PeruntukanDiambilListComponent,
	KategoriSkbComponent,
	KategoriTerusComponent
	],
	providers: [
		{provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
	   ]
})
export class PengurusanTabungModule {}
