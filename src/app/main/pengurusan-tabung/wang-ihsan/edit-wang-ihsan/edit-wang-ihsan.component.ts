import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import {
  CreateOrEditTabungBwiDto,
  GetRujukanKelulusanBwiDto,
  GetTabungBwiForEditDto,
  InputBwiKirDto,
  InputCreateTabungBwiDto,
  TabungBwiServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import * as moment from 'moment';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { NgForm } from '@angular/forms';
@Component({
	selector: 'app-edit-wang-ihsan',
	templateUrl: './edit-wang-ihsan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal, NgbActiveModal]
})
export class EditWangIhsanComponent implements OnInit {
	@ViewChild('dataTable', { static: true }) dataTable: Table;
	@ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('f') public f: NgForm;

	primengTableHelper: PrimengTableHelper;

  edit: GetTabungBwiForEditDto = new GetTabungBwiForEditDto();
  tabungBwi: InputCreateTabungBwiDto = new InputCreateTabungBwiDto();
  bwi: CreateOrEditTabungBwiDto = new CreateOrEditTabungBwiDto();
  bwiKir: InputBwiKirDto[] = [];
  kelulusan: GetRujukanKelulusanBwiDto = new GetRujukanKelulusanBwiDto();

  active;
  nama_pembayaran:string;
  idBwi: any;
  filter: string;
  no_rujukan_kelulusan: string;
  nama_jenis_bencana: string;
  rujukan_surat: string;
  nama_tabung: string;
  perihal_surat: string;
  rows = [];
  bwiType: any;
  bayaran: number = 0;

  saving = false;
  tarikhBencana: string;
  tarikhKejadian: string;

  date = new Date();
  modelBencana: NgbDateStruct;
  modelKejadian: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

  bwiCategory = [
    { id: 1, nama_jenis_bwi: "Bencana" },
    { id: 2, nama_jenis_bwi: "Pengurusan Kematian" },
    { id: 3, nama_jenis_bwi: "Lain-lain" }
  ]

	constructor(
    private router: Router,
    config: NgbModalConfig,
    private calendar: NgbCalendar,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _tabungBwiServiceProxy: TabungBwiServiceProxy
  ) {
    this.idBwi = this._activatedRoute.snapshot.queryParams['id'];
		this.primengTableHelper = new PrimengTableHelper();
    this.edit.tabung_bwi = new CreateOrEditTabungBwiDto();
    this.edit.rujukan_kelulusan_bwi = new GetRujukanKelulusanBwiDto();
    this.edit.nama_tabung = this.nama_tabung;
    this.edit.nama_jenis_bencana = this.nama_jenis_bencana;
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.show();
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

  show() {
    this._tabungBwiServiceProxy.getTabungBwiForEdit(this.idBwi).subscribe((result)=>{
      this.edit = result;
      this.edit.tabung_bwi = result.tabung_bwi;
      this.no_rujukan_kelulusan = result.rujukan_kelulusan_bwi.no_rujukan_kelulusan;
      this.nama_tabung = result.nama_tabung;
      this.nama_jenis_bencana = result.nama_jenis_bencana;
      this.rujukan_surat = result.rujukan_kelulusan_bwi.rujukan_surat;
      this.perihal_surat = result.rujukan_kelulusan_bwi.perihal_surat;
      if(result.tabung_bwi.tarikh_eft){
        this.modelBencana = this.fromModel(result.tabung_bwi.tarikh_eft.format('YYYY-MM-DD'));
      }
      if(result.tabung_bwi.tarikh_akuan_kp){
        this.modelKejadian = this.fromModel(result.tabung_bwi.tarikh_akuan_kp.format('YYYY-MM-DD'));
      }
    })
  }

	reloadPage(): void {
		this.paginator.changePage(this.paginator.getPage());
	}

  validate(changeEvent: NgbNavChangeEvent){
    if(this.f.invalid){
      for (var i in this.f.controls) {
        this.f.controls[i].markAllAsTouched();
        this.f.controls[i].markAsTouched();
      }
      changeEvent.preventDefault();
    }
  }

	save() {
    this.saving = true;
    this.tabungBwi.bwi = this.edit.tabung_bwi;
    if(this.modelBencana){
      this.tarikhBencana = this.toModel(this.modelBencana);
      this.tabungBwi.bwi.tarikh_eft = moment(this.tarikhBencana, "YYYY-MM-DD");
    }
    if(this.modelKejadian){
      this.tarikhKejadian = this.toModel(this.modelKejadian);
      this.tabungBwi.bwi.tarikh_akuan_kp = moment(this.tarikhKejadian, "YYYY-MM-DD");
    }
    this._tabungBwiServiceProxy
			.createOrEdit(this.tabungBwi)
			.pipe()
			.subscribe((result) => {
				swalSuccess.fire('Berjaya!', 'Maklumat Bantuan Wang Ihsan Berjaya Disimpan.', 'success').then(() => {
          this.router.navigateByUrl('/app/tabung/senarai-wang-ihsan');
				});
			});
	}
}
