import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-edit-kadar',
	templateUrl: './tambah-edit-kadar.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class TambahEditKadarComponent implements OnInit {
	@Input() name;

	constructor(
		public activeModal: NgbActiveModal
	) {}

	ngOnInit(): void { }
}
