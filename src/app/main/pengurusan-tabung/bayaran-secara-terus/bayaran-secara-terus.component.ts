import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-bayaran-secara-terus',
	templateUrl: './bayaran-secara-terus.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class BayaranSecaraTerusComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{
			paymentRefNo: 'BYRXXX',
			date: '25/02/2020',
			voucherNo: '120224',
			approvalRefNo: '19',
			procurementType: 'Secara Darurat',
			to: 'K.L AIRPORT HOTEL SDN BHD',
			category: 'COVID'
		},
		{
			paymentRefNo: 'BYRXXX',
			date: '03/03/2020',
			voucherNo: '120250',
			approvalRefNo: '19',
			procurementType: 'Secara Pembelian Terus',
			to: 'PERMAI TRADING',
			category: 'COVID'
		},
		{
			paymentRefNo: 'BYRXXX',
			date: '20/03/2020',
			voucherNo: '120361',
			approvalRefNo: '21',
			procurementType: 'Secara DaruraPembelian Terus',
			to: 'BENDAHARI NEGERI SEMBILAN',
			category: 'COVID'
		}
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	getDirectPay(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this.primengTableHelper.totalRecordsCount = this.rows.length;
		this.primengTableHelper.records = this.rows;
		this.primengTableHelper.hideLoadingIndicator();
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}
}
