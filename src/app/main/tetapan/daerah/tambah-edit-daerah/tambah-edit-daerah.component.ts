import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-tambah-edit-daerah',
	templateUrl: './tambah-edit-daerah.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditDaerahComponent implements OnInit {
	constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

	ngOnInit(): void {}
}
