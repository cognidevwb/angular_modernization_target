import { Injectable } from '@angular/core';
import { bindMethods } from '../../../bind-methods';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function DatePickerCtrl(this: any, scope?: any, $mdDialog?: any, $mdMedia?: any, $timeout?: any, currentDate?: any, options?: any) {
    var self: any = this;

    this.date = (window as any).moment(currentDate);
    this.minDate = options.minDate && (window as any).moment(options.minDate).isValid() ? (window as any).moment(options.minDate) : null;
    this.maxDate = options.maxDate && (window as any).moment(options.maxDate).isValid() ? (window as any).moment(options.maxDate) : null;
    this.displayFormat = options.displayFormat || "ddd, MMM DD";
    this.dateFilter = typeof options.dateFilter === 'function' ? options.dateFilter : null;
    this.selectingYear = false;

    // validate min and max date
    if (this.minDate && this.maxDate) {
        if (this.maxDate.isBefore(this.minDate)) {
            this.maxDate = (window as any).moment(this.minDate).add(1, 'days');
        }
    }

    if (this.date) {
        // check min date
        if (this.minDate && this.date.isBefore(this.minDate)) {
            this.date = (window as any).moment(this.minDate);
        }

        // check max date
        if (this.maxDate && this.date.isAfter(this.maxDate)) {
            this.date = (window as any).moment(this.maxDate);
        }
    }

    this.yearItems = {
        currentIndex_: 0,
        PAGE_SIZE: 5,
        START: (self.minDate ? self.minDate.year() : 1900),
        END: (self.maxDate ? self.maxDate.year() : 0),
        getItemAtIndex: function(this: any, index?: any) {
            if(this.currentIndex_ < index)
                this.currentIndex_ = index;

            return this.START + index;
        },
        getLength: function(this: any) {
            return Math.min(
                this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2),
                Math.abs(this.START - this.END) + 1
            );
        }
    };

    scope.$mdMedia = $mdMedia;
    scope.year = this.date.year();

    this.selectYear = function(year?: any) {
        self.date.year(year);
        scope.year = year;
        self.selectingYear = false;
        self.animate();
    };

    this.showYear = function() {
        self.yearTopIndex = (self.date.year() - self.yearItems.START) + Math.floor(self.yearItems.PAGE_SIZE / 2);
        self.yearItems.currentIndex_ = (self.date.year() - self.yearItems.START) + 1;
        self.selectingYear = true;
    };

    this.showCalendar = function() {
        self.selectingYear = false;
    };

    this.cancel = function() {
        $mdDialog.cancel();
    };

    this.confirm = function(this: any) {
        var date: any = this.date;

        if (this.minDate && this.date.isBefore(this.minDate)) {
            date = (window as any).moment(this.minDate);
        }

        if (this.maxDate && this.date.isAfter(this.maxDate)) {
            date = (window as any).moment(this.maxDate);
        }

        $mdDialog.hide(date.toDate());
    };

    this.animate = function() {
        self.animating = true;
        $timeout(() => {}).then(function() {
            self.animating = false;
        })
    };
}

/**
 * Ported from the AngularJS provider `$mdpDatePicker` (module `thingsboard.thirdpartyFix`) in src/app/common/thirdparty-fix.js:19.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Injectable({ providedIn: 'root' })
export class $mdpDatePickerService {
  private readonly __bound = bindMethods(this);

  private LABEL_OK: any = "OK";
  private LABEL_CANCEL: any = "Cancel";
  private DISPLAY_FORMAT: any = "ddd, MMM DD";

  setDisplayFormat(format?: any, ...rest: any[]): any {
    this.DISPLAY_FORMAT = format;
  }

  setOKButtonLabel(label?: any, ...rest: any[]): any {
    this.LABEL_OK = label;
  }

  setCancelButtonLabel(label?: any, ...rest: any[]): any {
    this.LABEL_CANCEL = label;
  }

  $get($mdDialog?: any, ...rest: any[]): any {
    var datePicker: any = (currentDate?: any, options?: any) => {
        if (!(currentDate instanceof Date)) currentDate = Date.now();
        if (!(typeof options === 'object' && options !== null)) options = {};

        options.displayFormat = this.DISPLAY_FORMAT;

        return $mdDialog.show({
            controller:  ['$scope', '$mdDialog', '$mdMedia', '$timeout', 'currentDate', 'options', DatePickerCtrl],
            controllerAs: 'datepicker',
            clickOutsideToClose: true,
            template: '<md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">' +
            '<md-dialog-content layout="row" layout-wrap>' +
            '<div layout="column" layout-align="start center">' +
            '<md-toolbar layout-align="start start" flex class="mdp-datepicker-date-wrapper md-hue-1 md-primary" layout="column">' +
            '<span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{ \'active\': datepicker.selectingYear }">{{ datepicker.date.format(\'YYYY\') }}</span>' +
            '<span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{ \'active\': !datepicker.selectingYear }">{{ datepicker.date.format(datepicker.displayFormat) }}</span> ' +
            '</md-toolbar>' +
            '</div>' +
            '<div>' +
            '<div class="mdp-datepicker-select-year mdp-animation-zoom" layout="column" layout-align="center start" ng-if="datepicker.selectingYear">' +
            '<md-virtual-repeat-container md-auto-shrink md-top-index="datepicker.yearTopIndex">' +
            '<div flex md-virtual-repeat="item in datepicker.yearItems" md-on-demand class="repeated-year">' +
            '<span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple ng-class="{ \'md-primary current\': item == year }">{{ item }}</span>' +
            '</div>' +
            '</md-virtual-repeat-container>' +
            '</div>' +
            '<mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.date" min-date="datepicker.minDate" date-filter="datepicker.dateFilter" max-date="datepicker.maxDate"></mdp-calendar>' +
            '<md-dialog-actions layout="row">' +
            '<span flex></span>' +
            '<md-button ng-click="datepicker.cancel()" aria-label="' + this.LABEL_CANCEL + '">' + this.LABEL_CANCEL + '</md-button>' +
            '<md-button ng-click="datepicker.confirm()" class="md-primary" aria-label="' + this.LABEL_OK + '">' + this.LABEL_OK + '</md-button>' +
            '</md-dialog-actions>' +
            '</div>' +
            '</md-dialog-content>' +
            '</md-dialog>',
            targetEvent: options.targetEvent,
            locals: {
                currentDate: currentDate,
                options: options
            },
            multiple: true
        });
    };

    return datePicker;
  }
}
