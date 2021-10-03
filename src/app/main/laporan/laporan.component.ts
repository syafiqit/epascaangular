import { OnInit, Component } from '@angular/core';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
	selector: 'app-laporan',
	templateUrl: './laporan.component.html'
})
export class LaporanComponent implements OnInit {

	constructor(
    public _appSession: AppSessionService
   ) { }

	ngOnInit(): void { }
}
