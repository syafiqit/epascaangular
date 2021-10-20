import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { finalize } from 'rxjs/operators';
import { AuthServiceProxy, InputLoginDto, OutputLoginDto } from 'src/app/shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { AuthUtils } from '@app/shared/helpers/auth.utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaparPengumumanComponent } from '../papar-pengumuman/papar-pengumuman.component';

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
    private _authServiceProxy: AuthServiceProxy
    ) {}

	ngOnInit(): void {
    setTimeout(() => {
      this.announcementModal();
    }, 3500);
    // this.announcementModal();
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
            swalSuccess.fire('Tidak Berjaya!', this.output.message, 'error');
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
