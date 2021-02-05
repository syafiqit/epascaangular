import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { AddHouseProjectOwnerComponent } from '../house-project-owner/add-house-project-owner/add-house-project-owner.component';
import { EditHouseProjectOwnerComponent } from '../house-project-owner/edit-house-project-owner/edit-house-project-owner.component';

@Component({
  selector: 'app-house-project-owner',
  templateUrl: './house-project-owner.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class HouseProjectOwnerComponent implements OnInit {

  rows = [
    { "name": "Kerajaan Negeri", "status": "Aktif",},
    { "name": "Kerajaan Persekutuan", "status": "Aktif ",},
    { "name": "NGO", "status": "Aktif",},
  ];

  ColumnMode = ColumnMode;
  SortType = SortType;
  page = 4;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  addProjectOwnerModal() {
    this.modalService.open(AddHouseProjectOwnerComponent, { size: 'lg' });
  }

  editProjectOwnerModal() {
    this.modalService.open(EditHouseProjectOwnerComponent, { size: 'lg' });
  }

  ngOnInit(): void {
  }

}
