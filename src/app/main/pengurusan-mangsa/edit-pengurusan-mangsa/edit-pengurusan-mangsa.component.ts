import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetMangsaForEditDto, MangsaServiceProxy } from '@app/shared/proxy/service-proxies';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
	selector: 'app-edit-pengurusan-mangsa',
	templateUrl: './edit-pengurusan-mangsa.component.html',
  styleUrls: ['./edit-pengurusan-mangsa.component.scss']
})
export class EditPengurusanMangsaComponent implements OnInit {
  getMangsa: GetMangsaForEditDto = new GetMangsaForEditDto();
	tabId = 1;
  id = undefined;
  nama: string;
  no_kp: string;
  id_negeri: number;

	constructor(
    private _activatedRoute: ActivatedRoute,
    public _appSession: AppSessionService,
    private _mangsaServiceProxy: MangsaServiceProxy
  ) {
    this._activatedRoute.queryParams.subscribe((p) => {
			this.id = p['id'];
		});
  }

	ngOnInit(): void {
    this.show();
  }

	show(): void {
		this._mangsaServiceProxy.getMangsaForEdit(this.id).subscribe((result) => {
			this.getMangsa = result;
      this.nama = result.mangsa.nama;
      this.no_kp = result.mangsa.no_kp;
      this.id_negeri = result.mangsa.id_negeri;
		});
	}
}
