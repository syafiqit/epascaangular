import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddDamageComponent } from '../add-damage/add-damage.component';

@Component({

  selector: 'app-list-damage',
  templateUrl: './list-damage.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]

})

export class ListDamageComponent implements OnInit {

  rows = [
    {"damage":"Atap", "status":"Aktif"},{"damage":"Dinding", "status":"Aktif"},
    {"damage":"Lantai", "status":"Aktif"},{"damage":"Pendawaian", "status":"Aktif"},
    {"damage":"Lain-lain", "status":"Aktif"},{"damage":"Pintu", "status":"Aktif"},
  ]

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  addDamageModal() {
    this.modalService.open(AddDamageComponent, { size: 'lg' });
  }

}
