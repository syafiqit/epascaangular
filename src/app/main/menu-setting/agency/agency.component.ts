import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { AddAgencyComponent } from '../agency/add-agency/add-agency.component';
import { EditAgencyComponent } from '../agency/edit-agency/edit-agency.component';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class AgencyComponent implements OnInit {

  rows = [
    { "name": "Agensi Pengurusan Bencana Negara", "code": "APBN", "ministry": "JPN", "status": "Aktif",},
    { "name": "Amanah Ikhtiar Malaysia", "code": "AIM", "ministry": "LAIN", "status": "Aktif ",},
    { "name": "Felcra Berhad", "code": "FELCRA", "ministry": "KKLW", "status": "Aktif",},
  ];

  ColumnMode = ColumnMode;
  SortType = SortType;
  page = 4;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  addAgencyModal() {
    this.modalService.open(AddAgencyComponent, { size: 'lg' });
  }

  editAgencyModal() {
    this.modalService.open(EditAgencyComponent, { size: 'lg' });
  }

  ngOnInit(): void {
  }

}
