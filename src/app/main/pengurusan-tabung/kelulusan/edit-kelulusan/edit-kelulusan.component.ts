import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-edit-kelulusan',
	templateUrl: './edit-kelulusan.component.html'
})

export class EditKelulusanComponent implements OnInit {
	tabId = 1;
  id = undefined;
  idTabung: number;
  tabungKemaskiniKelulusan: number;

	constructor(
    private _activatedRoute: ActivatedRoute
  ) {
    this._activatedRoute.queryParams.subscribe((p) => {
			this.id = p['id'];
      this.idTabung = p['idTabung'];
      this.tabungKemaskiniKelulusan = p['tabungKemaskiniKelulusan'];
		});
  }

	ngOnInit(): void {}
}
