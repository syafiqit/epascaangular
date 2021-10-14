import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MukaHalamanRoutingModule } from './muka-halaman-routing.module';
import { MukaHalamanComponent } from './muka-halaman.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
	imports: [
    CommonModule,
    SharedModule,
    MukaHalamanRoutingModule,
    TableModule,
    PaginatorModule,
    NgSelectModule
  ],
	declarations: [MukaHalamanComponent]
})
export class MukaHalamanModule {}
