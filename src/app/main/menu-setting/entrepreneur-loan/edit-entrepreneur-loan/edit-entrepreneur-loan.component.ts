import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-entrepreneur-loan',
  templateUrl: './edit-entrepreneur-loan.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class EditEntrepreneurLoanComponent implements OnInit {

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
