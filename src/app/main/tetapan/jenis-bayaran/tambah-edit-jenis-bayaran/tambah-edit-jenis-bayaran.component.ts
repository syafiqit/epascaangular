import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tambah-edit-jenis-bayaran',
  templateUrl: './tambah-edit-jenis-bayaran.component.html'
})
export class TambahEditJenisBayaranComponent implements OnInit {
  @Input() name;
	@Input() id;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
