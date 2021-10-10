import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { LazyLoadEvent } from 'primeng/api';
import {
  MangsaServiceProxy,
  MangsaVerifikasiDto,
  RefAgensiServiceProxy,
  RefNegeriServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { EditMultipleBantuanWangIhsanComponent } from './edit-multiple-bantuan-wang-ihsan/edit-multiple-bantuan-wang-ihsan.component';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { CreateMultipleBencanaComponent } from './create-multiple-bencana/create-multiple-bencana.component';
import { ConfirmationService } from '@services/confirmation';

@Component({
	selector: 'app-pengurusan-mangsa',
	templateUrl: './pengurusan-mangsa.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class PengurusanMangsaComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;

	filter: string;
  filterNegeri: number;
  filterAgensi: number;
  terms$ = new Subject<string>();
  checked: boolean;
  idMangsa: any[];
  allMangsa: any[];

	public isCollapsed = false;
  states: any;
  agencies: any;
  mangsa: MangsaVerifikasiDto = new MangsaVerifikasiDto();

	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
    private _mangsaServiceProxy: MangsaServiceProxy,
    private _refAgensiServiceProxy: RefAgensiServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    public _appSession: AppSessionService,
    private _confirmationService: ConfirmationService
  ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getNegeri();
    this.getAgensi();
	this.idMangsa = [];

    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filter = filterValue;
      this.getVictim();
    });

  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

	getVictim(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

		this.primengTableHelper.showLoadingIndicator();
		this._mangsaServiceProxy
			.getAll(
				this.filter,
        this.filterNegeri ?? undefined,
        this.filterAgensi ?? undefined,
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

				this.allMangsa = result.items.map((data)=>{
					return data.id;
				});
			});
	}

  resetFilter() {
    this.filter = undefined;
    this.filterAgensi = undefined;
    this.filterNegeri = undefined;

    this.getVictim();
  }

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

  getAgensi(filter?) {
		this._refAgensiServiceProxy.getRefAgensiForDropdown(filter).subscribe((result) => {
			this.agencies = result.items;
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

	// checkedAll(isChecked: boolean) {
	// 	if (isChecked) {
	// 		this.checked = true;
	// 		this.idMangsa.push(this.allMangsa);
	// 		console.log(this.idMangsa);
	// 	}
	// 	else if (!isChecked) {
	// 		this.checked = false;
	// 		this.idMangsa = [];
	// 		console.log(this.idMangsa);
	// 	}
	// }

	pilihMangsa(id, isChecked: boolean) {
		if (isChecked) {
			this.idMangsa.push(id);
		} else if (!isChecked) {
			let index = this.idMangsa.indexOf(id);
			this.idMangsa.splice(index, 1);
		}
	}

	checkMangsaExist(id?){
		if(this.idMangsa.indexOf(id)  == -1){
			return false;
		}
		else{
			return true;
		};
	}

	editIhsanModal() {
		if(this.idMangsa.length == 0){
			const dialogRef = this._confirmationService.open({
			title: 'Harap Maaf!',
			message: 'Tiada Mangsa Dipilih.',
			icon: {
				show: true,
				name: 'alert-triangle',
				color: 'warning'
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
		}else{
			const modalRef = this.modalService.open(EditMultipleBantuanWangIhsanComponent, { size: 'lg' });
			modalRef.componentInstance.name = 'edit';
			modalRef.componentInstance.idMangsa = this.idMangsa;

			modalRef.result.then((response) => {
			if (response) {
				this.getVictim();
			}
		});
		}
	}

	editBencanaModal() {
		if(this.idMangsa.length == 0){
			const dialogRef = this._confirmationService.open({
			title: 'Harap Maaf!',
			message: 'Tiada Mangsa Dipilih.',
			icon: {
				show: true,
				name: 'alert-triangle',
				color: 'warning'
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
		}else{
			const modalRef = this.modalService.open(CreateMultipleBencanaComponent, { size: 'lg' });
			modalRef.componentInstance.name = 'edit';
			modalRef.componentInstance.idMangsa = this.idMangsa;

			modalRef.result.then((response) => {
			if (response) {
				this.getVictim();
			}
		});
		}
	}

	multipleVerification(){
		if(this.idMangsa.length == 0){
			const dialogRef = this._confirmationService.open({
				title: 'Harap Maaf!',
				message: 'Tiada Mangsa Dipilih.',
				icon: {
					show: true,
					name: 'alert-triangle',
					color: 'warning'
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
		}else{
			this.mangsa.id_mangsa = this.idMangsa;
			const dialogRef = this._confirmationService.open({
				title: 'Anda Pasti?',
				message: 'Adakah anda ingin mengesahkan status mangsa-mangsa ini?',
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
			this._mangsaServiceProxy.multipleVerifikasi(this.mangsa).subscribe((response)=>{
			  this.confirmMessage();
			})
		  }
		});
		}
	  }
	
	confirmMessage(){
		const dialogRef = this._confirmationService.open({
			title: 'Berjaya',
			message: 'Mangsa Telah Berjaya Diverifikasi',
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
				this.getVictim();
			});
	}
		
		
}
