import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { finalize } from 'rxjs/operators';
import { AuthServiceProxy, InputLoginDto, OutputLoginDto, RefPengumumanServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { AuthUtils } from '@app/shared/helpers/auth.utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaparPengumumanComponent } from '../papar-pengumuman/papar-pengumuman.component';
import { ConfirmationService } from '@app/shared/services/confirmation';
@Component({
	selector: 'app-log-masuk',
	templateUrl: './log-masuk.component.html'
})
export class LogMasukComponent implements OnInit {

	public show = false;
  login: InputLoginDto = new InputLoginDto();
  output: OutputLoginDto = new OutputLoginDto();
  loading = false;
  saving = false;

	constructor(
		private modalService: NgbModal,
    private _cookieService: CookieService,
    private _authServiceProxy: AuthServiceProxy,
    private _confirmationService: ConfirmationService,
    private _refPengumumanServiceProxy: RefPengumumanServiceProxy
    ) {}

	ngOnInit(): void {
    this._refPengumumanServiceProxy.getAllPengumumanForView().subscribe((result) => {
      if(result.items.length > 0) {
        setTimeout(() => {
          this.announcementModal();
        }, 1500);
      }
    });
  }

	showPassword() {
		this.show = !this.show;
	}

	userlogin() {
    this.loading = true;
		this._authServiceProxy
			.login(this.login)
			.pipe(
				finalize(() => {
					this.loading = false;
				})
			)
			.subscribe(
				(result) => {
          this.output = result;
          if(result.message){
            this._confirmationService.open({
              title: 'Tidak Berjaya',
              message: this.output.message,
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
          }else{
            const validity = AuthUtils.getTokenExpirationDate(result.access_token);
            this._cookieService.set('token', result.access_token, validity, '/');
            this.redirect(result.tukar_kata_laluan);
          }
				});
	}

  redirect(changePassword: boolean){
    changePassword == true ? location.href = '/akaun/tukar' : location.href = '/' ;
  }

	announcementModal() {
		this.modalService.open(PaparPengumumanComponent, { centered: true });
	}

}
