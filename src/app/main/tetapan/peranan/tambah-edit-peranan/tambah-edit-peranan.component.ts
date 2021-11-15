import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CreateOrEditRefPerananDto, RefPerananServiceProxy } from '../../../../shared/proxy/service-proxies';
import { PerananTreeComponent } from '@app/shared/components/peranan-tree/peranan-tree.component';
import { TreeNode } from 'primeng/api';
import { ConfirmationService } from '@app/shared/services/confirmation';

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
    private _confirmationService: ConfirmationService,
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
    input.status_peranan = this.peranan.status_peranan;
    input.id = self.peranan.id;
    input.peranan = self.peranan.peranan;
    input.capaian_dibenarkan = self.permissionTree.getGrantedPermissionNames();

		this._refPerananServiceProxy
			.createOrEdit(input)
			.pipe()
			.subscribe((result) => {
				if (this.name === 'add') {
          const dialogRef = this._confirmationService.open({
            title: 'Berjaya',
            message: 'Maklumat Peranan Berjaya Ditambah',
            icon: {
              show: true,
              name: 'check-circle',
              color: 'success'
            },
            actions: {
              confirm: {
                show: true,
                label: 'Tutup',
                color: 'primary'
              },
              cancel: {
                show: false
              }
            },
            dismissible: true
          });
          dialogRef.afterClosed().subscribe(() => {
            this.activeModal.close(true);
          });
				} else if (this.name === 'edit') {
          if(result.message == 'Peranan Berjaya Dikemaskini'){
            const dialogRef = this._confirmationService.open({
              title: 'Berjaya',
              message: 'Maklumat Peranan Berjaya Dikemaskini',
              icon: {
                show: true,
                name: 'check-circle',
                color: 'success'
              },
              actions: {
                confirm: {
                  show: true,
                  label: 'Tutup',
                  color: 'primary'
                },
                cancel: {
                  show: false
                }
              },
              dismissible: true
            });
            dialogRef.afterClosed().subscribe(() => {
              this.activeModal.close(true);
            });
          }else{
            this._confirmationService.open({
              title: 'Tidak Berjaya',
              message: result.message,
              icon: {
                show: true,
                name: 'x-circle',
                color: 'error'
              },
              actions: {
                confirm: {
                  show: true,
                  label: 'Tutup',
                  color: 'primary'
                },
                cancel: {
                  show: false
                }
              },
              dismissible: true
            });
          }

				}
			});
	}

  private loadAllPermissionsToFilterTree(grantedPermissions?) {
    this._refPerananServiceProxy.getAllRefCapaian().subscribe((result) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.permissionTree.editData = { ref_capaian:  result.ref_capaian, capaian: grantedPermissions};
    });
}
}
