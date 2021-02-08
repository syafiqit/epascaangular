import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-skb',
  templateUrl: './skb.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class SKBComponent implements OnInit {

  rows = [
    { "approvalRef": "AXXXXX", "skbRef": "SKBXXX", "officer": "Setiausaha Kerajaan", "agency": "SUK Negeri Kedah", "fundCategory": "Bukan Covid", "startDate": "23/10/2019", "endDate": "30/6/2020", "ceilingAllocate": "510000.00", "balAllocate": "510000.00", "totalExp": "-", "status": "Tamat Tempoh"},
    { "approvalRef": "AXXXXX", "skbRef": "SKBXXX", "officer": "Setiausaha Kerajaan", "agency": "APM Negeri Johor ", "fundCategory": "Bukan Covid", "startDate": "25/10/2019", "endDate": "31/3/2020", "ceilingAllocate": "20000.00", "balAllocate": "15000.00", "totalExp": "5000", "status": "Lanjut"},
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
