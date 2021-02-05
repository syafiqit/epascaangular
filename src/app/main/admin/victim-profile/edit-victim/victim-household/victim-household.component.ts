import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import {IhsanDonationComponent} from '../victim-aid/ihsan-donation/ihsan-donation.component';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {AddHouseholdComponent} from './add-household.component';
declare var require;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-victim-household',
  templateUrl: './victim-household.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class VictimHouseholdComponent implements OnInit {

  public isCollapsed = false;

  rows = [
    { "kp": "xxxx-xx-xxxx", "name": "Azizah Bt Kasim", "age": "12", "relationship": "Anak Perempuan"},
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

  addHouseholdModal() {
    this.modalService.open(AddHouseholdComponent, { size: 'lg' });
  }

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

}
