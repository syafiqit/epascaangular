import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaklumatAkaunRoutingModule } from './maklumat-akaun-routing.module';
import { PenggunaComponent } from './pengguna/pengguna.component';
import { TukarKataLaluanComponent } from './tukar-kata-laluan/tukar-kata-laluan.component';
import { RujukanComponent } from './rujukan/rujukan.component';
import { PaparContohRumahComponent } from './rujukan/papar-contoh-rumah/papar-contoh-rumah.component';

@NgModule({
	imports: [
    CommonModule,
    SharedModule,
    MaklumatAkaunRoutingModule,
    TableModule,
    PaginatorModule,
    NgxDropzoneModule,
    NgSelectModule
  ],
	declarations: [
    PenggunaComponent,
    TukarKataLaluanComponent,
    RujukanComponent,
    PaparContohRumahComponent
  ]
})
export class MaklumatAkaunModule {}
