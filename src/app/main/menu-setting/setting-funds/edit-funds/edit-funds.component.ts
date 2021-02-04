import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-funds',
  templateUrl: './edit-funds.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class EditFundsComponent implements OnInit {

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
