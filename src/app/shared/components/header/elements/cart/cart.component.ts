import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
	public openCart = false;

	constructor() {}

	ngOnInit() {}

	// For Mobile Device
	toggleCart() {
		this.openCart = !this.openCart;
	}
}
