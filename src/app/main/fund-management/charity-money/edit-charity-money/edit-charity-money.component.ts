import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-charity-money',
  templateUrl: './edit-charity-money.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class EditCharityMoneyComponent implements OnInit {

  modelFooter: NgbDateStruct;
  today = this.calendar.getToday();

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private calendar: NgbCalendar) {}

  ngOnInit(): void {
  }

  state = [
    { "state": "Johor", },
    { "state": "Kedah", },
    { "state": "Kelantan", },
    { "state": "Melaka", },
    { "state": "Negeri Sembilan", },
    { "state": "Pahang", },
    { "state": "Perak", },
    { "state": "Perlis", },
    { "state": "Pulau Pinang", },
    { "state": "Sabah", },
    { "state": "Sarawak", },
    { "state": "Selangor", },
    { "state": "Terengganu", },
    { "state": "Wilayah Persekutuan K.L", },
  ];

}
