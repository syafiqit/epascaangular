import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-bwi',
  templateUrl: './add-bwi.component.html',
})
export class AddBwiComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  state = [
    { "state": "Johor", },
    { "state": "Kedah", },
    { "state": "Kelantan", },
    { "state": "Melaka", },
    { "state": "Negeri Sembilan", },
    { "state": "Pahang", },
    { "state": "Perak", },
    { "state": "Perlis", },
    { "state": "Pulau Pinang", },
    { "state": "Sabah", },
    { "state": "Sarawak", },
    { "state": "Selangor", },
    { "state": "Terengganu", },
    { "state": "Wilayah Persekutuan K.L", },
  ];

}