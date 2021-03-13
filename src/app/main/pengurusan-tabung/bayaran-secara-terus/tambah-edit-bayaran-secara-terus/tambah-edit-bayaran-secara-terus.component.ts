import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahNoRujukanComponent } from '../../wang-ihsan/tambah-no-rujukan/tambah-no-rujukan.component';
@Component({
	selector: 'app-tambah-edit-bayaran-secara-terus',
	templateUrl: './tambah-edit-bayaran-secara-terus.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditBayaranSecaraTerusComponent implements OnInit {
	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		config.backdrop = 'static';
		config.keyboard = false;
	}
	ngOnInit(): void {}

	addNoReference() {
		const modalRef = this.modalService.open(TambahNoRujukanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
	}
}
