import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { EditEntrepreneurLoanComponent } from '../entrepreneur-loan/edit-entrepreneur-loan/edit-entrepreneur-loan.component';

@Component({
  selector: 'app-entrepreneur-loan',
  templateUrl: './entrepreneur-loan.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class EntrepreneurLoanComponent implements OnInit {

  rows = [
    { "name": "Pembuatan", "status": "Aktif",},
    { "name": "Perkhidmatan", "status": "Aktif ",},
    { "name": "Pertanian dan Perusahaan Asas Tani", "status": "Aktif",},
    { "name": "Peruncitan", "status": "Aktif",},
  ];

  ColumnMode = ColumnMode;
  SortType = SortType;
  page = 4;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  editEntrepreneurModal() {
    this.modalService.open(EditEntrepreneurLoanComponent, { size: 'lg' });
  }

  ngOnInit(): void {
  }

}
