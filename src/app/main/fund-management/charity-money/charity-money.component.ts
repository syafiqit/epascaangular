import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
@Component({
	selector: 'app-charity-money',
	templateUrl: './charity-money.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class CharityMoneyComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	rows = [
		{
			state: 'PENANG',
			district: 'SPT',
			disasterType: 'Banjir',
			statusRef: 'Tidak Lengkap',
			year: '2020',
			wkir: '500',
			kirTotal: '76',
			totalRM: '38000.00',
			eftDate: '21/2/2020',
			balReturn: '2000.00'
		},
		{
			state: 'PAHANG',
			district: 'KUANTAN',
			disasterType: 'Ribut',
			statusRef: 'Tidak Lengkap',
			year: '2020',
			wkir: '500',
			kirTotal: '50',
			totalRM: '18000.00',
			eftDate: '23/2/2020',
			balReturn: '-'
		},
		{
			state: 'PAHANG',
			district: '25/02/KUANTAN',
			disasterType: 'Ribut',
			statusRef: 'Tidak Lengkap',
			year: '2020',
			wkir: '200',
			kirTotal: '10',
			totalRM: '10000.00',
			eftDate: '23/2/2020',
			balReturn: '-'
		},
		{
			state: 'PAHANG',
			district: '25/KUANTAN/2020',
			disasterType: 'Ribut',
			statusRef: 'Lengkap',
			year: '2019',
			wkir: '200',
			kirTotal: '10',
			totalRM: '10000.00',
			eftDate: '23/2/2020',
			balReturn: '-'
		}
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	getCharityMoney(event?: LazyLoadEvent) {
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
