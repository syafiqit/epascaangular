import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-house-aid',
  templateUrl: './house-aid.component.html'
})
export class HouseAidComponent implements OnInit {

  options$: Observable<number[]>;
  constructor() {
    this.options$=of([1,2,3,4,5,6]);
  }

  ngOnInit(): void {
  }

}
