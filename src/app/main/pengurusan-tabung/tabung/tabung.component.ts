import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { TambahEditTabungComponent } from './tambah-edit-tabung/tambah-edit-tabung.component';
import { NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { ConfirmationService } from '@app/shared/services/confirmation';

@Component({
	selector: 'app-tabung',
	templateUrl: './tabung.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TabungComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;

	primengTableHelper: PrimengTableHelper;
  filterText: string;
  filterYear: string;
  filterMonth: string;
  filterString: string;
  arrayYear:any[];
  terms$ = new Subject<string>();
  readonly DELIMITER = '-';

  public isCollapsed = false;
  jumlah_keseluruhan: number;
  jumlah_perbelanjaan_semasa: number;
  jumlah_tanggungan: number;
  kategori_tabung: any;

  kategoriTabung=[
    {id: 2, nama_kategori: "Kumpulan Wang Covid"},
    {id: 1, nama_kategori: "Lain- lain"}
  ]

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private tabungServiceProxy: TabungServiceProxy,
    public _appSession: AppSessionService,
    private _confirmationService: ConfirmationService
    ) {
		this.primengTableHelper = new PrimengTableHelper();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.generateArrayOfYears();
    this.getTotalCard();


    this.terms$.pipe(
      debounceTime(500), distinctUntilChanged()
    ).subscribe((filterValue: string) =>{
      this.filterText = filterValue;
      this.getTabung();
    });
  }

  applyFilter(filterValue: string){
    this.terms$.next(filterValue);
  }

  getTotalCard(){
    this.tabungServiceProxy.getTotalTabungCard(this.filterMonth).subscribe((result) => {
      this.jumlah_keseluruhan = result.jumlah_keseluruhan;
      this.jumlah_perbelanjaan_semasa = result.jumlah_perbelanjaan_semasa;
      this.jumlah_tanggungan = result.jumlah_tanggungan;
    });
  }

	getTabung(event?: LazyLoadEvent) {
		this.primengTableHelper.showLoadingIndicator();
		this.tabungServiceProxy
			.getAll(
				this.filterText,
        this.filterYear ?? undefined,
				this.primengTableHelper.getSorting(this.dataTable),
				this.primengTableHelper.getSkipCount(this.paginator, event),
				this.primengTableHelper.getMaxResultCount(this.paginator, event)
			)
      .pipe(
				finalize(() => {
					this.primengTableHelper.hideLoadingIndicator();
				})
			)
			.subscribe((result) => {
				this.primengTableHelper.totalRecordsCount = result.total_count;
				this.primengTableHelper.records = result.items;
			});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  generateArrayOfYears() {
    let max = new Date().getFullYear();
    let min = max - 9;
    let years = [];

    for (let i = max; i >= min; i--) {
      years.push(i)
    }
    this.arrayYear = years;
  }

  getKategoriTabung(id){
    this.kategori_tabung = this.kategoriTabung.find((data) => data.id == id);
    return this.kategori_tabung.name;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  resetFilter() {
    this.filterText = undefined;
    this.filterYear = undefined;
    this.filterString = undefined;
    this.applyFilter(this.filterString);
    this.getTabung();
  }

	addFundModal() {
		const modalRef = this.modalService.open(TambahEditTabungComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.result.then((response) => {
			if (response) {
				this.getTabung();
        this.getTotalCard();
			}
		});
	}

  padamTabung(id?) {
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam maklumat Tabung ini?',
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
    });dialogRef.afterClosed().subscribe((e) => {
      if(e === 'confirmed') {
				this.tabungServiceProxy.delete(id).subscribe((result)=>{
          if(result.message == "Tabung Berjaya Dibuang"){
            const dialogRef = this._confirmationService.open({
              title: 'Berjaya',
              message: "Maklumat Tabung Berjaya Dipadam",
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
              this.getTabung();
            });
          }else{
            this._confirmationService.open({
              title: 'Tidak Berjaya',
              message: result.message,
              icon: {
                show: true,
                name: 'x-circle',
                color: 'error'
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
          }
        })
      }
    });
  }
}
