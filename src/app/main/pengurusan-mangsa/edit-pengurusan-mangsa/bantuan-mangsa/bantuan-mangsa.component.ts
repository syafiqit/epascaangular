import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { GetMangsaForEditDto, MangsaServiceProxy } from 'src/app/shared/proxy/service-proxies';

@Component({
	selector: 'app-bantuan-mangsa',
	templateUrl: './bantuan-mangsa.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class BantuanMangsaComponent implements OnInit {
  @Input() public idMangsa: number;

  getMangsa: GetMangsaForEditDto = new GetMangsaForEditDto();

	active = 1;
  id = undefined;

	constructor(
    private _activatedRoute: ActivatedRoute,
    private _mangsaServiceProxy: MangsaServiceProxy,
    public _appSession: AppSessionService
  ) {
    this._activatedRoute.queryParams.subscribe((p) => {
			this.id = p['id'];
		});
	}

	ngOnInit(): void {
    this.show();
  }

	show(): void {
		this._mangsaServiceProxy.getMangsaForEdit(this.idMangsa).subscribe((result) => {
			this.getMangsa = result;
		});
	}

}
