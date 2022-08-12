import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { loadRemoteModule } from '@tusk/module-federation';
import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'tusk-shell' }),
    RouterModule.forRoot(
      [
        {
          path: 'remote1',
          loadChildren: () =>
            loadRemoteModule('remote1', './Module').then(
              (m) => m.RemoteEntryModule
            ),
        },
        {
          path: '',
          component: NxWelcomeComponent,
        },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
