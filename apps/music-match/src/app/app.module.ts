import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppState } from './app.state';
import { WithCredentialsInterceptor } from './interceptors/with-credentials.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/auth.service';
import { ArtistsEffects } from './state/artists/artist.effects';
import { PlaylistsEffects } from './state/playlists/playlist.effects';
import { playlistReducer } from './state/playlists/playlist.reducer';
import { ReleaseEffects } from './state/releases/release.effects';
import { releaseReducer } from './state/releases/release.reducer';
import { searchReducer } from './state/search/search.reducer';
import { TrackEffects } from './state/tracks/track.effects';
import { trackReducer } from './state/tracks/track.reducer';
import { userCompatibilityReducer } from './state/user-compatibility/user-compatibility.reducer';
import { UserEffects } from './state/users/user.effects';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';

import { ImgFallbackModule } from 'ngx-img-fallback';

import { AddCollaboratorFormDialogComponent } from './components/add-collaborator-form-dialog/add-collaborator-form-dialog.component';
import { AddToPlaylistFormDialogComponent } from './components/add-to-playlist-form-dialog/add-to-playlist-form-dialog.component';
import { ArtistFormDialogComponent } from './components/artist-form-dialog/artist-form-dialog.component';
import { PlaylistFormDialogComponent } from './components/playlist-form-dialog/playlist-form-dialog.component';
import { ReleaseFormDialogComponent } from './components/release-form-dialog/release-form-dialog.component';
import { SearchResultCardComponent } from './components/search-result-card/search-result-card.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TrackResultCardComponent } from './components/track-result-card/track-result-card.component';
import { TracksComponent } from './components/tracks/tracks.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { HomeComponent } from './pages/home/home.component';
import { NavigationComponent } from './pages/navigation/navigation.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';
import { RegisterComponent } from './pages/register/register.component';
import { ReleaseComponent } from './pages/release/release.component';
import { SearchComponent } from './pages/search/search.component';
import { UserComponent } from './pages/user/user.component';
import { artistReducer } from './state/artists/artist.reducer';
import { SearchEffects } from './state/search/search.effects';
import { UserMusicMatchEffects } from './state/user-compatibility/user-compatibility.effects';
import { userReducer } from './state/users/user.reducer';
import { recommendationReducer } from './state/recommendations/recommendation.reducer';
import { RecommendationsEffects } from './state/recommendations/recommendation.effects';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationComponent,
    RegisterComponent,
    HomeComponent,
    SidenavComponent,
    PlaylistComponent,
    TracksComponent,
    UserComponent,
    ReleaseComponent,
    ArtistComponent,
    PlaylistFormDialogComponent,
    SearchComponent,
    SearchResultCardComponent,
    TrackResultCardComponent,
    AddToPlaylistFormDialogComponent,
    AddCollaboratorFormDialogComponent,
    ArtistFormDialogComponent,
    ReleaseFormDialogComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    StoreModule.forRoot<AppState>(
      {
        artists: artistReducer,
        releases: releaseReducer,
        tracks: trackReducer,
        users: userReducer,
        playlists: playlistReducer,
        searchResults: searchReducer,
        userCompatibilities: userCompatibilityReducer,
        recommendations: recommendationReducer,
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
      ArtistsEffects,
      ReleaseEffects,
      TrackEffects,
      UserEffects,
      PlaylistsEffects,
      SearchEffects,
      UserMusicMatchEffects,
      RecommendationsEffects,
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
    ImgFallbackModule,
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
