import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { TranslateModule } from '@ngx-translate/core';
// Components
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/layout/content/content.component';
import { FullComponent } from './components/layout/full/full.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TapToTopComponent } from './components/tap-to-top/tap-to-top.component';
// Header Elements Components
import { SearchComponent } from './components/header/elements/search/search.component';
import { MegaMenuComponent } from './components/header/elements/mega-menu/mega-menu.component';
import { LanguagesComponent } from './components/header/elements/languages/languages.component';
import { NotificationComponent } from './components/header/elements/notification/notification.component';
import { BookmarkComponent } from './components/header/elements/bookmark/bookmark.component';
import { CartComponent } from './components/header/elements/cart/cart.component';
import { MessageBoxComponent } from './components/header/elements/message-box/message-box.component';
import { MyAccountComponent } from './components/header/elements/my-account/my-account.component';
// Directives
import { DisableKeyPressDirective } from './directives/disable-key-press.directive';
import { OnlyAlphabetsDirective } from './directives/only-alphabets.directive';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { ShowOptionsDirective } from './directives/show-options.directive';
import { BusyIfDirective } from './directives/busy-if.directive';
import { ButtonBusyDirective } from './directives/button-busy.directive';
import { FocusInvalidInputDirective } from './directives/focus-invalid-input.directives';
import { KpValidatorDirective } from './directives/kp-validator.directive';
// Services
import { LayoutService } from './services/layout.service';
import { NavService } from './services/nav.service';
import * as ApiServiceProxies from './proxy/service-proxies';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';

const NSWAG = [
	ApiServiceProxies.RefAgamaServiceProxy,
	ApiServiceProxies.RefAgensiServiceProxy,
	ApiServiceProxies.RefBantuanServiceProxy,
	ApiServiceProxies.RefBencanaServiceProxy,
	ApiServiceProxies.RefDaerahServiceProxy,
	ApiServiceProxies.RefDunServiceProxy,
	ApiServiceProxies.RefJenisBencanaServiceProxy,
	ApiServiceProxies.RefJenisPertanianServiceProxy,
	ApiServiceProxies.RefKementerianServiceProxy,
	ApiServiceProxies.RefKerosakanServiceProxy,
	ApiServiceProxies.RefMukimServiceProxy,
	ApiServiceProxies.RefNegeriServiceProxy,
	ApiServiceProxies.RefParlimenServiceProxy,
	ApiServiceProxies.RefPelaksanaServiceProxy,
	ApiServiceProxies.RefPemilikServiceProxy,
	ApiServiceProxies.RefPerananServiceProxy,
	ApiServiceProxies.RefPindahServiceProxy,
	ApiServiceProxies.RefPinjamanPerniagaanServiceProxy,
	ApiServiceProxies.RefSektorServiceProxy,
	ApiServiceProxies.RefStatusKemajuanServiceProxy,
	ApiServiceProxies.RefStatusKerosakanServiceProxy,
	ApiServiceProxies.RefSumberDanaServiceProxy,
	ApiServiceProxies.RefSumberPeruntukanServiceProxy,
	ApiServiceProxies.RefTapakRumahServiceProxy,
	ApiServiceProxies.RefWarganegaraServiceProxy,
	ApiServiceProxies.RefHubunganServiceProxy,
  ApiServiceProxies.AuthServiceProxy,
  ApiServiceProxies.SessionServiceProxy,
  ApiServiceProxies.UserServiceProxy,
  ApiServiceProxies.MangsaAirServiceProxy,
  ApiServiceProxies.MangsaAntarabangsaServiceProxy,
  ApiServiceProxies.MangsaBantuanServiceProxy,
  ApiServiceProxies.MangsaBencanaServiceProxy,
  ApiServiceProxies.MangsaKerosakanServiceProxy,
  ApiServiceProxies.MangsaPertanianServiceProxy,
  ApiServiceProxies.MangsaPinjamanServiceProxy,
  ApiServiceProxies.MangsaRumahServiceProxy,
  ApiServiceProxies.MangsaServiceProxy,
  ApiServiceProxies.MangsaWangIhsanServiceProxy,
  ApiServiceProxies.TabungServiceProxy,
  ApiServiceProxies.TabungBayaranSkbBulananServiceProxy,
  ApiServiceProxies.TabungBayaranSkbServiceProxy,
  ApiServiceProxies.TabungBayaranTerusServiceProxy,
  ApiServiceProxies.TabungBwiKirServiceProxy,
  ApiServiceProxies.TabungBwiServiceProxy,
  ApiServiceProxies.TabungKelulusanServiceProxy,
  ApiServiceProxies.TabungPeruntukanServiceProxy
];

@NgModule({
	declarations: [
		HeaderComponent,
		FooterComponent,
		SidebarComponent,
		ContentComponent,
		BreadcrumbComponent,
		FeatherIconsComponent,
		FullComponent,
		ShowOptionsDirective,
		DisableKeyPressDirective,
		OnlyAlphabetsDirective,
		OnlyNumbersDirective,
    ButtonBusyDirective,
		BusyIfDirective,
		LoaderComponent,
		TapToTopComponent,
		SearchComponent,
		MegaMenuComponent,
		LanguagesComponent,
		NotificationComponent,
		BookmarkComponent,
		CartComponent,
		MessageBoxComponent,
		MyAccountComponent,
    FocusInvalidInputDirective,
    KpValidatorDirective
	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		DragulaModule.forRoot(),
		TranslateModule,
	],
	providers: [
    NavService,
    LayoutService,
    ...NSWAG,
		{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
	exports: [
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule,
		LoaderComponent,
		BreadcrumbComponent,
		FeatherIconsComponent,
		TapToTopComponent,
		DisableKeyPressDirective,
		OnlyAlphabetsDirective,
		OnlyNumbersDirective,
		BusyIfDirective,
    ButtonBusyDirective,
    FocusInvalidInputDirective,
    KpValidatorDirective
	]
})
export class SharedModule {}
