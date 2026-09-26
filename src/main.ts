// The globals the legacy webpack ProvidePlugin supplied ($, jQuery, moment, tinycolor, tv4); first, so every carried library finds them.
import './app/legacy-globals';
// Installs the global `angular` helper object the legacy JS libraries (legacy-lib/) read; first, so it exists before any of them runs.
import './app/feature/components/widget/legacy-helpers';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
