// Installs the global `angular` helper object the legacy JS libraries (legacy-lib/) read; first, so it exists before any of them runs.
import './app-ng/feature/components/widget/legacy-helpers';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app-ng/app';
import { appConfig } from './app-ng/app.config';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
