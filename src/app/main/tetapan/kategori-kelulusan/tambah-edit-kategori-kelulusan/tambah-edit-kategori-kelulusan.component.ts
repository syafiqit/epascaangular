import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tambah-edit-kategori-kelulusan',
  templateUrl: './tambah-edit-kategori-kelulusan.component.html'
})
export class TambahEditKategoriKelulusanComponent implements OnInit {
  @Input() name;
	@Input() id;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

}
