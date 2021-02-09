import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { AddCharityMoneyComponent } from '../charity-money/add-charity-money/add-charity-money.component';
import { EditCharityMoneyComponent } from '../charity-money/edit-charity-money/edit-charity-money.component';

@Component({
  selector: 'app-charity-money',
  templateUrl: './charity-money.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class CharityMoneyComponent implements OnInit {

  rows = [
    { "state": "PENANG", "district": "SPT", "disasterType": "Banjir", "statusRef": "Tidak Lengkap", "year": "2020", "w/kir": "500", "kirTotal": "76", "totalRM": "38000.00", "eftDate": "21/2/2020", "balReturn": "2000.00"},
    { "state": "PAHANG", "district": "KUANTAN", "disasterType": "Ribut", "statusRef": "Tidak Lengkap", "year": "2020", "w/kir": "500", "kirTotal": "50", "totalRM": "18000.00", "eftDate": "23/2/2020", "balReturn": "-"},
    { "state": "PAHANG", "district": "25/02/KUANTAN", "disasterType": "Ribut", "statusRef": "Tidak Lengkap", "year": "2020", "w/kir": "200", "kirTotal": "10", "totalRM": "10000.00", "eftDate": "23/2/2020", "balReturn": "-"},
    { "state": "PAHANG", "district": "25/KUANTAN/2020", "disasterType": "Ribut", "statusRef": "Lengkap", "year": "2019", "w/kir": "200", "kirTotal": "10", "totalRM": "10000.00", "eftDate": "23/2/2020", "balReturn": "-"},
  ];

  ColumnMode = ColumnMode;
  SortType = SortType;
  page = 4;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit(): void {
  }

  addCharityMoneyModal() {
    this.modalService.open(AddCharityMoneyComponent, { size: 'lg' });
  }

  editCharityMoneyModal() {
    this.modalService.open(EditCharityMoneyComponent, { size: 'lg' });
  }

}
