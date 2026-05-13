import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { Landing } from './landing/landing';
import { Dashboard } from './dashboard/dashboard';
import { Roadmaps } from './roadmaps/roadmaps';
import { TechnologyPage } from './technology-page/technology-page';
import { Profile } from './profile/profile';
import { PublicProfile } from './public-profile/public-profile';
import { Badges } from './badges/badges';
import { Notes } from './notes/notes';
import { Quiz } from './quiz/quiz';
import { TopicDetail } from './topic-detail/topic-detail';
import { ForumComponent } from './forum/forum.component';
import { ForumTopicComponent } from './forum-topic/forum-topic.component';
import { SocialFeed } from './social-feed/social-feed';
import { UserSearch } from './user-search/user-search.component';
import { AdminDashboard } from './admin/admin-dashboard.component';
import { Analytics } from './analytics/analytics.component';
import { AdvancedSearch } from './search/advanced-search.component';
import { NotificationCenter } from './notification-center/notification-center.component';
import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: Landing },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'search', component: AdvancedSearch },
  { path: 'notifications', component: NotificationCenter },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'roadmaps/:technologyId/:subTechnologyId', component: TechnologyPage, canActivate: [AuthGuard] },
  { path: 'roadmaps/:technologyId', component: TechnologyPage, canActivate: [AuthGuard] },
  { path: 'roadmaps', component: Roadmaps, canActivate: [AuthGuard] },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: 'profile/:username', component: PublicProfile },
  { path: 'badges', component: Badges, canActivate: [AuthGuard] },
  { path: 'notes/:roadmapId', component: Notes, canActivate: [AuthGuard] },
  { path: 'notes', component: Notes, canActivate: [AuthGuard] },
  { path: 'quiz/:subTechnologyId', component: Quiz, canActivate: [AuthGuard] },
  { path: 'topic/:technologyId/:subTechnologyId/:topicIndex', component: TopicDetail, canActivate: [AuthGuard] },
  // Community and Social Features
  { path: 'forum', component: ForumComponent, canActivate: [AuthGuard] },
  { path: 'forum/:technologyId', component: ForumComponent, canActivate: [AuthGuard] },
  { path: 'forum-topic/:forumId', component: ForumTopicComponent, canActivate: [AuthGuard] },
  { path: 'social-feed', component: SocialFeed, canActivate: [AuthGuard] },
  { path: 'users/search', component: UserSearch, canActivate: [AuthGuard] },
  // Admin and Analytics
  { path: 'admin', component: AdminDashboard, canActivate: [AuthGuard] },
  { path: 'analytics', component: Analytics, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
