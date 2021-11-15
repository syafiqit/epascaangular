/* eslint-disable @typescript-eslint/naming-convention */
import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from '@services/confirmation';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahPeruntukanComponent } from '../edit-tabung/tambah-peruntukan/tambah-peruntukan.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateOrEditTabungDto, GetTabungByYearDto, GetTabungForEditDto, RefSumberPeruntukanServiceProxy, TabungKelulusanServiceProxy, TabungPeruntukanServiceProxy, TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { PeruntukanDiambilComponent } from '../../kelulusan/peruntukan-diambil/peruntukan-diambil.component';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
	selector: 'app-edit-tabung',
	templateUrl: './edit-tabung.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class EditTabungComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;
	active = 1;

	primengTableHelper: PrimengTableHelper;
  primengTableHelperSejarah: PrimengTableHelper;
  primengTableHelperKelulusan: PrimengTableHelper;
  public isCollapsed = false;

  getTabung: GetTabungForEditDto = new GetTabungForEditDto();
  getTabungYear: GetTabungByYearDto = new GetTabungByYearDto();
  editTabung: CreateOrEditTabungDto = new CreateOrEditTabungDto();

  idTabung: any;
  tarikhBaki: string;
  tarikh_cipta: string;
  filterText: string;
  filterTabung: number;
  filterJenisBencana: number;
  filterFromDate: string;
  filterToDate: string;
  filterYear: string = new Date().getFullYear().toString();;
  statuses: any;
  sumberPeruntukan: any;
  tarikhTerimaanSehingga: Date;
  kategori_tabung: any;
  nama_kategori_tabung: string;
  tabungTambahKelulusan: number = 1;
  tabungKemaskiniKelulusan: number = 1;
  arrayYear:any[];
  currentYear: string = new Date().getFullYear().toString();

  date = new Date();
  modelBaki: NgbDateStruct;
  modelAkhir: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  kategoriTabung=[
    {id: 2, nama_kategori: "Kumpulan Wang Covid"},
    {id: 1, nama_kategori: "Lain- lain"}
  ]

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _activatedRoute: ActivatedRoute,
    private tabungServiceProxy: TabungServiceProxy,
    private tabungPeruntukanServiceProxy: TabungPeruntukanServiceProxy,
    private tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private _refSumberPeruntukanServiceProxy: RefSumberPeruntukanServiceProxy,
    private calendar: NgbCalendar,
    private router: Router,
    private _confirmationService: ConfirmationService,
    public _appSession: AppSessionService,
    ) {
		this.primengTableHelper = new PrimengTableHelper();
    this.primengTableHelperSejarah = new PrimengTableHelper();
    this.primengTableHelperKelulusan = new PrimengTableHelper();
    this.getTabung.tabung = new CreateOrEditTabungDto();
    this._activatedRoute.queryParams.subscribe((p) => {
      this.idTabung = p['id'];
    });
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.tarikhTerimaanSehingga = new Date(new Date().getFullYear() -1, 12, 0);
    this.generateArrayOfYears();
    this.getSumberPeruntukan();
    this.show();
    this.getTabungByYear(this.currentYear);
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        year : parseInt(date[0], 10),
        month : parseInt(date[1], 10),
        day : parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  show(){
    this.tabungServiceProxy.getTabungForEdit(this.idTabung).subscribe((result)=>{
      this.getTabung = result;
      if(result.tabung.tarikh_baki){
        this.modelBaki = this.fromModel(result.tabung.tarikh_baki.format('YYYY-MM-DD'));
      }
      if(result.tabung.tarikh_cipta){
        this.modelAkhir = this.fromModel(result.tabung.tarikh_cipta.format('YYYY-MM-DD'));
      }

      this.kategori_tabung =  this.kategoriTabung.find(x => x.id === this.getTabung.tabung.kategori_tabung);
      this.nama_kategori_tabung = this.kategori_tabung.nama_kategori;

    });
  }

	getTabungPeruntukan(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelper.showLoadingIndicator();

    this.tabungPeruntukanServiceProxy.getPeruntukanByIdTabung(
      this.idTabung,
      this.filterText,
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

  getTabungByYear(year){
    this.currentYear = year;
    if(!year){
      this.currentYear = new Date().getFullYear().toString();
    }
    this.tabungServiceProxy.getTabungByYear(this.idTabung, year ?? this.currentYear).subscribe((result)=>{
      this.getTabungYear = result;
    })
  }

  getSumberPeruntukan(filter?) {
		this._refSumberPeruntukanServiceProxy.getRefSumberPeruntukanForDropdown(filter).subscribe((result) => {
			this.sumberPeruntukan = result.items;
		});
	}

	getSejarahKemaskini(event?: LazyLoadEvent) {
    if (this.primengTableHelperSejarah.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelperSejarah.showLoadingIndicator();

    this.tabungServiceProxy.getSejarahTransaksi(
      this.filterText,
      this.idTabung,
      this.primengTableHelperSejarah.getSorting(this.dataTable),
      this.primengTableHelperSejarah.getSkipCount(this.paginator, event),
      this.primengTableHelperSejarah.getMaxResultCount(this.paginator, event)
    )
    .pipe(finalize(()=>{
      this.primengTableHelperSejarah.hideLoadingIndicator();
    }))
    .subscribe((result) => {
      this.primengTableHelperSejarah.totalRecordsCount = result.total_count;
      this.primengTableHelperSejarah.records = result.items;
    });
	}

  getKelulusan(event?: LazyLoadEvent) {
    if (this.primengTableHelperKelulusan.shouldResetPaging(event)) {
      this.paginator.changePage(0);
      return;
    }
    this.primengTableHelperKelulusan.showLoadingIndicator();

    this.tabungKelulusanServiceProxy.getAll(
      this.filterText,
      this.idTabung,
      this.filterJenisBencana,
      this.filterFromDate ?? undefined,
      this.filterToDate ?? undefined,
      this.primengTableHelperKelulusan.getSorting(this.dataTable),
      this.primengTableHelperKelulusan.getSkipCount(this.paginator, event),
      this.primengTableHelperKelulusan.getMaxResultCount(this.paginator, event)
    )
    .pipe(finalize(()=>{
      this.primengTableHelperKelulusan.hideLoadingIndicator();
    }))
    .subscribe((result) => {
      this.primengTableHelperKelulusan.totalRecordsCount = result.total_count;
      this.primengTableHelperKelulusan.records = result.items;
    });
  }

	addTabungPeruntukan(idTabung) {
		const modalRef = this.modalService.open(TambahPeruntukanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.id = idTabung;
    modalRef.result.then((response) => {
			if (response) {
        this.show();
				this.getTabungPeruntukan();
			}
		});
	}

  editTabungPeruntukan(id) {
		const modalRef = this.modalService.open(TambahPeruntukanComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'edit';
    modalRef.componentInstance.id = this.idTabung;
    modalRef.componentInstance.idTabungPeruntukan = id;
    modalRef.result.then((response) => {
			if (response) {
        this.show();
				this.getTabungPeruntukan();
			}
		});
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

  deleteTabungPeruntukan(id){
    const dialogRef = this._confirmationService.open({
      title: 'Anda Pasti?',
      message: 'Adakah anda pasti ingin memadam maklumat terimaan tambahan ini?',
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
				this.tabungPeruntukanServiceProxy.delete(id).subscribe((result) => {
          if(result.message === 'Tambahan Dana Berjaya Dibuang'){
            const s = this._confirmationService.open({
              title: 'Berjaya',
              message: "Tambahan Dana Berjaya Dipadam",
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
            s.afterClosed().subscribe(() => {
              this.show();
              this.getTabungPeruntukan();
            });
          } else{
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
        });
      }
    });
  }

  peruntukanDiambilModal(id_kelulusan, baki_jumlah_siling?) {
		const modalRef = this.modalService.open(PeruntukanDiambilComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'tabungKelulusan';
    modalRef.componentInstance.id_tabung_kelulusan = id_kelulusan;
    modalRef.componentInstance.id_tabung = this.idTabung;
    modalRef.componentInstance.baki_jumlah_siling = baki_jumlah_siling;

    modalRef.result.then((response) => {
			if (response) {
				this.getKelulusan();
			}
		});
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  save() {
    this.editTabung = this.getTabung.tabung;
    if(this.modelBaki){
      this.tarikhBaki = this.toModel(this.modelBaki);
      this.editTabung.tarikh_baki = moment(this.tarikhBaki, 'YYYY-MM-DD');
    }
    if(this.modelAkhir){
      this.tarikh_cipta = this.toModel(this.modelAkhir);
      this.editTabung.tarikh_cipta = moment(this.tarikh_cipta, 'YYYY-MM-DD');
    }
    this.tabungServiceProxy.createOrEdit(this.editTabung).subscribe(()=>{
      const dialogRef = this._confirmationService.open({
        title: 'Berjaya',
        message: 'Maklumat Tabung Berjaya Dikemaskini',
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
        this.router.navigateByUrl('/app/tabung/senarai');
      });
    });
  }
}
