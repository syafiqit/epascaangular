import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
	declarations: [],
	imports: [CommonModule, SharedModule, MainRoutingModule, NgxDatatableModule, TableModule, PaginatorModule]
})
export class MainModule {}
