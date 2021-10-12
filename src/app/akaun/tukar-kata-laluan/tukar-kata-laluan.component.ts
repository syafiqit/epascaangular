import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthChangePasswordDto, AuthServiceProxy } from 'src/app/shared/proxy/service-proxies';
import { ConfirmationService } from '@app/shared/services/confirmation';
@Component({
	selector: 'app-tukar-kata-laluan',
	templateUrl: './tukar-kata-laluan.component.html',
	styles: []
})
export class TukarKataLaluanComponent implements OnInit {
	loading = false;
  show = false;
  showNew = false;
  input: AuthChangePasswordDto = new AuthChangePasswordDto();
  passwordPattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"

	constructor(
    private _router: Router,
    private _authService: AuthServiceProxy,
    private _confirmationService: ConfirmationService
  ) { }

	ngOnInit() {}

  showPassword() {
		this.show = !this.show;
	}

	showNewPassword() {
		this.showNew = !this.showNew;
	}

  save(){
    this.loading = true;
      if (this.input.kata_laluan_baru === this.input.ulang_kata_laluan_baru) {
      this._authService.changePassword(this.input)
      .pipe(finalize(()=>{ this.loading = false; }))
      .subscribe(() => {
        const dialogRef = this._confirmationService.open({
          title: 'Berjaya',
          message: 'Kata Laluan Berjaya Ditukar.',
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
      });
    }else {
      const dialogRef = this._confirmationService.open({
        title: 'Tidak Berjaya',
        message: 'Kata Laluan Baru Dan Ulang Kata Laluan Tidak Sepadan.',
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

