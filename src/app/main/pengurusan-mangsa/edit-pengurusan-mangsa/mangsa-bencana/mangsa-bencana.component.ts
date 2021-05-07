import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditMangsaBencanaComponent } from './tambah-edit-mangsa-bencana/tambah-edit-mangsa-bencana.component';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { MangsaBencanaServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
declare let require;
const Swal = require('sweetalert2');

@Component({
	selector: 'app-mangsa-bencana',
	templateUrl: './mangsa-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class MangsaBencanaComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  idMangsa: string;
  filter: string;

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _activatedRoute: ActivatedRoute,
    private _mangsaBencanaServiceProxy: MangsaBencanaServiceProxy
  ) {
		this.primengTableHelper = new PrimengTableHelper();
    this.idMangsa = this._activatedRoute.snapshot.queryParams['id'];
	}

	ngOnInit(): void {}

	getDisaster(event?: LazyLoadEvent) {
		if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._mangsaBencanaServiceProxy
			.getAllByIdMangsa(
        this.idMangsa,
				this.filter,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
      .pipe(finalize(()=>{
				this.primengTableHelper.hideLoadingIndicator();
      }))
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
			});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	delete() {
		Swal.fire('Berjaya!', 'Barangan Berjaya Di Buang.', 'success');
	}

	addVictimDisasterModal() {
		const modalRef = this.modalService.open(TambahEditMangsaBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getDisaster();
			}
		});
	}

	editVictimDisasterModal(id) {
		const modalRef = this.modalService.open(TambahEditMangsaBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getDisaster();
			}
		});
	}
}
