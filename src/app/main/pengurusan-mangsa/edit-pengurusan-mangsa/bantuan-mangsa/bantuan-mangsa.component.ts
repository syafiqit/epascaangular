import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { BantuanWangIhsanComponent } from './bantuan-wang-ihsan/bantuan-wang-ihsan.component';
import { BantuanPinjamanKhasComponent } from './bantuan-pinjaman-khas/bantuan-pinjaman-khas.component';
import { BantuanPertanianComponent } from './bantuan-pertanian/bantuan-pertanian.component';
import { BantuanAntarabangsaComponent } from './bantuan-antarabangsa/bantuan-antarabangsa.component';
import { BantuanLainComponent } from './bantuan-lain/bantuan-lain.component';
import { BantuanRumahComponent } from './bantuan-rumah/bantuan-rumah.component';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-bantuan-mangsa',
	templateUrl: './bantuan-mangsa.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class BantuanMangsaComponent implements OnInit {
  @Input() public idMangsa: number;

	@ViewChild('ihsanDataTable', { static: true }) ihsanDataTable: Table;
	@ViewChild('ihsanPaginator', { static: true }) ihsanPaginator: Paginator;

	ihsanPrimengTableHelper: PrimengTableHelper;

	@ViewChild('houseDataTable', { static: true }) houseDataTable: Table;
	@ViewChild('housePaginator', { static: true }) housePaginator: Paginator;

	housePrimengTableHelper: PrimengTableHelper;

	@ViewChild('specialDataTable', { static: true }) specialDataTable: Table;
	@ViewChild('specialPaginator', { static: true }) specialPaginator: Paginator;

	specialPrimengTableHelper: PrimengTableHelper;

	@ViewChild('agricultureDataTable', { static: true }) agricultureDataTable: Table;
	@ViewChild('agriculturePaginator', { static: true }) agriculturePaginator: Paginator;

	agriculturePrimengTableHelper: PrimengTableHelper;

	@ViewChild('internationalDataTable', { static: true }) internationalDataTable: Table;
	@ViewChild('internationalPaginator', { static: true }) internationalPaginator: Paginator;

	internationalPrimengTableHelper: PrimengTableHelper;

	@ViewChild('otherDataTable', { static: true }) otherDataTable: Table;
	@ViewChild('otherPaginator', { static: true }) otherPaginator: Paginator;

	otherPrimengTableHelper: PrimengTableHelper;
	active = 1;

	ihsanDonation = [{ disaster: 'Banjir', agency: 'Agency A', date: '12-12-2020', total: '500' }];

	houseAid = [
		{ disaster: 'Banjir', help: 'Bina Pulih Rumah', date: '12-12-2020', totalPredict: '500', totalReal: '500' }
	];

	specialLoan = [{ disaster: 'Banjir', agency: 'Agency A', date: '12-12-2020', total: '500' }];

	agricultureAid = [
		{ disaster: 'Banjir', agency: 'Agency A', agriculture: 'Sawit', date: '12-12-2020', total: '500' }
	];

	internationalAid = [{ disaster: 'Banjir', agency: 'United Kingdom', date: '12-12-2020', total: '500' }];

	otherAid = [{ disaster: 'Banjir', help: 'Bantuan Kaunseling', date: '12-12-2020', total: '500' }];

	items = [{ data: 'Makanan Tin' }, { data: 'Makanan Kering' }];

	ColumnMode = ColumnMode;
	SortType = SortType;

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.ihsanPrimengTableHelper = new PrimengTableHelper();
		this.housePrimengTableHelper = new PrimengTableHelper();
		this.specialPrimengTableHelper = new PrimengTableHelper();
		this.agriculturePrimengTableHelper = new PrimengTableHelper();
		this.internationalPrimengTableHelper = new PrimengTableHelper();
		this.otherPrimengTableHelper = new PrimengTableHelper();
	}

	delete() {
		Swal.fire('Berjaya!', 'Barangan Berjaya Di Buang.', 'success');
	}

	ihsanDonationModal() {
		this.modalService.open(BantuanWangIhsanComponent, { size: 'lg' });
	}

	specialLoanModal() {
		this.modalService.open(BantuanPinjamanKhasComponent, { size: 'lg' });
	}

	houseAidModal() {
		this.modalService.open(BantuanRumahComponent, { size: 'lg' });
	}

	agricultureAidModal() {
		this.modalService.open(BantuanPertanianComponent, { size: 'lg' });
	}

	internationalAidModal() {
		this.modalService.open(BantuanAntarabangsaComponent, { size: 'lg' });
	}

	otherAidModal() {
		this.modalService.open(BantuanLainComponent, { size: 'lg' });
	}

	getIhsan(event?: LazyLoadEvent) {
		if (this.ihsanPrimengTableHelper.shouldResetPaging(event)) {
			this.ihsanPaginator.changePage(0);
			return;
		}

		this.ihsanPrimengTableHelper.showLoadingIndicator();
		this.ihsanPrimengTableHelper.totalRecordsCount = this.ihsanDonation.length;
		this.ihsanPrimengTableHelper.records = this.ihsanDonation;
		this.ihsanPrimengTableHelper.hideLoadingIndicator();
	}

	getHouse(event?: LazyLoadEvent) {
		if (this.housePrimengTableHelper.shouldResetPaging(event)) {
			this.housePaginator.changePage(0);
			return;
		}

		this.housePrimengTableHelper.showLoadingIndicator();
		this.housePrimengTableHelper.totalRecordsCount = this.houseAid.length;
		this.housePrimengTableHelper.records = this.houseAid;
		this.housePrimengTableHelper.hideLoadingIndicator();
	}

	getSpecial(event?: LazyLoadEvent) {
		if (this.specialPrimengTableHelper.shouldResetPaging(event)) {
			this.specialPaginator.changePage(0);
			return;
		}

		this.specialPrimengTableHelper.showLoadingIndicator();
		this.specialPrimengTableHelper.totalRecordsCount = this.specialLoan.length;
		this.specialPrimengTableHelper.records = this.specialLoan;
		this.specialPrimengTableHelper.hideLoadingIndicator();
	}

	getAgriculture(event?: LazyLoadEvent) {
		if (this.agriculturePrimengTableHelper.shouldResetPaging(event)) {
			this.agriculturePaginator.changePage(0);
			return;
		}

		this.agriculturePrimengTableHelper.showLoadingIndicator();
		this.agriculturePrimengTableHelper.totalRecordsCount = this.agricultureAid.length;
		this.agriculturePrimengTableHelper.records = this.agricultureAid;
		this.agriculturePrimengTableHelper.hideLoadingIndicator();
	}

	getInternational(event?: LazyLoadEvent) {
		if (this.internationalPrimengTableHelper.shouldResetPaging(event)) {
			this.internationalPaginator.changePage(0);
			return;
		}

		this.internationalPrimengTableHelper.showLoadingIndicator();
		this.internationalPrimengTableHelper.totalRecordsCount = this.internationalAid.length;
		this.internationalPrimengTableHelper.records = this.internationalAid;
		this.internationalPrimengTableHelper.hideLoadingIndicator();
	}

	getOther(event?: LazyLoadEvent) {
		if (this.otherPrimengTableHelper.shouldResetPaging(event)) {
			this.otherPaginator.changePage(0);
			return;
		}

		this.otherPrimengTableHelper.showLoadingIndicator();
		this.otherPrimengTableHelper.totalRecordsCount = this.otherAid.length;
		this.otherPrimengTableHelper.records = this.otherAid;
		this.otherPrimengTableHelper.hideLoadingIndicator();
	}

	ngOnInit(): void {}
}
