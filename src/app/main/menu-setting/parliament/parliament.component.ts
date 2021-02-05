import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import {AddParliamentComponent} from './add-parliament/add-parliament.component';

@Component({
  selector: 'app-parliament',
  templateUrl: './parliament.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class ParliamentComponent implements OnInit {

  rows = [
    {"parliament" : "Besut",  "state": "Terengganu", "status": "Aktif"},
    {"parliament" : "Dungun",  "state": "Terengganu", "status": "Aktif"},
    {"parliament" : "KEmaman",  "state": "Terengganu", "status": "Aktif"},

  ];

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  addParliamentModal() {
    this.modalService.open(AddParliamentComponent, { size: 'lg' });
  }

}
