import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {AddVictimDisasterComponent} from './add-victim-disaster.component';
declare var require;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-victim-disaster',
  templateUrl: './victim-disaster.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class VictimDisasterComponent implements OnInit {

  rows = [
    { "year": "2020", "type": "Covid-19", "status": "Tidak Berpindah", "centre": "-"},
    { "year": "2020", "type": "Covid-19", "status": "Tidak Berpindah", "centre": "-"},
    { "year": "2020", "type": "Covid-19", "status": "Tidak Berpindah", "centre": "-"},
  ];

  categories = [
    { "data": "barangan kebersihan", },
    { "data": "barangan perubatan", },
  ];

  items = [
    { "data": "Makanan Tin",},
    { "data": "Makanan Kering",},
  ];

  ColumnMode = ColumnMode;
  SortType = SortType;

  delete() {
    Swal.fire(
      'Berjaya!',
      'Barangan Berjaya Di Buang.',
      'success'
    )
  };

  addVictimDisasterModal() {
    this.modalService.open(AddVictimDisasterComponent, { size: 'lg' });
  }

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

}
