import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RefPengumumanServiceProxy } from '@app/shared/proxy/service-proxies';
import { NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-papar-pengumuman',
	templateUrl: './papar-pengumuman.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig]
})
export class PaparPengumumanComponent implements OnInit {

  announcement: any[];

	constructor(
    public activeModal: NgbActiveModal,
    private _refPengumumanServiceProxy: RefPengumumanServiceProxy
  ) {}

	ngOnInit(): void {
    this.show();
  }

  show() {
    this._refPengumumanServiceProxy.getAllPengumumanForView().subscribe((result) => {
      this.announcement = result.items;
    })
  }
}
