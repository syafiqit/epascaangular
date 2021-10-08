import { OnInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbCalendar, NgbDateStruct, NgbModal, NgbModalConfig, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { PrimengTableHelper } from 'src/app/shared/helpers/PrimengTableHelper';
import { ConfirmationService } from '@services/confirmation';
import {
  CreateOrEditTabungBwiDto,
  CreateOrEditTabungBwiKawasanDto,
  GetRujukanKelulusanBwiDto,
  GetTabungBwiForEditDto,
  InputCreateBwiTabungBayaranDto,
  InputCreateBwiTabungKawasanDto,
  InputCreateTabungBwiDto,
  RefJenisBwiServiceProxy,
  TabungBwiBayaranServiceProxy,
  TabungBwiKawasanServiceProxy,
  TabungBwiServiceProxy,
  UpdateBwiBayaranDto
} from 'src/app/shared/proxy/service-proxies';
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
  kelulusan: GetRujukanKelulusanBwiDto = new GetRujukanKelulusanBwiDto();
  bwi_bayaran: UpdateBwiBayaranDto[] = [];
  bantuanKawasan: CreateOrEditTabungBwiKawasanDto[] = [];
  bayaran: InputCreateBwiTabungBayaranDto = new InputCreateBwiTabungBayaranDto();
  kawasan: InputCreateBwiTabungKawasanDto = new InputCreateBwiTabungKawasanDto();

  items = [];
  active;
  nama_pembayaran:string;
  idBwi: any;
  filter: string;
  filterJenisBwi: string;
  no_rujukan_kelulusan: string;
  nama_jenis_bencana: string;
  rujukan_surat: string;
  nama_tabung: string;
  perihal_surat: string;
  rows = [];
  bwiType: any;
  jenisBwi: any;
  id_bencana: any;
  bencana: any;
  nama_bencana: string;
  tarikh_bencana: any;
  idJenisBwi: number;
  id_daerah: number;
  id_negeri: number;
  jumlah_diberi: number;
  id_kelulusan_bwi_bayaran: number;
  daerahArray = [];
  negeriArray = [];
  jumlahArray = [];

  saving = false;
  tarikhBencana: string;
  tarikhKejadian: string;

  date = new Date();
  modelBencana: NgbDateStruct;
  modelKejadian: NgbDateStruct;
  today = this.calendar.getToday();
  readonly DELIMITER = '-';

	constructor(
    private router: Router,
    config: NgbModalConfig,
    private calendar: NgbCalendar,
    public activeModal: NgbActiveModal,
    private _activatedRoute: ActivatedRoute,
    private _confirmationService: ConfirmationService,
    private _tabungBwiServiceProxy: TabungBwiServiceProxy,
    private _refJenisBwiServiceProxy: RefJenisBwiServiceProxy,
    private _tabungBwiBayaranServiceProxy: TabungBwiBayaranServiceProxy,
    private _tabungBwiKawasanServiceProxy: TabungBwiKawasanServiceProxy
  ) {
    this.idBwi = this._activatedRoute.snapshot.queryParams['id'];
    this.id_bencana = this._activatedRoute.snapshot.queryParams['idBencana'];
		this.primengTableHelper = new PrimengTableHelper();
    this.edit.tabung_bwi = new CreateOrEditTabungBwiDto();
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
    this.getTabungBwi();
    this.getJenisBwi();
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

  getTabungBwi() {
    this._tabungBwiServiceProxy.getTabungBwiForEdit(this.idBwi).subscribe((result)=>{
      this.edit = result;
      this.edit.tabung_bwi = result.tabung_bwi;
      this.tarikh_bencana = this.edit.tabung_bwi.tarikh_bencana.format('YYYY-MM-DD');
      this.idJenisBwi = this.edit.tabung_bwi.id_jenis_bwi;
    })
  }

  getJenisBwi(){
    this._refJenisBwiServiceProxy.getRefJenisBwiForDropdown(this.filterJenisBwi).subscribe((result) => {
			this.jenisBwi = result.items;
		});
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

  getIdBayaranTerus(id_bayaran_terus: number) {
    const bayaranBwi = new UpdateBwiBayaranDto();
    bayaranBwi.id_tabung_bayaran_terus = id_bayaran_terus;
    this.bwi_bayaran.push(bayaranBwi);
  }

  getIdBayaranSkb(id_bayaran_skb: number) {
    const bayaranBwi = new UpdateBwiBayaranDto();
    bayaranBwi.id_tabung_bayaran_skb = id_bayaran_skb;
    this.bwi_bayaran.push(bayaranBwi);
  }

  getIdKelulusan(id_kelulusan: number) {
    this.id_kelulusan_bwi_bayaran = id_kelulusan;
  }

  getIdDaerah(id_daerah: number) {
    this.daerahArray.push(id_daerah);
  }

  getIdNegeri(id_negeri: number) {
    this.negeriArray.push(id_negeri);
  }

  getJumlahDiberi(jumlah_diberi: number) {
    this.jumlahArray.push(jumlah_diberi);
  }

	save() {
    this.saving = true;

    this.tabungBwi.bwi = this.edit.tabung_bwi;
    this.bayaran.bwi_bayaran = this.bwi_bayaran;
    this.bayaran.id_kelulusan = this.id_kelulusan_bwi_bayaran;
    this.bayaran.id_tabung_bwi = this.idBwi;
    this.kawasan.id_tabung_bwi = this.idBwi;

    for(let i=0; i < this.daerahArray.length; i++){
      const bantuanKawasanBwi = new CreateOrEditTabungBwiKawasanDto();
      bantuanKawasanBwi.id_daerah = this.daerahArray[i];
      bantuanKawasanBwi.id_negeri = this.negeriArray[i];
      bantuanKawasanBwi.jumlah_bwi = this.jumlahArray[i];
      this.bantuanKawasan.push(bantuanKawasanBwi);
    }
    this.kawasan.bwi_kawasan = this.bantuanKawasan;

    if(this.bayaran.bwi_bayaran.length > 0){
      this._tabungBwiBayaranServiceProxy
			.createOrEdit(this.bayaran).pipe().subscribe();
    }

    if(this.kawasan.bwi_kawasan.length > 0){
      this._tabungBwiKawasanServiceProxy
			.addBwiKawasan(this.kawasan).pipe().subscribe();
    }

    this._tabungBwiServiceProxy
			.createOrEdit(this.tabungBwi)
			.pipe()
			.subscribe((result) => {
        const dialogRef = this._confirmationService.open({
          title: 'Berjaya',
          message: 'Maklumat Bantuan Wang Ihsan Berjaya Dikemaskini.',
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
          this.router.navigateByUrl('/app/tabung/senarai-wang-ihsan');
        });
			});
	}
}
