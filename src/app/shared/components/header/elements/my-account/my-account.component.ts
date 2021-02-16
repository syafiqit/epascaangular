import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChangePasswordComponent } from '../../../../../main/account/change-password/change-password.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-my-account',
	templateUrl: './my-account.component.html',
	styleUrls: ['./my-account.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class MyAccountComponent implements OnInit {
	public openMessageBox = false;

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		// customize default values of modals used by this component tree
		config.backdrop = 'static';
		config.keyboard = false;
	}
	ngOnInit() {}

	openChangePasswordModal() {
		this.modalService.open(ChangePasswordComponent);
	}

	toggleMessageBox() {
		this.openMessageBox = !this.openMessageBox;
	}
}
