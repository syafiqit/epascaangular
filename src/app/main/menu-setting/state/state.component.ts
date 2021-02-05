import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {AddStateComponent} from './add-state/add-state.component';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
})
export class StateComponent implements OnInit {

  rows = [
    {"state" : "Terengganu", "status": "Aktif"},
    {"state" : "Kuala Lumpur", "status": "Aktif"},

  ];

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  addStateModal() {
    this.modalService.open(AddStateComponent, { size: 'lg' });
  }

}
