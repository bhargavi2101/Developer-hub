import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { App } from './app';
import { Register } from './register/register';
import { Login } from './login/login';
import { Landing } from './landing/landing';
import { RouterModule } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Roadmaps } from './roadmaps/roadmaps';
import { TechnologyPage } from './technology-page/technology-page';
import { Profile } from './profile/profile';
import { PublicProfile } from './public-profile/public-profile';
import { Badges } from './badges/badges';
import { Notes } from './notes/notes';
import { Quiz } from './quiz/quiz';
import { TopicDetail } from './topic-detail/topic-detail';
import { HttpInterceptorService } from './http-interceptor.service';
import { AdvancedSearch } from './search/advanced-search.component';
import { NotificationCenter } from './notification-center/notification-center.component';
import { LanguageSwitcher } from './language-switcher/language-switcher.component';
import { SharedNav } from './shared-nav/shared-nav.component';

@NgModule({
  declarations: [
    App,
    Register,
    Login,
    Landing,
    Dashboard,
    Roadmaps,
    TechnologyPage,
    TopicDetail,
    Profile,
    PublicProfile,
    Badges,
    Notes,
    Quiz,
    AdvancedSearch,
    NotificationCenter,
    LanguageSwitcher,
    SharedNav
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
   RouterModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: 'AuthGuard', useClass: class { canActivate() { return true; } } },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }
