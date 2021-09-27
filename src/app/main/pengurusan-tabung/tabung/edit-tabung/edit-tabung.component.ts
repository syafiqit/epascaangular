import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { TambahPeruntukanComponent } from '../edit-tabung/tambah-peruntukan/tambah-peruntukan.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateOrEditTabungDto, GetTabungForEditDto, RefSumberPeruntukanServiceProxy, TabungKelulusanServiceProxy, TabungPeruntukanServiceProxy, TabungServiceProxy } from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { PeruntukanDiambilComponent } from '../../kelulusan/peruntukan-diambil/peruntukan-diambil.component';

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

  getTabung: GetTabungForEditDto = new GetTabungForEditDto();
  editTabung: CreateOrEditTabungDto = new CreateOrEditTabungDto();

  idTabung: any;
  tarikhBaki: string;
  tarikh_cipta: string;
  filterText: string;
  filterTabung: number;
  filterJenisBencana: number;
  statuses: any;
  sumberPeruntukan: any;
  tarikhTerimaanSehingga: Date;

	ColumnMode = ColumnMode;
	SortType = SortType;

  date = new Date();
  modelBaki: NgbDateStruct;
  modelAkhir: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  sejarah = [
		{
      bil: '1', tarikh_cipta: '01/01/2021', no_rujukan: 'A09219', aktiviti: 'Kelulusan', jumlah: 'RM 100000.00', dikemaskini_oleh: 'Mohd Rahimi'
		},
    {
      bil: '2', tarikh_cipta: '01/01/2021', no_rujukan: 'B09281', aktiviti: 'SKB', jumlah: 'RM 100000.00', dikemaskini_oleh: 'Mohd Rahimi'
		},
    {
      bil: '3', tarikh_cipta: '01/01/2021', no_rujukan: 'C09237', aktiviti: 'Terus', jumlah: 'RM 100000.00', dikemaskini_oleh: 'Mohd Rahimi'
		}
	];

	constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private _activatedRoute: ActivatedRoute,
    private tabungServiceProxy: TabungServiceProxy,
    private tabungPeruntukanServiceProxy: TabungPeruntukanServiceProxy,
    private tabungKelulusanServiceProxy: TabungKelulusanServiceProxy,
    private _refSumberPeruntukanServiceProxy: RefSumberPeruntukanServiceProxy,
    private calendar: NgbCalendar,
    private router: Router
    ) {
		this.primengTableHelper = new PrimengTableHelper();
    this.primengTableHelperSejarah = new PrimengTableHelper();
    this.primengTableHelperKelulusan = new PrimengTableHelper();
    this.getTabung.tabung = new CreateOrEditTabungDto;
    this._activatedRoute.queryParams.subscribe((p) => {
      this.idTabung = p['id'];
    });
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.tarikhTerimaanSehingga = new Date(new Date().getFullYear() -1, 12, 0);
    this.getSumberPeruntukan();
    this.show()
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
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
    })
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

  getSumberPeruntukan(filter?) {
		this._refSumberPeruntukanServiceProxy.getRefSumberPeruntukanForDropdown(filter).subscribe((result) => {
			this.sumberPeruntukan = result.items;
		});
	}

  getStatus(id){
    this.statuses = this.sumberPeruntukan.map((data) => {
      return data.nama_sumber_peruntukan;
    });
    return this.statuses[id - 1];
  }

	getSejarahKemaskini(event?: LazyLoadEvent) {
		if (this.primengTableHelperSejarah.shouldResetPaging(event)) {
			this.paginator.changePage(0);
			return;
		}

    this.primengTableHelperSejarah.showLoadingIndicator();
		this.primengTableHelperSejarah.totalRecordsCount = this.sejarah.length;
		this.primengTableHelperSejarah.records = this.sejarah;
		this.primengTableHelperSejarah.hideLoadingIndicator();
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
				this.getTabungPeruntukan();
			}
		});
	}

  peruntukanDiambilModal(baki_jumlah_siling?) {
		const modalRef = this.modalService.open(PeruntukanDiambilComponent, { size: 'lg' });
		modalRef.componentInstance.name = 'add';
    modalRef.componentInstance.baki_jumlah_siling = baki_jumlah_siling;
	}

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  save() {
    this.editTabung = this.getTabung.tabung;
    if(this.modelBaki){
      this.tarikhBaki = this.toModel(this.modelBaki);
      this.editTabung.tarikh_baki = moment(this.tarikhBaki, "YYYY-MM-DD");
    }
    if(this.modelAkhir){
      this.tarikh_cipta = this.toModel(this.modelAkhir);
      this.editTabung.tarikh_cipta = moment(this.tarikh_cipta, "YYYY-MM-DD");
    }
    this.tabungServiceProxy.createOrEdit(this.editTabung).subscribe(()=>{
      swalSuccess.fire('Berjaya', 'Maklumat Tabung Berjaya Dikemaskini').then(() => {
        this.router.navigateByUrl('/app/tabung/senarai');
      });
    })
  }
}
