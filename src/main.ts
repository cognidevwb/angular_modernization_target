import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app-ng/app';
import { appConfig } from './app-ng/app.config';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
