import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddProjectOwnerComponent } from '../add-project-owner/add-project-owner.component';
import { EditProjectOwnerComponent } from '../edit-project-owner/edit-project-owner.component';

@Component({

  selector: 'app-list-project-owner',
  templateUrl: './list-project-owner.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]

})

export class ListProjectOwnerComponent implements OnInit {

  rows = [
    {"execName":"Kerajaan Negeri", "status":"Aktif"},
    {"execName":"Kerajaan Persekutuan", "status":"Aktif"},
    {"execName":"NGO", "status":"Aktif"},
  ]

  ColumnMode = ColumnMode;
  SortType = SortType;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  addProjectOwnerModal() {
    this.modalService.open(AddProjectOwnerComponent, { size: 'lg' });
  }

  editProjectOwnerModal() {
    this.modalService.open(EditProjectOwnerComponent, { size: 'lg' });
  }

}
