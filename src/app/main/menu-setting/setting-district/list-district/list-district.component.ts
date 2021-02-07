import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddDistrictComponent } from '../add-district/add-district.component';
import { EditDistrictComponent } from '../edit-district/edit-district.component';

@Component({

  selector: 'app-list-district',
  templateUrl: './list-district.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]

})

export class ListDistrictComponent implements OnInit {

  rows = [
    {"district":"Bentong", "state":"Pahang", "status":"Aktif"},
    {"district":"Bera", "state":"Pahang", "status":"Aktif"},
    {"district":"Jerantut", "state":"Pahang", "status":"Aktif"},
    {"district":"Lipis", "state":"Pahang", "status":"Aktif"},
    {"district":"Raub", "state":"Pahang", "status":"Aktif"},
  ]

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  addDistrictModal() {
    this.modalService.open(AddDistrictComponent, { size: 'lg' });
  }

  editDistrictModal() {
    this.modalService.open(EditDistrictComponent, { size: 'lg' });
  }

}
