import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-edit-jenis-bwi',
	templateUrl: './tambah-edit-jenis-bwi.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditJenisBwiComponent implements OnInit {
	@Input() name;

	constructor(
		private modalService: NgbModal,
		public activeModal: NgbActiveModal
	) {}

	ngOnInit(): void { }
}
