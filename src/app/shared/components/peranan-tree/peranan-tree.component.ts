/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Component, ViewEncapsulation, Input } from '@angular/core';
import { RefCapaianDto } from '@shared/proxy/service-proxies';
import { TreeNode } from 'primeng/api';
import * as _ from 'lodash';
import { ArrayToTreeConverterService } from '@app/shared/helpers/array-to-tree-converter.service';
import { TreeDataHelperService } from '@app/shared/helpers/tree-data-helper.service';

@Component({
	selector: 'app-peranan-tree',
	templateUrl: './peranan-tree.component.html',
	encapsulation: ViewEncapsulation.None
})
export class PerananTreeComponent {
	@Input() singleSelect: boolean;

	set editData(val) {
		this.setTreeData(val?.ref_capaian);
		this.setSelectedNodes(val?.capaian);
	}

	treeData: any;
	selectedPermissions: TreeNode[] = [];
	filter = '';

	constructor(
		private _arrayToTreeConverterService: ArrayToTreeConverterService,
		private _treeDataHelperService: TreeDataHelperService
	) {}

	setTreeData(permissions: RefCapaianDto[]) {
		this.treeData = this._arrayToTreeConverterService.createTree(
			permissions,
			'pendahulu',
			'nama',
			null,
			'children',
			[
				{
					target: 'label',
					source: 'nama_paparan'
				},
				{
					target: 'expandedIcon',
					value: 'fa fa-folder-open m--font-warning'
				},
				{
					target: 'collapsedIcon',
					value: 'fa fa-folder m--font-warning'
				},
				{
					target: 'expanded',
					value: true
				}
			]
		);
	}

	setSelectedNodes(grantedPermissionNames: string[]) {
		this.selectedPermissions = [];
		_.forEach(grantedPermissionNames, (permission) => {
			const item = this._treeDataHelperService.findNode(this.treeData, { data: { nama: permission } });
			if (item) {
				this.selectedPermissions.push(item);
			}
		});
	}

	getGrantedPermissionNames(): string[] {
		if (!this.selectedPermissions || !this.selectedPermissions.length) {
			return [];
		}

		const permissionNames = [];

		for (const p of this.selectedPermissions) {
			permissionNames.push(p.data.nama);
		}

		return permissionNames;
	}

	nodeSelect(event) {
		if (this.singleSelect) {
			this.selectedPermissions = [event.node];
			return;
		}

		let parentNode = this._treeDataHelperService.findParent(this.treeData, {
			data: { nama: event.node.data.nama }
		});

		while (parentNode != null) {
			this.selectedPermissions.push(parentNode);
			parentNode = this._treeDataHelperService.findParent(this.treeData, {
				data: { nama: parentNode.data.nama }
			});
		}
	}

	onNodeUnselect(event) {
		const childrenNodes = this._treeDataHelperService.findChildren(this.treeData, {
			data: { nama: event.node.data.nama }
		});
		childrenNodes.push(event.node.data.nama);
		_.remove(this.selectedPermissions, (x: any) => childrenNodes.indexOf(x.data.nama) !== -1);
	}

	filterPermissions($event): void {
		this.filterPermission(this.treeData, this.filter);
	}

	filterPermission(nodes, filterText): any {
		_.forEach(nodes, (node) => {
			if (node.data.nama_paparan.toLowerCase().indexOf(filterText.toLowerCase()) >= 0) {
				node.styleClass = this.showParentNodes(node);
			} else {
				node.styleClass = 'hidden-tree-node';
			}
			if (node.children) {
				this.filterPermission(node.children, filterText);
			}
		});
	}

	showParentNodes(node): void {
		if (!node.pendahulu) {
			return;
		}

		node.pendahulu.styleClass = '';
		this.showParentNodes(node.pendahulu);
	}
}
