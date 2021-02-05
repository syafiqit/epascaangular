import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-add-victim',
  templateUrl: './add-victim.component.html',
})
export class AddVictimComponent implements OnInit {

  options$: Observable<number[]>;
  constructor() {
    this.options$=of([1,2,3,4,5,6]);
  }

  ngOnInit(): void {
  }

}
