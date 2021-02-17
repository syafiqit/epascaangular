import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-log-masuk',
	templateUrl: './log-masuk.component.html'
})
export class LogMasukComponent implements OnInit {
	public show = false;

	constructor() {}

	ngOnInit(): void {}

	showPassword() {
		this.show = !this.show;
	}
}
