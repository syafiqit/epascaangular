import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './shared/components/layout/content/content.component';
import { FullComponent } from './shared/components/layout/full/full.component';
import { full } from './shared/routes/full.routes';
import { content } from './shared/routes/routes';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'app/muka-halaman',
		pathMatch: 'full'
	},
	{
		path: '',
		component: ContentComponent,
		children: content
	},
	{
		path: 'akaun',
		loadChildren: () => import('./akaun/akaun.module').then(m => m.AkaunModule), //Lazy load account module
		data: { preload: true }
	}
];

@NgModule({
	imports: [
		[
			RouterModule.forRoot(routes, {
				anchorScrolling: 'enabled',
				scrollPositionRestoration: 'enabled',
				relativeLinkResolution: 'legacy'
			})
		]
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
