import { Routes } from '@angular/router';

export const content: Routes = [
	{
		path: 'main',
		loadChildren: () => import('../../main/main.module').then((m) => m.MainModule)
	},
	{
		path: 'tetapan',
		loadChildren: () => import('../../main/tetapan/tetapan.module').then((m) => m.TetapanModule)
	},
	{
		path: 'pengurusan',
		loadChildren: () =>
			import('../../main/pengurusan-pengguna/pengurusan-pengguna.module').then((m) => m.PengurusanPenggunaModule)
	},
	{
		path: 'pengurusan-mangsa',
		loadChildren: () =>
			import('../../main/pengurusan-mangsa/pengurusan-mangsa.module').then((m) => m.PengurusanMangsaModule)
	},
	{
		path: 'pengurusan-tabung',
		loadChildren: () =>
			import('../../main/pengurusan-tabung/pengurusan-tabung.module').then((m) => m.PengurusanTabungModule)
	},
	{
		path: 'muka-halaman',
		loadChildren: () => import('../../main/muka-halaman/muka-halaman.module').then((m) => m.MukaHalamanModule)
	},
	{
		path: 'maklumat-akaun',
		loadChildren: () => import('../../main/maklumat-akaun/maklumat-akaun.module').then((m) => m.MaklumatAkaunModule)
	}
];
