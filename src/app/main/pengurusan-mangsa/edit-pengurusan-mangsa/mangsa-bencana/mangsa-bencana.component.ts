import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditMangsaBencanaComponent } from './tambah-edit-mangsa-bencana/tambah-edit-mangsa-bencana.component';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  MangsaBencanaServiceProxy,
  OutputCreateMangsaBencanaDto
} from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { ConfirmationService } from '@services/confirmation';

@Component({
	selector: 'app-mangsa-bencana',
	templateUrl: './mangsa-bencana.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class MangsaBencanaComponent implements OnInit {
  @Input() public idMangsa: number;
  @Input() public nama: string;
  @Input() public no_kp: string;
  @Input() public id_negeri: number;

  @ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

  filter: string;
  terms$ = new Subject<string>();
  output: OutputCreateMangsaBencanaDto = new OutputCreateMangsaBencanaDto();

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _mangsaBencanaServiceProxy: MangsaBencanaServiceProxy,
    public _appSession: AppSessionService,
    private _confirmationService: ConfirmationService
  ) {
		this.primengTableHelper = new PrimengTableHelper();
	}

	ngOnInit(): void {
    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getDisaster();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getDisaster(event?: LazyLoadEvent) {
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

	addVictimDisasterModal() {
		const modalRef = this.modalService.open(TambahEditMangsaBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.id_negeri = this.id_negeri;

		modalRef.result.then((response) => {
			if (response) {
				this.getDisaster();
			}
		});
	}

	editVictimDisasterModal(id) {
		const modalRef = this.modalService.open(TambahEditMangsaBencanaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
    modalRef.componentInstance.id_negeri = this.id_negeri;

		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getDisaster();
			}
		});
	}

  deleteBencana(id?){
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam maklumat bencana ini?',
      icon: {
        show: true,
        name: 'help-circle',
        color: 'warning'
      },
      actions: {
        confirm: {
          show: true,
          label: 'Ya',
          color: 'primary'
        },
        cancel: {
          show: true,
          label: 'Tidak'
        }
      },
      dismissible: true
    });
    dialogRef.afterClosed().subscribe((e) => {
      if(e === 'confirmed') {
        this._mangsaBencanaServiceProxy.delete(id).subscribe((response)=>{
            this. confirmMessage();
        })
      }
    });
  }

  confirmMessage(){
		const dialogRef = this._confirmationService.open({
		  title: 'Berjaya',
		  message: 'Maklumat Bencana Dipilih Berjaya Dipadam',
		  icon: {
        show: true,
        name: 'check-circle',
        color: 'success'
      },
      actions: {
        confirm: {
          show: true,
          label: 'Tutup',
          color: 'primary'
        },
        cancel: {
          show: false
        }
      },
      dismissible: true
    });
		dialogRef.afterClosed().subscribe(() => {
			this.getDisaster();
		});
	}
}
