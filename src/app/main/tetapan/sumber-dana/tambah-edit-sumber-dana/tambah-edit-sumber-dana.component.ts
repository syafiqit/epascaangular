import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-edit-sumber-dana',
	templateUrl: './tambah-edit-sumber-dana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditSumberDanaComponent implements OnInit {
	@Input() name;

	constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

	ngOnInit(): void {}
}
