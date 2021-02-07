import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-project-owner',
  templateUrl: './edit-project-owner.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class EditProjectOwnerComponent implements OnInit {

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
