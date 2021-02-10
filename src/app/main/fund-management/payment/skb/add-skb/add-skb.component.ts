import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-add-skb',
  templateUrl: './add-skb.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddSkbComponent implements OnInit {

  rows = [
    {"month":"Januari", "total":""},{"month":"Februari", "total":""},{"month":"Mac", "total":""},
    {"month":"April", "total":""},{"month":"Mei", "total":""},{"month":"Jun", "total":""},
    {"month":"Julai", "total":""},{"month":"Ogos", "total":""},{"month":"September", "total":""},
    {"month":"Oktober", "total":""},{"month":"November", "total":""},{"month":"Disember", "total":""},
    {"month":"Jumlah Belanja", "total":""}
]

ColumnMode = ColumnMode;
SortType = SortType;

displayMonths = 1;
navigation = 'select';
showWeekNumbers = false;
outsideDays = 'visible';

constructor() { }

ngOnInit(): void {
}

}
