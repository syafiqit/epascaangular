import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import {IhsanDonationComponent} from './ihsan-donation/ihsan-donation.component';
import {SpecialLoanComponent} from './special-loan/special-loan.component';
import {AgricultureAidComponent} from './agriculture-aid/agriculture-aid.component';
import {InternationalAidComponent} from './international-aid/international-aid.component';
import {OtherAidComponent} from './other-aid/other-aid.component';
import {HouseAidComponent} from './house-aid/house-aid.component';
declare var require;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-victim-aid',
  templateUrl: './victim-aid.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class VictimAidComponent implements OnInit {

  ihsanDonation = [
    { "disaster": "Banjir", "agency": "Agency A", "date": "12-12-2020", "total": "500"},
  ];

  houseAid = [
    { "disaster": "Banjir", "help": "Bina Pulih Rumah", "date": "12-12-2020", "totalPredict": "500", "totalReal": "500"},
  ];

  specialLoan = [
    { "disaster": "Banjir", "agency": "Agency A", "date": "12-12-2020", "total": "500"},
  ];

  agricultureAid = [
    { "disaster": "Banjir", "agency": "Agency A", "agriculture": "Sawit", "date": "12-12-2020", "total": "500"},
  ];

  internationalAid = [
    { "disaster": "Banjir", "agency": "United Kingdom", "date": "12-12-2020", "total": "500"},
  ];

  otherAid = [
    { "disaster": "Banjir", "help": "Bantuan Kaunseling", "date": "12-12-2020", "total": "500"},
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

  houseAidModal() {
    this.modalService.open(HouseAidComponent, { size: 'lg' });
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
