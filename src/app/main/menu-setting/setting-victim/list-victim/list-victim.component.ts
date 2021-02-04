import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { EditVictimComponent } from '../edit-victim/edit-victim.component';

@Component({

  selector: 'app-list-victim',
  templateUrl: './list-victim.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]

})

export class ListVictimComponent implements OnInit {

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

  editVictimModal() {
    this.modalService.open(EditVictimComponent, { size: 'lg' });
  }

}
