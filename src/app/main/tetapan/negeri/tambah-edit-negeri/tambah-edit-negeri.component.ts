import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-edit-negeri',
	templateUrl: './tambah-edit-negeri.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditNegeriComponent implements OnInit {
	constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

	ngOnInit(): void {}
}
