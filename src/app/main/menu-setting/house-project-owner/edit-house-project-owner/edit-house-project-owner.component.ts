import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-house-project-owner',
  templateUrl: './edit-house-project-owner.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class EditHouseProjectOwnerComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private toaster: ToastrService
    ) {}

  ngOnInit(): void {
  }

  status = [
    { "status": "Aktif", },
    { "status": "Tidak Aktif", },
  ];

}
