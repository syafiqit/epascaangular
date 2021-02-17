import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-edit-pemilik-projek',
	templateUrl: './tambah-edit-pemilik-projek.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditPemilikProjekComponent implements OnInit {
	constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

	ngOnInit(): void {}
}
