import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MukaHalamanRoutingModule } from './muka-halaman-routing.module';
import { MukaHalamanComponent } from './muka-halaman.component';

@NgModule({
	imports: [CommonModule, SharedModule, MukaHalamanRoutingModule, NgxDatatableModule, TableModule, PaginatorModule],
	declarations: [MukaHalamanComponent]
})
export class MukaHalamanModule {}
