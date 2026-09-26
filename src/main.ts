// The globals the legacy webpack ProvidePlugin supplied ($, jQuery, moment, tinycolor, tv4); first, so every carried library finds them.
import './app-ng/legacy-globals';
// Installs the global `angular` helper object the legacy JS libraries (legacy-lib/) read; first, so it exists before any of them runs.
import './app-ng/feature/components/widget/legacy-helpers';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app-ng/app';
import { appConfig } from './app-ng/app.config';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
