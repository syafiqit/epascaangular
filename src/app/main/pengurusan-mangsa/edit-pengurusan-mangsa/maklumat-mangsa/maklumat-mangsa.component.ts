import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  CreateOrEditMangsaDto,
  GetMangsaForEditDto,
  InputCreateMangsaDto,
  MangsaServiceProxy,
  RefBencanaServiceProxy,
  RefDaerahServiceProxy,
  RefDunServiceProxy,
  RefNegeriServiceProxy,
  RefParlimenServiceProxy,
  RefPindahServiceProxy
} from 'src/app/shared/proxy/service-proxies';
import { environment } from 'src/environments/environment';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
@Component({
	selector: 'app-maklumat-mangsa',
	templateUrl: './maklumat-mangsa.component.html',
  styleUrls: ['./maklumat-mangsa.component.scss']
})

export class MaklumatMangsaComponent implements OnInit {

  getMangsa: GetMangsaForEditDto = new GetMangsaForEditDto();
  editMangsa: InputCreateMangsaDto = new InputCreateMangsaDto();
  idMangsa: number;

  secondFormGroup: FormGroup;
	files: File[] = [];
	hasImage: number;
  url: string;
	serverUrl = environment.apiUrl + '/api/mangsa/uploadGambarProfilMangsa';

  dun: any;
  parliaments: any;
  districts: any;
  states: any;
  disasters: any;
  evacuates: any;
  setDun: any;
  setDaerah: any;
  filterIdNegeri: number;
  showDun = false;

	constructor(
    private _activatedRoute: ActivatedRoute,
    private _mangsaServiceProxy: MangsaServiceProxy,
    private _refDunServiceProxy: RefDunServiceProxy,
    private _refParlimenServiceProxy: RefParlimenServiceProxy,
    private _refDaerahServiceProxy: RefDaerahServiceProxy,
    private _refNegeriServiceProxy: RefNegeriServiceProxy,
    private _refBencanaServiceProxy: RefBencanaServiceProxy,
    private _refPindahServiceProxy: RefPindahServiceProxy,
    private _formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {
    this.idMangsa = this._activatedRoute.snapshot.queryParams['id'];
    this.getMangsa = new GetMangsaForEditDto();
    this.getMangsa.mangsa = new CreateOrEditMangsaDto();
    this.editMangsa = new InputCreateMangsaDto();
    this.editMangsa.mangsa = new CreateOrEditMangsaDto();
  }

	ngOnInit(): void {
    this.show();
    this.getParlimen();
    this.getNegeri();
    this.getBencana();
    this.getStatusPindah();
		this.secondFormGroup = this._formBuilder.group({
			profile: ['']
		});
  }

	show(): void {
		this._mangsaServiceProxy.getMangsaForEdit(this.idMangsa).subscribe((result) => {
			this.getMangsa = result;
      if (result.mangsa.id_dun != null) {
        this.getDun(result.mangsa.id_dun);
        this.showDun = true;
      }
      this.getDaerah(result.mangsa.id_daerah);
		});
	}

	onSelect(event) {
		this.files.push(...event.addedFiles);

		const image = this.files[0];
		this.secondFormGroup.get('profile').setValue(image);
		this.hasImage = 1;
	}

  getDun(idDun, filter?, filterNegeri?) {
		this._refDunServiceProxy.getRefDunForDropdown(filter, filterNegeri).subscribe((result) => {
			this.dun = result.items;
      if(idDun) {
        this.setDun = this.dun.find((data)=>{
          return data.id == idDun;
        })
        return this.setDun.nama_dun;
      }
		});
	}

  getParlimen(filter?) {
		this._refParlimenServiceProxy.getRefParlimenForDropdown(filter).subscribe((result) => {
			this.parliaments = result.items;
		});
	}

  getDaerah(idDaerah, filter?) {
		this._refDaerahServiceProxy.getRefDaerahForDropdown(filter, this.filterIdNegeri).subscribe((result) => {
			this.districts = result.items;
      this.setDaerah = this.districts.find((data)=>{
        return data.id == idDaerah;
      })
      return this.setDaerah.nama_daerah;
		});
	}

  getNegeri(filter?) {
		this._refNegeriServiceProxy.getRefNegeriForDropdown(filter).subscribe((result) => {
			this.states = result.items;
		});
	}

  getBencana(filter?) {
		this._refBencanaServiceProxy.getRefBencanaForDropdown(filter).subscribe((result) => {
			this.disasters = result.items;
		});
	}

  getStatusPindah(filter?) {
		this._refPindahServiceProxy.getRefPindahForDropdown(filter).subscribe((result) => {
			this.evacuates = result.items;
		});
	}

	setParlimen() {
		this.getMangsa.mangsa.id_dun = this.setDun.id;
		this.getMangsa.mangsa.id_parlimen = this.setDun.id_parlimen;
	}

	setNegeri() {
		this.getMangsa.mangsa.id_daerah = this.setDaerah.id;
		this.getMangsa.mangsa.id_negeri = this.setDaerah.id_negeri;
    this.getDun(undefined, undefined, this.getMangsa.mangsa.id_negeri);
	}

  uploadImage() {
    const formData = new FormData();
		if (this.files.length > 0) {
			formData.append('image', this.secondFormGroup.get('profile').value);

			this.httpClient.post<any>(this.serverUrl, formData).subscribe(
				(res) => {
          this.url = res.url;
          this.save();
        });
		}
    else {
      this.save();
    }
  }

	save() {
    this.getMangsa.mangsa.gambar = this.url;
    this.editMangsa.mangsa = this.getMangsa.mangsa;
		this._mangsaServiceProxy.createOrEdit(this.editMangsa).subscribe((result) => {
			swalSuccess.fire('Berjaya!', 'Maklumat Mangsa Berjaya Dikemaskini.', 'success').then(() => {
				location.reload();
			});
		});
	}
}
