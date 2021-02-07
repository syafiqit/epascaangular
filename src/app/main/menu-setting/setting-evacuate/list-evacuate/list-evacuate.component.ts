import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditEvacuateComponent } from '../edit-evacuate/edit-evacuate.component';
import { AddEvacuateComponent } from '../add-evacuate/add-evacuate.component';

@Component({

  selector: 'app-list-evacuate',
  templateUrl: './list-evacuate.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]

})

export class ListEvacuateComponent implements OnInit {

  rows = [
    {"info":"Pusat Pemindahan", "status":"Aktif"},
    {"info":"Berpindah ke Hotel", "status":"Aktif"},
    {"info":"Berpindah ke Rumah Saudara", "status":"Aktif"},
    {"info":"Tidak Berpindah", "status":"Aktif"},
    {"info":"Lain-lain", "status":"Aktif"},
  ]

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  addEvacuateModal() {
    this.modalService.open(AddEvacuateComponent, { size: 'lg' });
  }

  editEvacuateModal() {
    this.modalService.open(EditEvacuateComponent, { size: 'lg' });
  }

}
