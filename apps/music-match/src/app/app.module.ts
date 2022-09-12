import { UserEffects } from './state/users/user.effects';
import { ArtistsEffects } from './state/artists/artist.effects';
import { trackReducer } from './state/tracks/track.reducer';
import { releaseReducer } from './state/releases/release.reducer';
import { searchReducer } from './state/search/search.reducer';
import { playlistReducer } from './state/playlists/playlist.reducer';
import { PlaylistsEffects } from './state/playlists/playlist.effects';
import { WithCredentialsInterceptor } from './interceptors/with-credentials.interceptor';
import { AppState } from './app.state';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { AngularMaterialModule } from './angular-material.module';

import { LayoutModule } from '@angular/cdk/layout';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NavigationComponent } from './pages/navigation/navigation.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { MusicItemComponent } from './components/music-item/music-item.component';
import { TracksComponent } from './components/tracks/tracks.component';
import { UserComponent } from './pages/user/user.component';
import { ReleaseComponent } from './pages/release/release.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { PlaylistFormDialogComponent } from './components/playlist-form-dialog/playlist-form-dialog.component';
import { SearchComponent } from './pages/search/search.component';
import { SearchEffects } from './state/search/search.effects';
import { artistReducer } from './state/artists/artist.reducer';
import { userReducer } from './state/users/user.reducer';
import { SearchResultCardComponent } from './components/search-result-card/search-result-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationComponent,
    RegisterComponent,
    HomeComponent,
    SidenavComponent,
    PlaylistComponent,
    MusicItemComponent,
    TracksComponent,
    UserComponent,
    ReleaseComponent,
    ArtistComponent,
    PlaylistFormDialogComponent,
    SearchComponent,
    SearchResultCardComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    StoreModule.forRoot<AppState>(
      {
        releases: releaseReducer,
        artists: artistReducer,
        users: userReducer,
        playlists: playlistReducer,
        searchResults: searchReducer,
        tracks: trackReducer,
      },
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot([
      PlaylistsEffects,
      SearchEffects,
      ArtistsEffects,
      UserEffects,
    ]),
    !environment.production
      ? StoreDevtoolsModule.instrument({
          maxAge: 25,
          autoPause: true,
        })
      : [],
    BrowserAnimationsModule,

    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    HttpClientModule,
    LayoutModule,
    DragDropModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
