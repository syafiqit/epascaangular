import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { EditHelpDonationComponent } from '../help-donation/edit-help-donation/edit-help-donation.component';

@Component({
  selector: 'app-help-donation',
  templateUrl: './help-donation.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class HelpDonationComponent implements OnInit {

  rows = [
    { "name": "Baik Pulih Rumah", "status": "Aktif",},
    { "name": "Bina Rumah Kekal", "status": "Aktif ",},
    { "name": "Bina Rumah Transit", "status": "Aktif",},
    { "name": "Pinjaman Usahawan", "status": "Aktif",},
    { "name": "Wang Ehsan", "status": "Aktif",},
  ];

  ColumnMode = ColumnMode;
  SortType = SortType;
  page = 4;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  editHelpDonationModal() {
    this.modalService.open(EditHelpDonationComponent, { size: 'lg' });
  }

  ngOnInit(): void {
  }

}
