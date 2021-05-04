import { Component, OnInit } from '@angular/core';
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

	constructor(private _authService: AuthServiceProxy) {
	}

	ngOnInit() {}

  save(){
    this.loading = true;
      if (this.input.kata_laluan_baru === this.input.ulang_kata_laluan_baru) {
      this._authService.changePassword(this.input).pipe(finalize(()=>{
        this.loading = false;
      })).subscribe(e=>{
        location.href = 'akaun/log-masuk';
      });
    }else {
			Swal.fire('', 'Kata Laluan Dan Ulang Kata Laluan Tidak Sama ', 'error');
      this.loading = false;
		}
  }

  showPassword() {
		this.show = !this.show;
	}

	showNewPassword() {
		this.showNew = !this.showNew;
	}
}

