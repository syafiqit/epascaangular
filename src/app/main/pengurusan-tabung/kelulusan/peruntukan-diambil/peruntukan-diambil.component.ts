import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-peruntukan-diambil',
  templateUrl: './peruntukan-diambil.component.html'
})
export class PeruntukanDiambilComponent implements OnInit {

  constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal
    ) { 
      config.backdrop = 'static';
		  config.keyboard = false;
    }

  ngOnInit(): void {
  }

}
