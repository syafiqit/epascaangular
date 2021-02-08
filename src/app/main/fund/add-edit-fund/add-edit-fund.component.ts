import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-fund',
  templateUrl: './add-edit-fund.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class AddEditFundComponent implements OnInit {

  modelFooter: NgbDateStruct;
  today = this.calendar.getToday();

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private calendar: NgbCalendar) {}

  ngOnInit(): void {
  }

}
