import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppSessionService } from '@app/shared/services/app-session.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-bantuan-mangsa',
	templateUrl: './bantuan-mangsa.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class BantuanMangsaComponent implements OnInit {
  @Input() public idMangsa: number;
  @Input() public nama: string;
  @Input() public no_kp: string;

  active = 1;
  id = undefined;

	constructor(
    private _activatedRoute: ActivatedRoute,
    public _appSession: AppSessionService
  ) {
    this._activatedRoute.queryParams.subscribe((p) => {
			this.id = p['id'];
		});
	}

	ngOnInit(): void {}

}
