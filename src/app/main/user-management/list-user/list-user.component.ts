import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddUserComponent } from '../add-user/add-user.component';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';

@Component({
	selector: 'app-list-user',
	templateUrl: './list-user.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class ListUserComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
	public isCollapsed = false;

	rows = [
		{
			userID: '860410xxxxx9',
			userName: 'Khairul Azwin B Mohd Nor',
			agency: 'Jabatan Kebajikan Masyarakat',
			userRole: 'Pengguna Biasa',
			lastLog: '',
			totalLog: '0'
		},
		{
			userID: '800103xxxxx5',
			userName: 'Mohamad Noor B Yusoh',
			agency: 'Jabatan Kebajikan Masyarakat',
			userRole: 'Pengguna Biasa',
			lastLog: '',
			totalLog: '0'
		},
		{
			userID: '850414xxxxx7',
			userName: 'Mohd Naufal B Yusoff',
			agency: 'Jabatan Kebajikan Masyarakat',
			userRole: 'Pengguna Biasa',
			lastLog: '',
			totalLog: '0'
		},
		{
			userID: '850122xxxxx3',
			userName: 'Abdul Hadi B Baharom',
			agency: 'Jabatan Pertahanan Awam Malaysia',
			userRole: 'Pengguna Biasa',
			lastLog: '23-02-2016  12:08:12 PM',
			totalLog: '10'
		},
		{
			userID: '770120xxxxx7',
			userName: 'Adila Sabri B Muhammad',
			agency: 'Agensi Pengurusan Bencana Malaysia',
			userRole: 'Penyelia',
			lastLog: '23-01-2021  10:11:39 PM',
			totalLog: '235'
		},
		{
			userID: '790930xxxxx7',
			userName: 'Mohamad Faizal B Mohamad',
			agency: 'Agensi Pengurusan Bencana Malaysia',
			userRole: 'Admin',
			lastLog: '16-04-2018  09:16:34 AM',
			totalLog: '207'
		}
	];

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	getUser(event?: LazyLoadEvent) {
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

	addUserModal() {
		this.modalService.open(AddUserComponent, { size: 'lg' });
	}
}
