import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefPerananDto, RefPerananServiceProxy } from '../../../../shared/proxy/service-proxies';
import { swalSuccess } from '@shared/sweet-alert/swal-constant';
import { PerananTreeComponent } from '@app/shared/components/peranan-tree/peranan-tree.component';
import { TreeNode } from 'primeng/api';

@Component({
	selector: 'app-tambah-edit-peranan',
	templateUrl: './tambah-edit-peranan.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [NgbModalConfig, NgbModal]
})
export class TambahEditPerananComponent implements OnInit {
	@Input() name;
	@Input() id;
  @Input() singleSelect: boolean;

  @ViewChild('permissionTree') permissionTree: PerananTreeComponent;

  selectedPermissions: TreeNode[] = [];
	peranan: CreateOrEditRefPerananDto = new CreateOrEditRefPerananDto();
	saving = false;


	constructor(
		public activeModal: NgbActiveModal,
		private _refPerananServiceProxy: RefPerananServiceProxy
	) {}

	ngOnInit(): void {
		this.show();
	}

	show() {
		if (!this.id) {
			this.peranan = new CreateOrEditRefPerananDto();
      this.loadAllPermissionsToFilterTree();
		} else {
			this._refPerananServiceProxy.getRefPerananForEdit(this.id).subscribe((result) => {
        this.peranan = result.ref_peranan;
        this.loadAllPermissionsToFilterTree(result.ref_peranan.capaian_dibenarkan);
			});
		}
	}

	save(): void {
    const self = this;
		this.saving = true;
    const input = new CreateOrEditRefPerananDto();
    input.id = self.peranan.id;
    input.peranan = self.peranan.peranan;
    input.capaian_dibenarkan = self.permissionTree.getGrantedPermissionNames();

		this._refPerananServiceProxy
			.createOrEdit(input)
			.pipe()
			.subscribe(() => {
				if (this.name === 'add') {
					swalSuccess.fire('Berjaya!', 'Maklumat Peranan Berjaya Ditambah.', 'success');
				} else if (this.name === 'edit') {
					swalSuccess.fire('Berjaya!', 'Maklumat Peranan Berjaya Dikemaskini.', 'success');
				}
				this.activeModal.close(true);
			});
	}

  private loadAllPermissionsToFilterTree(grantedPermissions?) {
    this._refPerananServiceProxy.getAllRefCapaian().subscribe((result) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.permissionTree.editData = { ref_capaian:  result.ref_capaian, capaian: grantedPermissions};
    });
}
}
