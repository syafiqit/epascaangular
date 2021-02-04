import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddMinistryComponent } from '../add-ministry/add-ministry.component';
@Component({
  selector: 'app-list-ministry',
  templateUrl: './list-ministry.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class ListMinistryComponent implements OnInit {

  rows = [
    {"name" : "Jabatan Perdana Menteri",  "code": "JPM", "status": "Aktif"},
    {"name" : "Kementerian Dalam Negeri",  "code": "KDN", "status": "Aktif"},
    {"name" : "Kementerian Kerja Raya", "code": "KKR", "status": "Aktif"}

  ]

  ColumnMode = ColumnMode;
  SortType = SortType;

   constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  addMinistryModal() {
    this.modalService.open(AddMinistryComponent, { size: 'lg' });
  }

}
