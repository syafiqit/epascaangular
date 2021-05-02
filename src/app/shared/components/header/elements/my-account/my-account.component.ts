import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { GetProfilDto, PenggunaProfilDto, SessionServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { AppAuthService } from 'src/app/shared/services/app-auth-service';
import { AppSessionService } from 'src/app/shared/services/app-session.service';
import { TukarKataLaluanComponent } from '../../../../../main/maklumat-akaun/tukar-kata-laluan/tukar-kata-laluan.component';

@Component({
	selector: 'app-my-account',
	templateUrl: './my-account.component.html',
	styleUrls: ['./my-account.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class MyAccountComponent implements OnInit {
	public openMessageBox = false;

  getProfil: GetProfilDto = new GetProfilDto();

	name = '';
	emel = '';

	constructor(
		config: NgbModalConfig,
		private modalService: NgbModal,
		private _appAuthService: AppAuthService,
		private _appSessionService: AppSessionService,
    private _sessionServiceProxy: SessionServiceProxy
	) {
		// customize default values of modals used by this component tree
		config.backdrop = 'static';
		config.keyboard = false;
    this.getProfil = new GetProfilDto();
    this.getProfil.pengguna = new PenggunaProfilDto();
	}

	ngOnInit() {
		this.getSessionDetails();
    this.show();
	}

	show(): void {
		this._sessionServiceProxy.getProfil().subscribe((result) => {
			this.getProfil = result;
		});
	}

	getSessionDetails() {
		this.name = this._appSessionService.role;
		this.emel = this._appSessionService.role;
	}

	openChangePasswordModal() {
		this.modalService.open(TukarKataLaluanComponent);
	}

	toggleMessageBox() {
		this.openMessageBox = !this.openMessageBox;
	}

	logout() {
		this._appAuthService.logout();
	}
}
