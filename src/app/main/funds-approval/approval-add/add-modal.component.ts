import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class AddModalComponent implements OnInit {

    rows = [
        {"refNo":"BEN1XXXX", "year":"2020", "date":"20/1/2020", "disaster":"Banjir"},
        {"refNo":"BEN2XXXX", "year":"2020", "date":"1/4/2020", "disaster":"Covid-19"},
        {"refNo":"BEN2XXXX", "year":"2019", "date":"24/3/2019", "disaster":"Ribut"},
    ]

    ColumnMode = ColumnMode;
    SortType = SortType;

    constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

    ngOnInit(): void {
    }

}
