import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import widgetTpl from '../../../../app/widget/lib/date-range-navigator/date-range-navigator.tpl.html';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function DateRangeNavigatorWidgetController(this: any, $scope?: any, $window?: any, $filter?: any) {

    let vm: any = this,
        hour: any = 3600000,
        day: any = 86400000,
        week: any = 604800000,
        month: any = 2629743000,
        words: any = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
            "Ok",
            'Custom Date Range',
            'Date Range Template',
            'Today',
            'Yesterday',
            'This Week',
            'Last Week',
            'Month',
            'This Month',
            'Last Month',
            'Year',
            'This Year',
            'Last Year'
        ],
        firstUpdate: any = true;

    $scope.datesMap = {
        hour: {
            ts: hour,
            label: "Hour"
        },
        day: {
            ts: day,
            label: "Day"
        },
        week: {
            ts: week,
            label: "Week"
        },
        twoWeeks: {
            ts: week * 2,
            label: "2 weeks"
        },
        month: {
            ts: month,
            label: "Month"
        },
        threeMonths: {
            ts: month * 3,
            label: "3 months"
        },
        sixMonths: {
            ts: month * 6,
            label: "6 months"
        }
    };
    $scope.advancedModel = {};
    $scope.endRestrictionDate = Date.now();
    $scope.localizationMap = getLocalizationMap();

    $scope.changeInterval = changeInterval;
    $scope.goForth = goForth;
    $scope.goBack = goBack;
    $scope.triggerChange = triggerChange;

    $scope.$watch('vm.ctx', function () {
        if (vm.ctx && vm.ctx.dashboard.dashboardTimewindow) {
            $scope.settings = vm.ctx.widgetConfig.settings;
            let selection: any;
            if ($scope.settings.useSessionStorage) {
                selection = readFromStorage('date-range');
            }
            if (selection) {
                $scope.advancedModel = {
                    selectedTemplateName: selection.name,
                    dateStart: selection.start,
                    dateEnd: selection.end
                };
            } else {
                let end: any = new Date();
                end.setHours(23, 59, 59, 999);

                let formattedDate: any = getFormattedDate(
                    (end.getTime() + 1) - $scope.datesMap[$scope.settings.initialInterval || "week"].ts,
                    end.getTime()
                );
                $scope.advancedModel = formattedDate;
            }
            $scope.selectedStepSize = $scope.datesMap[$scope.settings.stepSize || "day"].ts;

            widgetContextTimewindowSync();
        }
    });

    $scope.$on('dashboardTimewindowChanged', function () {
        $scope.dashboardTimewindowChanged = true;
        widgetContextTimewindowSync();
    });

    function getLocalizationMap() {
        let result: any = {};

        words.forEach(function (key?: any) {
            result[key] = $filter('translate')('widgets.date-range-navigator.localizationMap.' + key);
        });

        return result;
    }

    function triggerChange() {
        updateTimewindow($scope.advancedModel.dateStart.getTime(), $scope.advancedModel.dateEnd.getTime() + day - 1);
    }

    function widgetContextTimewindowSync() {
        if (vm.ctx && vm.ctx.dashboardTimewindow && $scope.dashboardTimewindowChanged &&
            vm.ctx.dashboard.dashboardTimewindow.history &&
            vm.ctx.dashboard.dashboardTimewindow.history.fixedTimewindow) {


            if (!firstUpdate) {
                updateAdvancedModel();
            }
            updateDateInterval();
            if ($scope.settings.useSessionStorage) {
                updateStorageDate();
            }
            if (firstUpdate) {
                updateTimewindow($scope.advancedModel.dateStart.getTime(), $scope.advancedModel.dateEnd.getTime());
                firstUpdate = false;
            }
        }
    }

    function getFormattedDate(startTime?: any, endTime?: any) {
        var template: any;

        let startDate: any = new Date(startTime);
        let endDate: any = new Date(endTime);

        if (getDateDiff(startDate, endDate) === 0) {
            template = $filter('date')(startDate, 'dd MMM yyyy');
        } else {
            template = $filter('date')(
                startDate,
                'dd' + (startDate.getMonth() !== endDate.getMonth() || startDate.getFullYear() !== endDate.getFullYear() ? ' MMM' : '') + (startDate.getFullYear() !== endDate.getFullYear() ? ' yyyy' : '')
                )
                + ' - ' +
                $filter('date')(
                    endDate,
                    'dd MMM yyyy'
                );
        }

        return {
            selectedTemplateName: template,
            dateStart: startDate,
            dateEnd: endDate
        };
    }

    function readFromStorage(itemKey?: any) {
        if ($window.sessionStorage.getItem(itemKey)) {
            let selection: any = angular.fromJson($window.sessionStorage.getItem(itemKey));
            selection.start = new Date(parseInt(selection.start));
            selection.end = new Date(parseInt(selection.end));
            return selection;
        }

        return undefined;
    }

    function goForth() {
        let startTime: any = vm.ctx.dashboard.dashboardTimewindow.history ?
            vm.ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.startTimeMs :
            $scope.advancedModel.dateStart.getTime();
        let endTime: any = vm.ctx.dashboard.dashboardTimewindow.history ?
            vm.ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.endTimeMs :
            $scope.advancedModel.dateEnd.getTime();
        updateTimewindow(startTime + $scope.selectedStepSize, endTime + $scope.selectedStepSize);
    }

    function goBack() {
        let startTime: any = vm.ctx.dashboard.dashboardTimewindow.history ?
            vm.ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.startTimeMs :
            $scope.advancedModel.dateStart.getTime();
        let endTime: any = vm.ctx.dashboard.dashboardTimewindow.history ?
            vm.ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.endTimeMs :
            $scope.advancedModel.dateEnd.getTime();
        updateTimewindow(startTime - $scope.selectedStepSize, endTime - $scope.selectedStepSize);
    }

    function changeInterval() {
        let endTime: any = vm.ctx.dashboard.dashboardTimewindow.history ?
            vm.ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.endTimeMs :
            $scope.advancedModel.dateEnd.getTime();
        updateTimewindow(endTime - $scope.selectedDateInterval / 2, endTime + $scope.selectedDateInterval / 2);
    }

    function getDateDiff(date1?: any, date2?: any) {
        if (!date1 || !date2) return undefined;
        var _d1: any = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()),
            _d2: any = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        return _d2 - _d1;
    }

    function updateTimewindow(startTime?: any, endTime?: any) {
        vm.ctx.dashboard.dashboardTimewindowApi.onUpdateTimewindow(startTime, endTime, 10);
    }

    function updateDateInterval() {
        let interval: any = $scope.advancedModel.dateEnd.getTime() - $scope.advancedModel.dateStart.getTime();

        for (let i in $scope.datesMap) {
            if (Object.prototype.hasOwnProperty.call($scope.datesMap, i)) {
                if ($scope.datesMap[i].ts === interval || $scope.datesMap[i].ts === interval + 1 || $scope.datesMap[i].ts === interval - 1) {
                    $scope.selectedDateInterval = $scope.datesMap[i].ts;
                    $scope.customInterval = false;
                    return;
                }
            }
        }

        $scope.selectedDateInterval = interval;
        $scope.customInterval = {ts: interval, label: "Custom interval"};
    }

    function updateAdvancedModel() {
        $scope.advancedModel = getFormattedDate(vm.ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.startTimeMs, vm.ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.endTimeMs);
    }

    function updateStorageDate() {
        saveIntoStorage('date-range', {
            start: $scope.advancedModel.dateStart.getTime(),
            end: $scope.advancedModel.dateEnd.getTime(),
            name: $scope.advancedModel.selectedTemplateName
        });
    }

    function saveIntoStorage(keyName?: any, selection?: any) {
        if (selection) {
            $window.sessionStorage.setItem(keyName, angular.toJson(selection));
        }
    }
}

/**
 * Ported from the AngularJS directive `dateRangeNavigatorWidget` (module `thingsboard.widgets.dateRangeNavigator`) in src/app/widget/lib/date-range-navigator/date-range-navigator.js:21.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'date-range-navigator-widget',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './date-range-navigator-widget.directive.html',
})
export class DateRangeNavigatorWidgetDirective {
  readonly tableId = model<any>();
  readonly ctx = model<any>();

  // TODO(port): elements not resolved to a component: md-date-range

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            tableId: '=',
            ctx: '='
        };
  controller: any = DateRangeNavigatorWidgetController;
  controllerAs: any;
  templateUrl: any = widgetTpl;
  advancedModel: any;
  selectedDateInterval: any;
  selectedStepSize: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }

  /** The keys of a `(k, v) in obj` repeat, in the object's own order. */
  protected __keys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
