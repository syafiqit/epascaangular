import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TetapanRoutingModule } from './tetapan-routing.module';
import { PengumumanComponent } from './pengumuman/pengumuman.component';
import { TambahEditPengumumanComponent } from './pengumuman/tambah-edit-pengumuman/tambah-edit-pengumuman.component';
import { BencanaComponent } from './bencana/bencana.component';
import { TambahEditBencanaComponent } from './bencana/tambah-edit-bencana/tambah-edit-bencana.component';
import { DunComponent } from './dun/dun.component';
import { TambahEditDunComponent } from './dun/tambah-edit-dun/tambah-edit-dun.component';
import { PinjamanUsahawanComponent } from './pinjaman-usahawan/pinjaman-usahawan.component';
import { TambahEditPinjamanUsahawanComponent } from './pinjaman-usahawan/tambah-edit-pinjaman-usahawan/tambah-edit-pinjaman-usahawan.component';
import { JenisBantuanComponent } from './jenis-bantuan/jenis-bantuan.component';
import { TambahEditJenisBantuanComponent } from './jenis-bantuan/tambah-edit-jenis-bantuan/tambah-edit-jenis-bantuan.component';
import { PemilikProjekRumahComponent } from './pemilik-projek-rumah/pemilik-projek-rumah.component';
import { TambahEditPemilikProjekRumahComponent } from './pemilik-projek-rumah/tambah-edit-pemilik-projek-rumah/tambah-edit-pemilik-projek-rumah.component';
import { KementerianComponent } from './kementerian/kementerian.component';
import { TambahEditKementerianComponent } from './kementerian/tambah-edit-kementerian/tambah-edit-kementerian.component';
import { ParlimenComponent } from './parlimen/parlimen.component';
import { TambahEditParlimenComponent } from './parlimen/tambah-edit-parlimen/tambah-edit-parlimen.component';
import { KerosakanRumahComponent } from './kerosakan-rumah/kerosakan-rumah.component';
import { TambahEditKerosakanRumahComponent } from './kerosakan-rumah/tambah-edit-kerosakan-rumah/tambah-edit-kerosakan-rumah.component';
import { DaerahComponent } from './daerah/daerah.component';
import { TambahEditDaerahComponent } from './daerah/tambah-edit-daerah/tambah-edit-daerah.component';
import { StatusBerpindahComponent } from './status-berpindah/status-berpindah.component';
import { TambahEditStatusBerpindahComponent } from './status-berpindah/tambah-edit-status-berpindah/tambah-edit-status-berpindah.component';
import { SumberDanaComponent } from './sumber-dana/sumber-dana.component';
import { TambahEditSumberDanaComponent } from './sumber-dana/tambah-edit-sumber-dana/tambah-edit-sumber-dana.component';
import { PemilikProjekComponent } from './pemilik-projek/pemilik-projek.component';
import { TambahEditPemilikProjekComponent } from './pemilik-projek/tambah-edit-pemilik-projek/tambah-edit-pemilik-projek.component';
import { NegeriComponent } from './negeri/negeri.component';
import { TambahEditNegeriComponent } from './negeri/tambah-edit-negeri/tambah-edit-negeri.component';
import { AgensiComponent } from './agensi/agensi.component';
import { TambahEditAgensiComponent } from './agensi/tambah-edit-agensi/tambah-edit-agensi.component';
import { PelaksanaComponent } from './pelaksana/pelaksana.component';
import { TambahEditPelaksanaComponent } from './pelaksana/tambah-edit-pelaksana/tambah-edit-pelaksana.component';
import { HubunganComponent } from './hubungan/hubungan.component';
import { TambahEditHubunganComponent } from './hubungan/tambah-edit-hubungan/tambah-edit-hubungan.component';
import { PerananComponent } from './peranan/peranan.component';
import { TambahEditPerananComponent } from './peranan/tambah-edit-peranan/tambah-edit-peranan.component';
import { RujukanComponent } from './rujukan/rujukan.component';
import { TambahEditRujukanComponent } from './rujukan/tambah-edit-rujukan/tambah-edit-rujukan.component';

@NgModule({
	imports: [CommonModule, SharedModule, TetapanRoutingModule, NgxDatatableModule, TableModule, PaginatorModule],
	declarations: [
		PengumumanComponent,
		TambahEditPengumumanComponent,
		BencanaComponent,
		TambahEditBencanaComponent,
		DunComponent,
		TambahEditDunComponent,
		PinjamanUsahawanComponent,
		TambahEditPinjamanUsahawanComponent,
		JenisBantuanComponent,
		TambahEditJenisBantuanComponent,
		PemilikProjekRumahComponent,
		TambahEditPemilikProjekRumahComponent,
		KementerianComponent,
		TambahEditKementerianComponent,
		ParlimenComponent,
		TambahEditParlimenComponent,
		KerosakanRumahComponent,
		TambahEditKerosakanRumahComponent,
		DaerahComponent,
		TambahEditDaerahComponent,
		StatusBerpindahComponent,
		TambahEditStatusBerpindahComponent,
		SumberDanaComponent,
		TambahEditSumberDanaComponent,
		PemilikProjekComponent,
		TambahEditPemilikProjekComponent,
		NegeriComponent,
		TambahEditNegeriComponent,
		AgensiComponent,
		TambahEditAgensiComponent,
		PelaksanaComponent,
		TambahEditPelaksanaComponent,
		HubunganComponent,
		TambahEditHubunganComponent,
		PerananComponent,
		TambahEditPerananComponent,
		RujukanComponent,
		TambahEditRujukanComponent
	]
})
export class TetapanModule {}
