import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
	selector: 'app-tetapan',
	templateUrl: './tetapan.component.html'
})
export class TetapanComponent implements OnInit {

	constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if(this.router.url === '/app/tetapan'){
          this.router.navigateByUrl('/app/tetapan/(menu:kementerian)');
        }
      }
    });
  }

	ngOnInit() {}
}
