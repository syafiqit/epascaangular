import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-edit-pengumuman',
	templateUrl: './tambah-edit-pengumuman.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditPengumumanComponent implements OnInit {
	@Input() name;

	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';

	constructor(
    public activeModal: NgbActiveModal
  ) {}

	ngOnInit(): void {}
}
