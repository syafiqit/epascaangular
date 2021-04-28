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
	private unsubscriber: Subject<any> = new Subject();
	public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

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
				path: '/app/muka-halaman',
				icon: 'home',
				type: 'link'
			},
			{
				title: 'Pengurusan Pengguna',
				path: '/app/pengguna/senarai-pengurusan-pengguna',
				icon: 'check-square',
				type: 'link'
			},
			{
				title: 'Pengurusan Mangsa',
				path: '/app/mangsa/senarai-pengurusan-mangsa',
				icon: 'users',
				type: 'link'
			}
		];

		const role = this._appSessionService.role;
		switch (role) {
			case 'administrator': {
				menu.push(this.getBencanaMenu(), this.getTabungMenu(), this.getTetapanMenu());
				break;
			}
			case 'kewangan': {
				menu.push(this.getTabungMenu());
				break;
			}
			default: {
				break;
			}
		}

		return menu;
	}

  getBencanaMenu(): Menu {
		const menu: Menu =
			{
				title: 'Pengurusan Bencana',
				path: '/app/bencana/pengurusan-bencana',
				icon: 'layers',
				type: 'link'
			}

		return menu;
	}

	getTetapanMenu(): Menu {
		const menu: Menu = {
			title: 'Tetapan',
			icon: 'settings',
			type: 'sub',
			active: false,
			children: [
				{ path: '/app/tetapan/senarai-bencana', title: 'Kategori Bencana', type: 'link' },
				{ path: '/app/tetapan/senarai-kementerian', title: 'Kementerian', type: 'link' },
				{ path: '/app/tetapan/senarai-agensi', title: 'Agensi', type: 'link' },
				{ path: '/app/tetapan/senarai-pelaksana', title: 'Pelaksana', type: 'link' },
				{ path: '/app/tetapan/senarai-pemilik-projek', title: 'Pemilik Projek', type: 'link' },
				{ path: '/app/tetapan/senarai-negeri', title: 'Negeri', type: 'link' },
				{ path: '/app/tetapan/senarai-parlimen', title: 'Parlimen', type: 'link' },
				{ path: '/app/tetapan/senarai-daerah', title: 'Daerah', type: 'link' },
				{ path: '/app/tetapan/senarai-dun', title: 'Dun', type: 'link' },
				{ path: '/app/tetapan/senarai-kerosakan-rumah', title: 'Kerosakan Rumah', type: 'link' },
				{ path: '/app/tetapan/senarai-sumber-dana', title: 'Sumber Dana', type: 'link' },
				{ path: '/app/tetapan/senarai-status-berpindah', title: 'Status Berpindah', type: 'link' },
				{ path: '/app/tetapan/senarai-pinjaman-usahawan', title: 'Pinjaman Usahawan', type: 'link' },
				{ path: '/app/tetapan/senarai-pengumuman', title: 'Senarai Pengumuman', type: 'link' },
				{ path: '/app/tetapan/senarai-pemilik-projek-rumah', title: 'Pemilik Projek Rumah', type: 'link' },
				{ path: '/app/tetapan/senarai-jenis-bantuan', title: 'Jenis Bantuan', type: 'link' },
				{ path: '/app/tetapan/hubungan', title: 'Hubungan', type: 'link' },
				{ path: '/app/tetapan/peranan', title: 'Peranan', type: 'link' },
				{ path: '/app/tetapan/rujukan', title: 'Rujukan', type: 'link' }
			]
		};

		return menu;
	}

	getTabungMenu(): Menu {
		const menu: Menu = {
			title: 'Pengurusan Tabung',
			icon: 'folder-plus',
			type: 'sub',
			active: false,
			children: [
				{ path: '/app/tabung/muka-halaman-tabung', title: 'Muka Halaman Tabung', type: 'link' },
				{ path: '/app/tabung/senarai-tabung', title: 'Tabung', type: 'link' },
				{ path: '/app/tabung/senarai-kelulusan', title: 'Kelulusan', type: 'link' },
				{
					title: 'Pembayaran',
					type: 'sub',
					children: [
						{ path: '/app/tabung/senarai-skb', title: 'Surat Kuasa Belanja', type: 'link' },
						{
							path: '/app/tabung/senarai-bayaran-secara-terus',
							title: 'Bayaran Secara Terus',
							type: 'link'
						}
					]
				},
				{ path: '/app/tabung/senarai-wang-ihsan', title: 'Bantuan Wang Ihsan', type: 'link' }
			]
		};

		return menu;
	}

	ngOnDestroy() {
		this.unsubscriber.next();
		this.unsubscriber.complete();
	}

	private setScreenWidth(width: number): void {
		this.screenWidth.next(width);
	}

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
}
