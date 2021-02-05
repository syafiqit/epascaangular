import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {AddDunComponent} from './add-dun/add-dun.component';

@Component({
  selector: 'app-dun',
  templateUrl: './dun.component.html',
})
export class DunComponent implements OnInit {

  rows = [
    {"dun" : "Guar Sanji", "parliament": "Arau", "state": "Perlis", "status": "Aktif"},
    {"dun" : "Pauh", "parliament": "Arau", "state": "Perlis", "status": "Aktif"},
    {"dun" : "Sanglang", "parliament": "Arau", "state": "Perlis", "status": "Aktif"},

  ];

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  addDunModal() {
    this.modalService.open(AddDunComponent, { size: 'lg' });
  }

}
