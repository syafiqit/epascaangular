import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-procurement',
  templateUrl: './procurement.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class ProcurementComponent implements OnInit {

  rows = [
    { "paymentRefNo": "BYRXXX", "date": "25/02/2020", "voucherNo": "120224", "approvalRefNo": "19", "procurementType": "Secara Darurat", "to": "K.L AIRPORT HOTEL SDN BHD", "category": "COVID"},
    { "paymentRefNo": "BYRXXX", "date": "03/03/2020", "voucherNo": "120250", "approvalRefNo": "19", "procurementType": "Secara Pembelian Terus", "to": "PERMAI TRADING", "category": "COVID"},
    { "paymentRefNo": "BYRXXX", "date": "20/03/2020", "voucherNo": "120361", "approvalRefNo": "21", "procurementType": "Secara DaruraPembelian Terus", "to": "BENDAHARI NEGERI SEMBILAN", "category": "COVID"},
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

}
