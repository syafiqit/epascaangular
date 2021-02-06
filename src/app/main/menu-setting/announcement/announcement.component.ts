import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { AddAnnouncementComponent } from '../announcement/add-announcement/add-announcement.component';
import { EditAnnouncementComponent } from '../announcement/edit-announcement/edit-announcement.component';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class AnnouncementComponent implements OnInit {

  rows = [
    { "announcement": "Perhatian: Sila pastikan kata kunci anda tidak diketahui oleh orang lain.","name":"Wahadi Bin Mohamed","date":"02-06-2019"},
    { "announcement": "Perhatian: Sila kemaskini maklumat bantuan sebelum tarikh akhir pemberian","name":"Ismail Bin Yaakob","date":"23-08-2019"},
  ];

  ColumnMode = ColumnMode;
  SortType = SortType;
  page = 4;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  addAnnouncementModal() {
    this.modalService.open(AddAnnouncementComponent, { size: 'lg' });
  }

  editAnnouncementModal() {
    this.modalService.open(EditAnnouncementComponent, { size: 'lg' });
  }

  ngOnInit(): void {
  }

}
