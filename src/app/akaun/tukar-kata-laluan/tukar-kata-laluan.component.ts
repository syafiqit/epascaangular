import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-tukar-kata-laluan',
	templateUrl: './tukar-kata-laluan.component.html',
	styles: []
})
export class TukarKataLaluanComponent implements OnInit {
	public show = false;
	public showNew = false;

	constructor() {}

	ngOnInit() {}

	showPassword() {
		this.show = !this.show;
	}

	showNewPassword() {
		this.showNew = !this.showNew;
	}
}
