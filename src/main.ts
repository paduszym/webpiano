import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {ngProdModeEnabled} from './env/env';

if (ngProdModeEnabled) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
