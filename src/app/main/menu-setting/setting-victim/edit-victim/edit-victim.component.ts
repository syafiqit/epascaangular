import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-victim',
  templateUrl: './edit-victim.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class EditVictimComponent implements OnInit {

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
