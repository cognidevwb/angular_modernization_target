import { Injectable } from '@angular/core';
import { bindMethods } from '../../../legacy-injector';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function TimePickerCtrl(this: any, $scope?: any, $mdDialog?: any, time?: any, autoSwitch?: any, $mdMedia?: any) {
    var self: any = this;
    this.VIEW_HOURS = 1;
    this.VIEW_MINUTES = 2;
    this.currentView = this.VIEW_HOURS;
    this.time = moment(time);
    this.autoSwitch = !!autoSwitch;

    this.clockHours = parseInt(this.time.format("h"));
    this.clockMinutes = parseInt(this.time.minutes());

    $scope.$mdMedia = $mdMedia;

    this.switchView = function() {
        self.currentView = self.currentView == self.VIEW_HOURS ? self.VIEW_MINUTES : self.VIEW_HOURS;
    };

    this.setAM = function() {
        if(self.time.hours() >= 12)
            self.time.hour(self.time.hour() - 12);
    };

    this.setPM = function() {
        if(self.time.hours() < 12)
            self.time.hour(self.time.hour() + 12);
    };

    this.cancel = function() {
        $mdDialog.cancel();
    };

    this.confirm = function(this: any) {
        $mdDialog.hide(this.time.toDate());
    };
}

/**
 * Ported from the AngularJS provider `$mdpTimePicker` (module `thingsboard.thirdpartyFix`) in src/app/common/thirdparty-fix.js:19.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Injectable({ providedIn: 'root' })
export class $mdpTimePickerService {
  private readonly __bound = bindMethods(this);

  private LABEL_OK: any = "OK";
  private LABEL_CANCEL: any = "Cancel";

  setOKButtonLabel(label?: any, ...rest: any[]): any {
    this.LABEL_OK = label;
  }

  setCancelButtonLabel(label?: any, ...rest: any[]): any {
    this.LABEL_CANCEL = label;
  }

  $get($mdDialog?: any, ...rest: any[]): any {
    var timePicker: any = (time?: any, options?: any) => {
        if(!(time instanceof Date)) time = Date.now();
        if (!angular.isObject(options)) options = {};

        return $mdDialog.show({
            controller:  ['$scope', '$mdDialog', 'time', 'autoSwitch', '$mdMedia', TimePickerCtrl],
            controllerAs: 'timepicker',
            clickOutsideToClose: true,
            template: '<md-dialog aria-label="" class="mdp-timepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">' +
            '<md-dialog-content layout-gt-xs="row" layout-wrap>' +
            '<md-toolbar layout-gt-xs="column" layout-xs="row" layout-align="center center" flex class="mdp-timepicker-time md-hue-1 md-primary">' +
            '<div class="mdp-timepicker-selected-time">' +
            '<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_HOURS }" ng-click="timepicker.currentView = timepicker.VIEW_HOURS">{{ timepicker.time.format("h") }}</span>:' +
            '<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_MINUTES }" ng-click="timepicker.currentView = timepicker.VIEW_MINUTES">{{ timepicker.time.format("mm") }}</span>' +
            '</div>' +
            '<div layout="column" class="mdp-timepicker-selected-ampm">' +
            '<span ng-click="timepicker.setAM()" ng-class="{ \'active\': timepicker.time.hours() < 12 }">AM</span>' +
            '<span ng-click="timepicker.setPM()" ng-class="{ \'active\': timepicker.time.hours() >= 12 }">PM</span>' +
            '</div>' +
            '</md-toolbar>' +
            '<div>' +
            '<div class="mdp-clock-switch-container" ng-switch="timepicker.currentView" layout layout-align="center center">' +
            '<mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="hours" ng-switch-when="1"></mdp-clock>' +
            '<mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="minutes" ng-switch-when="2"></mdp-clock>' +
            '</div>' +

            '<md-dialog-actions layout="row">' +
            '<span flex></span>' +
            '<md-button ng-click="timepicker.cancel()" aria-label="' + this.LABEL_CANCEL + '">' + this.LABEL_CANCEL + '</md-button>' +
            '<md-button ng-click="timepicker.confirm()" class="md-primary" aria-label="' + this.LABEL_OK + '">' + this.LABEL_OK + '</md-button>' +
            '</md-dialog-actions>' +
            '</div>' +
            '</md-dialog-content>' +
            '</md-dialog>',
            targetEvent: options.targetEvent,
            locals: {
                time: time,
                autoSwitch: options.autoSwitch
            },
            multiple: true
        });
    };

    return timePicker;
  }
}
