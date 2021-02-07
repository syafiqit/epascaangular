import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-damage',
  templateUrl: './add-damage.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class AddDamageComponent implements OnInit {

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
