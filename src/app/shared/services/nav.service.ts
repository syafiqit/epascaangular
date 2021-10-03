/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppSessionService } from './app-session.service';

// Menu
export interface Menu {
	headTitle1?: string;
	headTitle2?: string;
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
  permission?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})
export class NavService implements OnDestroy {

	// Search Box
	public search = false;

	// Language
	public language = false;

	// Mega Menu
	public megaMenu = false;
	public levelMenu = false;
	public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

	// Collapse Sidebar
	public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

	// Full screen
	public fullScreen = false;


  MENUITEMS: Menu[] = [];

	MEGAMENUITEMS: Menu[] = [
		{
			title: 'Error Pages',
			type: 'sub',
			active: true,
			children: [
				{ path: 'javascript:void(0);', title: 'Error Page 400', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Error Page 401', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Error Page 403', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Error Page 404', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Error Page 500', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Error Page 503', type: 'extLink' }
			]
		},
		{
			title: 'Authentication',
			type: 'sub',
			active: false,
			children: [
				{ path: 'javascript:void(0);', title: 'Login Simple', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Login BG Image', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Login BG Video', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Simple Register', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Register BG Image', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Register BG Video', type: 'extLink' }
			]
		},
		{
			title: 'Usefull Pages',
			type: 'sub',
			active: false,
			children: [
				{ path: 'javascript:void(0);', title: 'Search Pages', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Unlock User', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Forgot Password', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Reset Password', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Maintenance', type: 'extLink' }
			]
		},
		{
			title: 'Email templates',
			type: 'sub',
			active: false,
			children: [
				{
					path: 'http://admin.pixelstrap.com/cuba/theme/basic-template.html',
					title: 'Basic Email',
					type: 'extTabLink'
				},
				{
					path: 'http://admin.pixelstrap.com/cuba/theme/email-header.html',
					title: 'Basic With Header',
					type: 'extTabLink'
				},
				{
					path: 'http://admin.pixelstrap.com/cuba/theme/template-email.html',
					title: 'Ecomerce Template',
					type: 'extTabLink'
				},
				{
					path: 'http://admin.pixelstrap.com/cuba/theme/template-email-2.html',
					title: 'Email Template 2',
					type: 'extTabLink'
				},
				{
					path: 'http://admin.pixelstrap.com/cuba/theme/ecommerce-templates.html',
					title: 'Ecommerce Email',
					type: 'extTabLink'
				},
				{
					path: 'http://admin.pixelstrap.com/cuba/theme/email-order-success.html',
					title: 'Order Success',
					type: 'extTabLink'
				}
			]
		},
		{
			title: 'Coming Soon',
			type: 'sub',
			active: false,
			children: [
				{ path: 'javascript:void(0);', title: 'Coming Simple', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Coming BG Image', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Coming BG Video', type: 'extLink' }
			]
		}
	];

	LEVELMENUITEMS: Menu[] = [
		{
			path: 'javascript:void(0);',
			title: 'File Manager',
			icon: 'git-pull-request',
			type: 'extLink'
		},
		{
			title: 'Users',
			icon: 'users',
			type: 'sub',
			active: false,
			children: [
				{ path: 'javascript:void(0);', title: 'All Users', icon: 'users', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'User Profile', icon: 'users', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Edit Profile', icon: 'users', type: 'extLink' }
			]
		},
		{ path: 'javascript:void(0);', title: 'Bookmarks', icon: 'heart', type: 'extLink' },
		{ path: 'javascript:void(0);', title: 'Calender', icon: 'calendar', type: 'extLink' },
		{ path: 'javascript:void(0);', title: 'Social App', icon: 'zap', type: 'extLink' }
	];

	// Array
	items = new BehaviorSubject<Menu[]>(this.getMenu());
	megaItems = new BehaviorSubject<Menu[]>(this.MEGAMENUITEMS);
	levelmenuitems = new BehaviorSubject<Menu[]>(this.LEVELMENUITEMS);

	public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);
	private unsubscriber: Subject<any> = new Subject();


	constructor(private router: Router, private _appSessionService: AppSessionService) {
		this.setScreenWidth(window.innerWidth);
		fromEvent(window, 'resize')
			.pipe(debounceTime(1000), takeUntil(this.unsubscriber))
			.subscribe((evt: any) => {
				this.setScreenWidth(evt.target.innerWidth);
				if (evt.target.innerWidth < 991) {
					this.collapseSidebar = true;
					this.megaMenu = false;
					this.levelMenu = false;
				}
				if (evt.target.innerWidth < 1199) {
					this.megaMenuColapse = true;
				}
			});
		if (window.innerWidth < 991) {
			// Detect Route change sidebar close
			this.router.events.subscribe((event) => {
				this.collapseSidebar = true;
				this.megaMenu = false;
				this.levelMenu = false;
			});
		}
	}

	getMenu(): Menu[] {
		const menu: Menu[] = [
			{
				title: 'Muka Halaman',
				icon: 'home',
				type: 'sub',
				active: false,
        permission: 'Halaman',
				children: [
          { path: '/app/muka-halaman', title: 'Muka Halaman Utama', type: 'link', permission: 'Halaman.Dashboard', },
          { path: '/app/tabung/muka-halaman-tabung', title: 'Muka Halaman Tabung', type: 'link', permission: 'Halaman.Tabung.Dashboard' }
				]
			},
			{
				title: 'Pengurusan Pengguna',
				icon: 'check-square',
				type: 'sub',
				active: false,
				children: [
          { path: '/app/pengguna/senarai', title: 'Senarai Pengguna', type: 'link' },
          { path: '/app/pengguna/permohonan', title: 'Permohonan Pengguna', type: 'link' }
				]
			},
			{
				title: 'Kemaskini Maklumat',
				icon: 'folder',
				type: 'sub',
				active: false,
				children: [
          { path: '/app/mangsa/senarai-pengurusan-mangsa', title: 'Pengurusan Mangsa', type: 'link', permission: 'Halaman.Mangsa' },
          { path: '/app/bencana/pengurusan-bencana', title: 'Pengurusan Bencana', type: 'link', permission: 'Halaman.Bencana' }
				]
			},
			{
				title: 'Pengurusan Tabung',
				icon: 'folder-plus',
				type: 'sub',
				active: false,
				children: [
          { path: '/app/tabung/senarai', title: 'Tabung', type: 'link' },
          { path: '/app/tabung/senarai-kelulusan', title: 'Kelulusan', type: 'link' },
				{
					title: 'Pembayaran',
					type: 'sub',
					children: [
            { path: '/app/tabung/skb/senarai',
              title: 'Surat Kuasa Belanja',
              type: 'link'
            },
            {
              path: '/app/tabung/bayaran-terus/senarai',
              title: 'Bayaran Secara Terus',
              type: 'link'
            },
            {
              path: '/app/tabung/waran/senarai',
              title: 'Bayaran Secara Waran',
              type: 'link'
            }
					]
				},
				  { path: '/app/tabung/senarai-wang-ihsan', title: 'Bantuan Wang Ihsan', type: 'link' }
				]
			},
			{
				title: 'Laporan',
				path: '/app/laporan/senarai',
				icon: 'trending-up',
				type: 'link'
			},
			{
				title: 'Tetapan',
				path: '/app/tetapan',
				icon: 'settings',
				type: 'link',
        permission: 'Halaman.Tetapan'
			}
		];
		return menu;
	}

	ngOnDestroy() {
		this.unsubscriber.next();
		this.unsubscriber.complete();
	}

	private setScreenWidth(width: number): void {
		this.screenWidth.next(width);
	}
}
