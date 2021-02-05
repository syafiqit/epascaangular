import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddDisasterComponent } from '../add-disaster/add-disaster.component';

@Component({
  selector: 'app-list-disaster',
  templateUrl: './list-disaster.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class ListDisasterComponent implements OnInit {

  rows = [
    {"date" : "12/12/2020",  "disaster": "Banjir", "notes": "Gelombang 1"},
    {"date" : "20/12/2020",  "disaster": "Covid-19", "notes": "Kluster 1 & 2"},
    {"date" : "3/1/2021", "disaster": "Covid-19", "notes": "Kluster 3"}

  ]

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  addDisasterModal() {
    this.modalService.open(AddDisasterComponent, { size: 'lg' });
  }

}
