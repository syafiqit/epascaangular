import { Component, OnInit } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
declare var require;
const Swal = require('sweetalert2');

@Component({
  selector: 'app-victim-list',
  templateUrl: './victim-list.component.html',
})
export class VictimListComponent implements OnInit {

  public isCollapsed = false;

  rows = [
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
    { "kp": "999999-11-2222", "nameKir": "Asmah Binti Haji Ameran", "waterBill": "1", "total": "500", "state": "Sarawak", "source": "JPAM", "verification": "Sudah"},
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

  constructor() {
  }

  ngOnInit(): void {
  }

}
