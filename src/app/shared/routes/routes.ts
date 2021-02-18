import { Routes } from '@angular/router';
import { AppRouteGuard } from '../guards/app-route-guard';

export const content: Routes = [
	{
		path: 'app',
		canActivate: [AppRouteGuard],
		children: [
			{
				path: '',
				children: [{ path: '', redirectTo: '/app/muka-halaman', pathMatch: 'full' }]
			},
			{
				path: 'muka-halaman',
				loadChildren: () =>
					import('../../main/muka-halaman/muka-halaman.module').then((m) => m.MukaHalamanModule),
				data: { preload: true }
			},
			{
				path: 'maklumat/akaun',
				loadChildren: () =>
					import('../../main/maklumat-akaun/maklumat-akaun.module').then((m) => m.MaklumatAkaunModule),
				data: { preload: true }
			},
			{
				path: 'pengurusan/mangsa',
				loadChildren: () =>
					import('../../main/pengurusan-mangsa/pengurusan-mangsa.module').then(
						(m) => m.PengurusanMangsaModule
					),
				data: { preload: true }
			},
			{
				path: 'pengurusan/pengguna',
				loadChildren: () =>
					import('../../main/pengurusan-pengguna/pengurusan-pengguna.module').then(
						(m) => m.PengurusanPenggunaModule
					),
				data: { preload: true }
			},
			{
				path: 'pengurusan/tabung',
				loadChildren: () =>
					import('../../main/pengurusan-tabung/pengurusan-tabung.module').then(
						(m) => m.PengurusanTabungModule
					),
				data: { preload: true }
			},
			{
				path: 'tetapan',
				loadChildren: () => import('../../main/tetapan/tetapan.module').then((m) => m.TetapanModule),
				data: { preload: true }
			},
			{
				path: '**',
				redirectTo: 'notifications'
			}
		]
	}
];
