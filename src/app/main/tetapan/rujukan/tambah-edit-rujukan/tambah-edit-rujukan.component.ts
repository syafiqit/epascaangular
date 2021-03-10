import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tambah-edit-rujukan',
  templateUrl: './tambah-edit-rujukan.component.html',
  encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditRujukanComponent implements OnInit {
	@Input() name;

	modelFooter: NgbDateStruct;
	today = this.calendar.getToday();

	constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private calendar: NgbCalendar) {}

	ngOnInit(): void {}
}
