import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahRujukanBencanaComponent } from './tambah-rujukan-bencana/tambah-rujukan-bencana.component';

@Component({
	selector: 'app-tambah-kelulusan',
	templateUrl: './tambah-kelulusan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahKelulusanComponent implements OnInit {
	displayMonths = 1;
	navigation = 'select';
	showWeekNumbers = false;
	outsideDays = 'visible';

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	approvalAddModal() {
		this.modalService.open(TambahRujukanBencanaComponent, { size: 'lg' });
	}
}
