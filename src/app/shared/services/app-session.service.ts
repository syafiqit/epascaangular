import { Injectable } from '@angular/core';
import { GetProfilDto, PenggunaProfilDto, SessionServiceProxy } from '../proxy/service-proxies';

@Injectable()
export class AppSessionService {
  private _profile: GetProfilDto;

	constructor(
      private _sessionService: SessionServiceProxy
    ) {}

  get permissions(): string[] {
    return this._profile.capaian;
  }

	get role(): string {
		return this._profile.peranan;
	}

  get pengguna(): PenggunaProfilDto {
    return this._profile.pengguna;
  }

  isGranted(permissionName: string): boolean {
    const val = this._profile.capaian.find(e => e === permissionName);


    return !val ? false : true;
  }

	init(): Promise<GetProfilDto> {
		return new Promise<GetProfilDto>((resolve, reject) => {
      this._sessionService.getProfil().toPromise().then((result: GetProfilDto)=>{
        this._profile = result;
        resolve(result);
      }, (err) => {
        reject(err);
      });
		});
	}
}
