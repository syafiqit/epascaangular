import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthChangePasswordDto, AuthServiceProxy } from 'src/app/shared/proxy/service-proxies';
declare let require;
const Swal = require('sweetalert2');

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
    private _authService: AuthServiceProxy,
    private _router: Router
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
        Swal.fire('', 'Kata Laluan Berjaya Ditukar', 'success').then(()=>{
          this._router.navigateByUrl('akaun/log-masuk');
        })
      });
    }else {
			Swal.fire('', 'Kata Laluan Baru Dan Ulang Kata Laluan Tidak Sepadan ', 'error');
      this.loading = false;
		}
  }
}

