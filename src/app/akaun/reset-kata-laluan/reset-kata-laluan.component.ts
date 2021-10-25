import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceProxy, InputResetPasswordDto, OutputLoginDto } from 'src/app/shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reset-kata-laluan',
  templateUrl: './reset-kata-laluan.component.html',
  styles: []
})
export class ResetKataLaluanComponent implements OnInit {
  public show = false;
	public showNew = false;
	allowChangePassword = false;
	showMessage = false;
	userEmail: string;
	accessCode: string;
	error = '';
	loading = false;

  resetPassword: InputResetPasswordDto = new InputResetPasswordDto();
  passwordPattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
  output: OutputLoginDto = new OutputLoginDto();

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authServiceProxy: AuthServiceProxy,
    private _confirmationService: ConfirmationService
  ) {
    this._activatedRoute.queryParams.subscribe((p) => {
			this.userEmail = p['emel'];
			this.accessCode = p['kod_akses'];
			this.verifyCode(p['emel'], p['kod_akses']);
		});
   }

  ngOnInit(): void { }

  verifyCode(emel, kod_akses) {
		this._authServiceProxy.verifyCode(emel, kod_akses).subscribe(
			(e) => {
				this.allowChangePassword = true;
			},
			(err) => {
				this.showMessage = true;
				this.error = 'Kod Akses Anda Tidak Sah Dan Telah Tamat Tempoh. Sila Minta Kod Akses Yang Baru';
			}
		);
	}

  showPassword() {
		this.show = !this.show;
	}

	showNewPassword() {
		this.showNew = !this.showNew;
	}

  save() {
    this.loading = true;
		this.resetPassword.emel = this.userEmail;
		this.resetPassword.kod_akses = this.accessCode;

		if (this.resetPassword.kata_laluan === this.resetPassword.ulang_kata_laluan) {
			this._authServiceProxy
      .resetPassword(this.resetPassword)
      .pipe(finalize(()=>{ this.loading = false; }))
      .subscribe((result) => {
        this.output = result;
        if(this.output.message == "Kata laluan telah ditetapkan semula. Sila log masuk dengan kata laluan baru anda.") {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Kata Laluan Telah Ditetapkan Semula. Sila Log Masuk Dengan Kata Laluan Baru Anda.',
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
            this._router.navigateByUrl('akaun/log-masuk');
          });
        }else{
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
        }
			});
		} else {
      const dialogRef = this._confirmationService.open({
        title: 'Tidak Berjaya',
        message: 'Kata Laluan Dan Ulang Kata Laluan Tidak Sama',
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
      dialogRef.afterClosed().subscribe(() => {
        this.loading = false;
      });
		}
	}
}
