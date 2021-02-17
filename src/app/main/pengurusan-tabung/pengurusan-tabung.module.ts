import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { PengurusanTabungRoutingModule } from './pengurusan-tabung-routing.module';
import { TabungComponent } from './tabung/tabung.component';
import { TambahEditTabungComponent } from './tabung/tambah-edit-tabung/tambah-edit-tabung.component';
import { WangIhsanComponent } from './wang-ihsan/wang-ihsan.component';
import { TambahEditWangIhsanComponent } from './wang-ihsan/tambah-edit-wang-ihsan/tambah-edit-wang-ihsan.component';
import { MukaHalamanTabungComponent } from './muka-halaman-tabung/muka-halaman-tabung.component';
import { SkbComponent } from './skb/skb.component';
import { TambahEditSkbComponent } from './skb/tambah-edit-skb/tambah-edit-skb.component';
import { BayaranSecaraTerusComponent } from './bayaran-secara-terus/bayaran-secara-terus.component';
import { TambahEditBayaranSecaraTerusComponent } from './bayaran-secara-terus/tambah-edit-bayaran-secara-terus/tambah-edit-bayaran-secara-terus.component';
import { KelulusanComponent } from './kelulusan/kelulusan.component';
import { TambahKelulusanComponent } from './kelulusan/tambah-kelulusan/tambah-kelulusan.component';
import { EditKelulusanComponent } from './kelulusan/edit-kelulusan/edit-kelulusan.component';
import { TambahRujukanBencanaComponent } from './kelulusan/tambah-kelulusan/tambah-rujukan-bencana/tambah-rujukan-bencana.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		PengurusanTabungRoutingModule,
		NgxDatatableModule,
		TableModule,
		PaginatorModule
	],
	declarations: [
		TabungComponent,
		TambahEditTabungComponent,
		WangIhsanComponent,
		TambahEditWangIhsanComponent,
		MukaHalamanTabungComponent,
		SkbComponent,
		TambahEditSkbComponent,
		BayaranSecaraTerusComponent,
		TambahEditBayaranSecaraTerusComponent,
		KelulusanComponent,
		TambahKelulusanComponent,
		EditKelulusanComponent,
		TambahRujukanBencanaComponent
	]
})
export class PengurusanTabungModule {}
