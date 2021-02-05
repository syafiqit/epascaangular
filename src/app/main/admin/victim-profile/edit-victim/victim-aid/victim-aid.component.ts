import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import {IhsanDonationComponent} from './ihsan-donation/ihsan-donation.component';
import {SpecialLoanComponent} from './special-loan/special-loan.component';
import {AgricultureAidComponent} from './agriculture-aid/agriculture-aid.component';
import {InternationalAidComponent} from './international-aid/international-aid.component';
import {OtherAidComponent} from './other-aid/other-aid.component';
declare var require;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-victim-aid',
  templateUrl: './victim-aid.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class VictimAidComponent implements OnInit {

  rows = [
    { "aid": "Wang Ihsan", "type": "Banjir", "date": "12-12-2020", "total": "500"},
  ];

  categories = [
    { "data": "barangan kebersihan", },
    { "data": "barangan perubatan", },
  ];

  items = [
    { "data": "Makanan Tin",},
    { "data": "Makanan Kering",},
  ];

  ColumnMode = ColumnMode;
  SortType = SortType;

  delete() {
    Swal.fire(
      'Berjaya!',
      'Barangan Berjaya Di Buang.',
      'success'
    )
  };

  ihsanDonationModal() {
    this.modalService.open(IhsanDonationComponent, { size: 'lg' });
  }

  specialLoanModal() {
    this.modalService.open(SpecialLoanComponent, { size: 'lg' });
  }

  agricultureAidModal() {
    this.modalService.open(AgricultureAidComponent, { size: 'lg' });
  }

  internationalAidModal() {
    this.modalService.open(InternationalAidComponent, { size: 'lg' });
  }

  otherAidModal() {
    this.modalService.open(OtherAidComponent, { size: 'lg' });
  }


  constructor(config: NgbModalConfig, private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

}
