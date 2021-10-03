import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppSessionService } from '@app/shared/services/app-session.service';

@Component({
	selector: 'app-edit-pengurusan-mangsa',
	templateUrl: './edit-pengurusan-mangsa.component.html'
})
export class EditPengurusanMangsaComponent implements OnInit {
	tabId = 1;
  id = undefined;

	constructor(
    private _activatedRoute: ActivatedRoute,
    public _appSession: AppSessionService
  ) {
    this._activatedRoute.queryParams.subscribe((p) => {
			this.id = p['id'];
		});
  }

	ngOnInit(): void {}
}
