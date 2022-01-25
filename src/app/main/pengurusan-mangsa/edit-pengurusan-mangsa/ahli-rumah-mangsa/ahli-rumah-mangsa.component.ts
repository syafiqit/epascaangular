import { Component, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahEditAhliRumahMangsaComponent } from './tambah-edit-ahli-rumah-mangsa/tambah-edit-ahli-rumah-mangsa.component';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import {
  MangsaAirServiceProxy,
  OutputCreateMangsaAirDto
} from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { ConfirmationService } from '@services/confirmation';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-ahli-rumah-mangsa',
	templateUrl: './ahli-rumah-mangsa.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class AhliRumahMangsaComponent implements OnInit {
  @Input() public idMangsa: number;
  @Input() public nama: string;
  @Input() public no_kp: string;

	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	public isCollapsed = false;

  filter: string;
  mangsaId: any;
  victims: any;
  terms$ = new Subject<string>();
  output: OutputCreateMangsaAirDto = new OutputCreateMangsaAirDto();

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _mangsaAirServiceProxy: MangsaAirServiceProxy,
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
      this.getHousehold();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	getHousehold(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this._mangsaAirServiceProxy
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

	addAhliRumahModal() {
		const modalRef = this.modalService.open(TambahEditAhliRumahMangsaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
		modalRef.result.then((response) => {
			if (response) {
				this.getHousehold();
			}
		});
	}

	editAhliRumahModal(id) {
		const modalRef = this.modalService.open(TambahEditAhliRumahMangsaComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
		modalRef.componentInstance.id = id;
		modalRef.result.then((response) => {
			if (response) {
				this.getHousehold();
			}
		});
	}

  deleteAir(id?){
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam maklumat Ahli Isi Rumah ini?',
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
        this._mangsaAirServiceProxy.delete(id).subscribe((response)=>{
            this. confirmMessage();
        })
      }
    });
  }

  confirmMessage(){
		const dialogRef = this._confirmationService.open({
		  title: 'Berjaya',
		  message: 'Ahli Isi Rumah Dipilih Berjaya Dipadam!',
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
			this.getHousehold();
		});
	}
}
