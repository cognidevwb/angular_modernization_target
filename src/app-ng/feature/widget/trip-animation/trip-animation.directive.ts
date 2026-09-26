import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { TranslatePipe } from '@ngx-translate/core';

import * as L from 'leaflet';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function tripAnimationController(this: any, $document?: any, $scope?: any, $log?: any, $http?: any, $timeout?: any, $filter?: any, $sce?: any) {
    let vm: any = this;

    vm.initBounds = true;

    vm.markers = [];
    vm.index = 0;
    vm.dsIndex = 0;
    vm.minTime = 0;
    vm.minTimeIndex = 0;
    vm.maxTimeIndex = 0;
    vm.isPlaying = false;
    vm.trackingLine = {
        "type": "FeatureCollection",
        features: []
    };
    vm.speeds = [1, 5, 10, 25];
    vm.speed = 1;
    vm.trips = [];
    vm.activeTripIndex = 0;

    vm.showHideTooltip = showHideTooltip;
    vm.recalculateTrips = recalculateTrips;

    $scope.$watch('vm.ctx', function () {
        if (vm.ctx) {
            vm.utils = vm.ctx.$scope.$injector.get('utils');
            vm.settings = vm.ctx.settings;
            vm.widgetConfig = vm.ctx.widgetConfig;
            vm.data = vm.ctx.data;
            vm.datasources = vm.ctx.datasources;
            configureStaticSettings();
            initialize();
            initializeCallbacks();
        }
    });


    function initializeCallbacks(this: any) {
        vm.self.onDataUpdated = function () {
            createUpdatePath(true);
        };

        vm.self.onResize = function () {
            resize();
        };

        vm.self.typeParameters = function (this: any) {
            return {
                maxDatasources: 1, // Maximum allowed datasources for this widget, -1 - unlimited
                maxDataKeys: -1 //Maximum allowed data keys for this widget, -1 - unlimited
            }
        };
        return true;
    }


    function resize() {
        if (vm.map) {
            vm.map.invalidateSize();
        }
    }

    function initCallback() {
        //createUpdatePath();
        //resize();
    }

    vm.playMove = function (play?: any) {
        if (play && vm.isPlaying) return;
        if (play || vm.isPlaying) vm.isPlaying = true;
        if (vm.isPlaying) {
            moveInc(1);
            vm.timeout = $timeout(function () {
                vm.playMove();
            }, 1000 / vm.speed)
        }
    };

    vm.moveNext = function () {
        vm.stopPlay();
        if (vm.staticSettings.usePointAsAnchor) {
            let newIndex: any = vm.maxTimeIndex;
            for (let index: any = vm.index + 1; index < vm.maxTimeIndex; index++) {
                if (vm.trips.some(function (trip?: any) {
                    return calculateCurrentDate(trip.timeRange, index).hasAnchor;
                })) {
                    newIndex = index;
                    break;
                }
            }
            moveToIndex(newIndex);
        } else moveInc(1);
    };

    vm.movePrev = function () {
        vm.stopPlay();
        if (vm.staticSettings.usePointAsAnchor) {
            let newIndex: any = vm.minTimeIndex;
            for (let index: any = vm.index - 1; index > vm.minTimeIndex; index--) {
                if (vm.trips.some(function (trip?: any) {
                    return calculateCurrentDate(trip.timeRange, index).hasAnchor;
                })) {
                    newIndex = index;
                    break;
                }
            }
            moveToIndex(newIndex);
        } else moveInc(-1);
    };

    vm.moveStart = function () {
        vm.stopPlay();
        moveToIndex(vm.minTimeIndex);
    };

    vm.moveEnd = function () {
        vm.stopPlay();
        moveToIndex(vm.maxTimeIndex);
    };

    vm.stopPlay = function () {
        if (vm.isPlaying) {
            vm.isPlaying = false;
            $timeout.cancel(vm.timeout);
        }
    };

    function moveInc(inc?: any) {
        let newIndex: any = vm.index + inc;
        moveToIndex(newIndex);
    }

    function moveToIndex(newIndex?: any) {
        if (newIndex > vm.maxTimeIndex || newIndex < vm.minTimeIndex) return;
        vm.index = newIndex;
        vm.animationTime = vm.minTime + vm.index * vm.staticSettings.normalizationStep;
        recalculateTrips();
    }

    function recalculateTrips() {
        vm.trips.forEach(function (value?: any) {
            moveMarker(value);
        })
    }

    function initialize() {
        $scope.currentDate = $filter('date')(0, "yyyy.MM.dd HH:mm:ss");

        vm.self.actionSources = [vm.searchAction];
        vm.endpoint = vm.ctx.settings.endpointUrl;
        $scope.title = vm.ctx.widgetConfig.title;
        vm.utils = vm.self.ctx.$scope.$injector.get('utils');

        vm.showTimestamp = vm.settings.showTimestamp !== false;
        vm.ctx.$element = (window as any).angular.element("#trip-animation-map", vm.ctx.$container);
        vm.defaultZoomLevel = 2;
        if (vm.ctx.settings.defaultZoomLevel) {
            if (vm.ctx.settings.defaultZoomLevel > 0 && vm.ctx.settings.defaultZoomLevel < 21) {
                vm.defaultZoomLevel = Math.floor(vm.ctx.settings.defaultZoomLevel);
            }
        }
        vm.dontFitMapBounds = vm.ctx.settings.fitMapBounds === false;
        vm.map = new (window as any).TbOpenStreetMap(vm.ctx.$element, vm.utils, initCallback, vm.defaultZoomLevel, vm.dontFitMapBounds, vm.staticSettings.disableScrollZooming, null, vm.staticSettings.mapProvider);
        vm.map.bounds = vm.map.createBounds();
        vm.map.invalidateSize(true);
        vm.map.bounds = vm.map.createBounds();

        vm.tooltipActionsMap = {};
        var descriptors: any = vm.ctx.actionsApi.getActionDescriptors('tooltipAction');
        descriptors.forEach(function (descriptor?: any) {
            if (descriptor) vm.tooltipActionsMap[descriptor.name] = descriptor;
        });
    }

    function configureStaticSettings() {
        let staticSettings: any = {};
        vm.staticSettings = staticSettings;
        //Calculate General Settings
        staticSettings.normalizationStep = vm.ctx.settings.normalizationStep || 1000;
        staticSettings.buttonColor = (window as any).tinycolor(vm.widgetConfig.color).setAlpha(0.54).toRgbString();
        staticSettings.disabledButtonColor = (window as any).tinycolor(vm.widgetConfig.color).setAlpha(0.3).toRgbString();
        staticSettings.polygonColor = (window as any).tinycolor(vm.ctx.settings.polygonColor).toHexString();
        staticSettings.polygonStrokeColor = (window as any).tinycolor(vm.ctx.settings.polygonStrokeColor).toHexString();
        staticSettings.mapProvider = vm.ctx.settings.mapProvider ? {name: vm.ctx.settings.mapProvider} : {name: "OpenStreetMap.Mapnik"};
        staticSettings.disableScrollZooming = vm.ctx.settings.disableScrollZooming || false;
        staticSettings.latKeyName = vm.ctx.settings.latKeyName || "latitude";
        staticSettings.lngKeyName = vm.ctx.settings.lngKeyName || "longitude";
        staticSettings.polKeyName = vm.ctx.settings.polKeyName || "coordinates";
        staticSettings.rotationAngle = vm.ctx.settings.rotationAngle || 0;
        staticSettings.polygonOpacity = vm.ctx.settings.polygonOpacity || 0.5;
        staticSettings.polygonStrokeOpacity = vm.ctx.settings.polygonStrokeOpacity || 1;
        staticSettings.polygonStrokeWeight = vm.ctx.settings.polygonStrokeWeight || 1;
        staticSettings.showPolygon = vm.ctx.settings.showPolygon || false;
        staticSettings.usePolygonColorFunction = vm.ctx.settings.usePolygonColorFunction || false;
        staticSettings.usePolygonTooltipFunction = vm.ctx.settings.usePolygonTooltipFunction || false;
        staticSettings.displayTooltip = vm.ctx.settings.showTooltip || false;
        staticSettings.defaultZoomLevel = vm.ctx.settings.defaultZoomLevel || true;
        staticSettings.showTooltip = false;
        staticSettings.label = vm.ctx.settings.label || "${entityName}";
        staticSettings.useLabelFunction = vm.ctx.settings.useLabelFunction || false;
        staticSettings.autocloseTooltip = vm.ctx.settings.autocloseTooltip || false;
        staticSettings.pointTooltipOnRightPanel = vm.ctx.settings.pointTooltipOnRightPanel || false;
        staticSettings.usePointAsAnchor = vm.ctx.settings.usePointAsAnchor || false;
        staticSettings.showLabel = vm.ctx.settings.showLabel || false;
        staticSettings.useTooltipFunction = vm.ctx.settings.useTooltipFunction || false;
        staticSettings.usePolylineDecorator = vm.ctx.settings.usePolylineDecorator || false;
        staticSettings.useDecoratorCustomColor = vm.ctx.settings.useDecoratorCustomColor || false;
        staticSettings.decoratorCustomColor = (window as any).tinycolor(vm.ctx.settings.decoratorCustomColor).toHexString();
        staticSettings.decoratorSymbol = vm.ctx.settings.decoratorSymbol || "arrowHead";
        staticSettings.decoratorSymbolSize = vm.ctx.settings.decoratorSymbolSize || 10;
        staticSettings.decoratorOffset = vm.ctx.settings.decoratorOffset || "20px";
        staticSettings.endDecoratorOffset = vm.ctx.settings.endDecoratorOffset || "20px";
        staticSettings.decoratorRepeat = vm.ctx.settings.decoratorRepeat || "20px";
        staticSettings.tooltipPattern = vm.ctx.settings.tooltipPattern || "<span style=\"font-size: 26px; color: #666; font-weight: bold;\">${entityName}</span>\n" +
            "<br/>\n" +
            "<span style=\"font-size: 12px; color: #666; font-weight: bold;\">Time:</span><span style=\"font-size: 12px;\"> ${formattedTs}</span>\n" +
            "<span style=\"font-size: 12px; color: #666; font-weight: bold;\">Latitude:</span> ${latitude:7}\n" +
            "<span style=\"font-size: 12px; color: #666; font-weight: bold;\">Longitude:</span> ${longitude:7}";
        staticSettings.polygonTooltipPattern = vm.ctx.settings.polygonTooltipPattern || "<span style=\"font-size: 26px; color: #666; font-weight: bold;\">${entityName}</span>\n" +
            "<br/>\n" +
            "<span style=\"font-size: 12px; color: #666; font-weight: bold;\">Time:</span><span style=\"font-size: 12px;\"> ${formattedTs}</span>\n";
        staticSettings.tooltipOpacity = (window as any).angular.isNumber(vm.ctx.settings.tooltipOpacity) ? vm.ctx.settings.tooltipOpacity : 1;
        staticSettings.tooltipColor = vm.ctx.settings.tooltipColor ? (window as any).tinycolor(vm.ctx.settings.tooltipColor).toRgbString() : "#ffffff";
        staticSettings.tooltipFontColor = vm.ctx.settings.tooltipFontColor ? (window as any).tinycolor(vm.ctx.settings.tooltipFontColor).toRgbString() : "#000000";
        staticSettings.pathColor = vm.ctx.settings.color ? (window as any).tinycolor(vm.ctx.settings.color).toHexString() : "#ff6300";
        staticSettings.pathWeight = vm.ctx.settings.strokeWeight || 1;
        staticSettings.pathOpacity = vm.ctx.settings.strokeOpacity || 1;
        staticSettings.usePathColorFunction = vm.ctx.settings.useColorFunction || false;
        staticSettings.showPoints = vm.ctx.settings.showPoints || false;
        staticSettings.pointSize = vm.ctx.settings.pointSize || 1;
        staticSettings.markerImageSize = vm.ctx.settings.markerImageSize || 20;
        staticSettings.useMarkerImageFunction = vm.ctx.settings.useMarkerImageFunction || false;
        staticSettings.pointColor = vm.ctx.settings.pointColor ? (window as any).tinycolor(vm.ctx.settings.pointColor).toHexString() : "#ff6300";
        staticSettings.markerImages = vm.ctx.settings.markerImages || [];
        staticSettings.icon = (window as any).L.icon({
            iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAACqCAYAAAA9dtSCAAAAhnpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjadY7LDcAwCEPvTNERCBA+40RVI3WDjl+iNMqp7wCWBZbheu4Ox6AggVRzDVVMJCSopXCcMGIhLGPnnHybSyraNjBNoeGGsg/l8xeV1bWbmGnVU0/KdLqY2HPmH4xUHDVih7S2Gv34q8ULVzos2Vmq5r4AAAoGaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA0LjQuMC1FeGl2MiI+CiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIxNzAiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxNzAiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iMTcwIgogICB0aWZmOkltYWdlSGVpZ2h0PSIxNzAiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiLz4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7hlLlNAAAABHNCSVQICAgIfAhkiAAAIABJREFUeNrtnXmcXFWZ97/Pubeq1+wJSQghhHQ2FUFlFVdUlEXAAVFBQZh3cAy4ESGbCBHIQiTKxHUW4FVwGcAFFMRhkWEZfZkBZJQkTRASIGHJQpbughA46/y+PW3aRelqUKZ3v9uHOnV6TUFOff33nvueeqRV7lvq7fnbY8i0MYQ7C6zQhL2QsyFo5RUvpXKKtHmT29UsxCiFsJJNGtu/4hVwbn17s0xX8Q9UQXhcW7Uj4prIiN8HfPKlZKk5Q1JgxSNXAd5m1Wgi5cRhwOFhlSCK+z9C0/GdN+wLtEZfXZWJyz6b4b7O3EK4MRYU6l2LBb0+aTDvfyKKe1Md6QOTXbNRw+FfWDaZ5jrHiXPzlnpg+3P0T1LStRoR9lCUZNsdZzJbXcvCd8gVsvVMs38fN/nemzhUuKKzC7B7O8s99KyEo0DcJfrpEUnBiV+HcQqOFRvIH19s0z8OF/AZKUFI7cIiSDXtdiHzHkV3Xr14LTf/UlDbY6l88EFcOo7f6cszchhNCiOFdC1cBtWFSxTfbGuY+wPuLdF0oNS/BLK1PIvB2yZgnJIB4mtI8oNXo9RY5nn8jjLDWCoo0hyd5DKUnvOu4TSnW/hd0e3JsGVn/9zdfWFdb2i8fN5r/PFrSuptqK9C56m4uh/pOALVsy3ZrHVLGRe1LEXtJHevYU4XFrHENJ8xoZW9zjt3Uj0Dv4+PsjM7bB1M9SS2rTVh3rHfLBjE/vNTQ+DLVsIiKtb+PrByBBCUyoK1FGqEc7ne3XjV8Fz5xnjT7z5Es2gKm05B/BwmQvhTr/mqrIcVFq5wxDCqhV6TU2f2VqNVaK4mBoMx7wD2xkKmyfKpnG4jGe8h/gu8oPfvzhmwR7SFCXWuXoJmxYVKttHZoqvZtwIfMr3TByRSc5W9nWIPQVGwHnzMoOL9NrTOLcJUKtBSDS+O0f+q1M4CXBB27U6yTHYbTXXqUsr4kd6d9wKyBIeBZAtE0Qcxrbnr32AjeVs/6JR2BR9+HZjS7GXNTUAKZoWzxKHDzuNwR2SDG9tvUXQtDTk46wg3zw/YRAT8U1a/UcxSlKf03YU9d0P9HdCk1YnW6mzZBoBZkoDwZSU3lLzoInBg9GnEmvzR9UgHhc/gjHQr9m2TgOaAKrTKjaFQK5OD5HHDNTvdKGrCr+m+/lSzbnP9GVeYuLwQMEeeNZ6NkEZRMTbz5Bz+FehE7wBZAB4TfobWfKPRlnQdT3zpNAJXBybpQCUZgwuwYmgB49XxOgLZKO+xd9YFAQzHnfwHpbGwQ0nENkNOfmA1sX3ru7X+aWv6bcxeI25MW93Y+7ptRTUC5AAmqjuOQq0+q2Tk6ZoYyOBOsxUvB59tKz0d0fmYqJmuLILlKfMqW+2E4YM/AH1IBQ0hExw+YRUV5+/HAFwc9WaW8FoAAAAASUVORK5CYII=",
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        if (vm.ctx.settings.useCustomProvider && vm.ctx.settings.customProviderTileUrl) {
            staticSettings.mapProvider.name = vm.ctx.settings.customProviderTileUrl;
            staticSettings.mapProvider.isCustom = true;
        }

        if ((window as any).angular.isDefined(vm.ctx.settings.markerImage)) {
            staticSettings.icon = (window as any).L.icon({
                iconUrl: vm.ctx.settings.markerImage,
                iconSize: [staticSettings.markerImageSize, staticSettings.markerImageSize],
                iconAnchor: [(staticSettings.markerImageSize / 2), (staticSettings.markerImageSize / 2)]
            })
        }

        if (staticSettings.usePathColorFunction && (window as any).angular.isDefined(vm.ctx.settings.colorFunction)) {
            staticSettings.colorFunction = new Function('data, dsData, dsIndex', vm.ctx.settings.colorFunction);
        }

        if (staticSettings.usePointAsAnchor && (window as any).angular.isDefined(vm.ctx.settings.pointAsAnchorFunction)) {
            staticSettings.pointAsAnchorFunction = new Function('data, dsData, dsIndex', vm.ctx.settings.pointAsAnchorFunction);
        }

        if (staticSettings.usePolygonTooltipFunction && (window as any).angular.isDefined(vm.ctx.settings.polygonTooltipFunction)) {
            staticSettings.polygonTooltipFunction = new Function('data, dsData, dsIndex', vm.ctx.settings.polygonTooltipFunction);
        }

        if (staticSettings.useLabelFunction && (window as any).angular.isDefined(vm.ctx.settings.labelFunction)) {
            staticSettings.labelFunction = new Function('data, dsData, dsIndex', vm.ctx.settings.labelFunction);
        }

        if (staticSettings.useTooltipFunction && (window as any).angular.isDefined(vm.ctx.settings.tooltipFunction)) {
            staticSettings.tooltipFunction = new Function('data, dsData, dsIndex', vm.ctx.settings.tooltipFunction);
        }

        if (staticSettings.usePolygonColorFunction && (window as any).angular.isDefined(vm.ctx.settings.polygonColorFunction)) {
            staticSettings.polygonColorFunction = new Function('data, dsData, dsIndex', vm.ctx.settings.polygonColorFunction);
        }

        if (staticSettings.useMarkerImageFunction && (window as any).angular.isDefined(vm.ctx.settings.markerImageFunction)) {
            staticSettings.markerImageFunction = new Function('data, images, dsData, dsIndex', vm.ctx.settings.markerImageFunction);
        }

        if (!staticSettings.useMarkerImageFunction &&
            vm.ctx.settings.markerImage !== undefined &&
            vm.ctx.settings.markerImage.length > 0) {
            staticSettings.useMarkerImage = true;
            let url: any = vm.ctx.settings.markerImage;
            let size: any = staticSettings.markerImageSize || 20;
            staticSettings.currentImage = {
                url: url,
                size: size
            };
            vm.utils.loadImageAspect(staticSettings.currentImage.url).then(
                (aspect?: any) => {
                    if (aspect) {
                        let width: any;
                        let height: any;
                        if (aspect > 1) {
                            width = staticSettings.currentImage.size;
                            height = staticSettings.currentImage.size / aspect;
                        } else {
                            width = staticSettings.currentImage.size * aspect;
                            height = staticSettings.currentImage.size;
                        }
                        staticSettings.icon = (window as any).L.icon({
                            iconUrl: staticSettings.currentImage.url,
                            iconSize: [width, height],
                            iconAnchor: [width / 2, height / 2]
                        });
                    }
                    if (vm.trips) {
                        vm.trips.forEach(function (trip?: any) {
                            if (trip.marker) {
                                trip.marker.setIcon(staticSettings.icon);
                            }
                        });
                    }
                }
            )
        }
    }

    function configureTripSettings(trip?: any, apply?: any) {
        trip.settings = {};
        trip.settings.color = calculateColor(trip);
        trip.settings.polygonColor = calculatePolygonColor(trip);
        trip.settings.strokeWeight = vm.staticSettings.pathWeight;
        trip.settings.strokeOpacity = vm.staticSettings.pathOpacity;
        trip.settings.pointColor = vm.staticSettings.pointColor;
        trip.settings.polygonStrokeColor = vm.staticSettings.polygonStrokeColor;
        trip.settings.polygonStrokeOpacity = vm.staticSettings.polygonStrokeOpacity;
        trip.settings.polygonOpacity = vm.staticSettings.polygonOpacity;
        trip.settings.polygonStrokeWeight = vm.staticSettings.polygonStrokeWeight;
        trip.settings.pointSize = vm.staticSettings.pointSize;
        trip.settings.icon = calculateIcon(trip);
        if (apply) {
            $timeout(() => {
                trip.settings.labelText = calculateLabel(trip);
                trip.settings.tooltipText = $sce.trustAsHtml(calculateTooltip(trip));
                trip.settings.polygonTooltipText = $sce.trustAsHtml(calculatePolygonTooltip(trip));
            }, 0, true);
        } else {
            trip.settings.labelText = calculateLabel(trip);
            trip.settings.tooltipText = $sce.trustAsHtml(calculateTooltip(trip));
            trip.settings.polygonTooltipText = $sce.trustAsHtml(calculatePolygonTooltip(trip));
        }
    }

    function calculateLabel(trip?: any) {
        let label: any = '';
        if (vm.staticSettings.showLabel) {
            let labelReplaceInfo: any;
            let labelText: any = vm.staticSettings.label;
            if (vm.staticSettings.useLabelFunction && (window as any).angular.isDefined(vm.staticSettings.labelFunction)) {
                try {
                    labelText = vm.staticSettings.labelFunction(vm.ctx.data, calculateCurrentDate(trip.timeRange, vm.index), trip.dsIndex);
                } catch (e) {
                    labelText = null;
                }
            }
            labelText = vm.utils.createLabelFromDatasource(trip.dataSource, labelText);
            labelReplaceInfo = processPattern(labelText, vm.ctx.datasources, trip.dSIndex);
            label = fillPattern(labelText, labelReplaceInfo, calculateCurrentDate(trip.timeRange, vm.index));
            if (vm.staticSettings.useLabelFunction && vm.staticSettings.labelFunction !== undefined) {
                try {
                    labelText = vm.staticSettings.labelFunction(vm.ctx.data, calculateCurrentDate(trip.timeRange, vm.index), trip.dSIndex);
                } catch (e) {
                    labelText = null;
                }
            }
        }
        return label;
    }

    function calculateTooltip(trip?: any) {
        let tooltip: any = '';
        if (vm.staticSettings.displayTooltip) {
            let tooltipReplaceInfo: any;
            let tooltipText: any = vm.staticSettings.tooltipPattern;
            if (vm.staticSettings.useTooltipFunction && vm.staticSettings.tooltipFunction !== undefined) {
                try {
                    tooltipText = vm.staticSettings.tooltipFunction(vm.ctx.data, calculateCurrentDate(trip.timeRange, vm.index), trip.dSIndex);
                } catch (e) {
                    tooltipText = null;
                }
            }
            tooltipText = vm.utils.createLabelFromDatasource(trip.dataSource, tooltipText);
            tooltipReplaceInfo = processPattern(tooltipText, vm.ctx.datasources, trip.dSIndex);
            tooltip = fillPattern(tooltipText, tooltipReplaceInfo, calculateCurrentDate(trip.timeRange, vm.index));
            tooltip = fillPatternWithActions(tooltip, 'onTooltipAction', null);

        }
        return tooltip;
    }

    function calculatePolygonTooltip(trip?: any) {
        let tooltip: any = '';
        if (vm.staticSettings.displayTooltip) {
            let tooltipReplaceInfo: any;
            let tooltipText: any = vm.staticSettings.polygonTooltipPattern;
            if (vm.staticSettings.usePolygonTooltipFunction && vm.staticSettings.polygonTooltipFunction !== undefined) {
                try {
                    tooltipText = vm.staticSettings.polygonTooltipFunction(vm.ctx.data, calculateCurrentDate(trip.timeRange, vm.index), trip.dSIndex);
                } catch (e) {
                    tooltipText = null;
                }
            }
            tooltipText = vm.utils.createLabelFromDatasource(trip.dataSource, tooltipText);
            tooltipReplaceInfo = processPattern(tooltipText, vm.ctx.datasources, trip.dSIndex);
            tooltip = fillPattern(tooltipText, tooltipReplaceInfo, calculateCurrentDate(trip.timeRange, vm.index));
            tooltip = fillPatternWithActions(tooltip, 'onTooltipAction', null);

        }
        return tooltip;
    }

    function calculatePointTooltip(trip?: any, index?: any) {
        let tooltip: any = '';
        if (vm.staticSettings.displayTooltip) {
            let tooltipReplaceInfo: any;
            let tooltipText: any = vm.staticSettings.tooltipPattern;
            if (vm.staticSettings.useTooltipFunction && vm.staticSettings.tooltipFunction !== undefined) {
                try {
                    tooltipText = vm.staticSettings.tooltipFunction(vm.ctx.data, calculateCurrentDate(trip.timeRange, index), trip.dSIndex);
                } catch (e) {
                    tooltipText = null;
                }
            }
            tooltipText = vm.utils.createLabelFromDatasource(trip.dataSource, tooltipText);
            tooltipReplaceInfo = processPattern(tooltipText, vm.ctx.datasources, trip.dSIndex);
            tooltip = fillPattern(tooltipText, tooltipReplaceInfo, calculateCurrentDate(trip.timeRange, index));
            tooltip = fillPatternWithActions(tooltip, 'onTooltipAction', null);

        }
        return tooltip;
    }

    function calculateColor(trip?: any) {
        let color: any = vm.staticSettings.pathColor;
        let colorFn: any;
        if (vm.staticSettings.usePathColorFunction && vm.staticSettings.colorFunction !== undefined) {
            try {
                colorFn = vm.staticSettings.colorFunction(vm.ctx.data, calculateCurrentDate(trip.timeRange, vm.index), trip.dSIndex);
            } catch (e) {
                colorFn = null;
            }
        }
        if (colorFn && colorFn !== color && trip.polyline) {
            trip.polyline.setStyle({color: colorFn});
        }
        return colorFn || color;
    }

    function calculatePolygonColor(trip?: any) {
        let color: any = vm.staticSettings.polygonColor;
        let colorFn: any;
        if (vm.staticSettings.usePolygonColorFunction && vm.staticSettings.polygonColorFunction !== undefined) {
            try {
                colorFn = vm.staticSettings.polygonColorFunction(vm.ctx.data, calculateCurrentDate(trip.timeRange, vm.index), trip.dSIndex);
            } catch (e) {
                colorFn = null;
            }
        }
        if (colorFn && colorFn !== color && trip.polygon) {
            trip.polygon.setStyle({fillColor: colorFn});
        }
        return colorFn || color;
    }

    function calculateIcon(trip?: any) {
        let icon: any = vm.staticSettings.icon;
        if (vm.staticSettings.useMarkerImageFunction && vm.staticSettings.markerImageFunction !== undefined) {
            let rawIcon: any;
            try {
                rawIcon = vm.staticSettings.markerImageFunction(vm.ctx.data, vm.staticSettings.markerImages, calculateCurrentDate(trip.timeRange, vm.index), trip.dSIndex);
            } catch (e) {
                rawIcon = null;
            }
            if (rawIcon) {
                vm.utils.loadImageAspect(rawIcon).then(
                    (aspect?: any) => {
                        if (aspect) {
                            let width: any;
                            let height: any;
                            if (aspect > 1) {
                                width = rawIcon.size;
                                height = rawIcon.size / aspect;
                            } else {
                                width = rawIcon.size * aspect;
                                height = rawIcon.size;
                            }
                            icon = L.icon({
                                iconUrl: rawIcon,
                                iconSize: [width, height],
                                iconAnchor: [width / 2, height / 2]
                            });
                        }
                        if (trip.marker) {
                            trip.marker.setIcon(icon);
                        }
                    }
                )
            }
        }
        return icon;
    }

    function createUpdatePath(apply?: any) {
        if (vm.trips && vm.map) {
            vm.trips.forEach(function (trip?: any) {
                if (trip.marker) {
                    trip.marker.remove();
                    delete trip.marker;
                }
                if (trip.polyline) {
                    trip.polyline.remove();
                    delete trip.polyline;
                }
                if (trip.polylineDecorator) {
                    trip.polylineDecorator.remove();
                    delete trip.polylineDecorator;
                }
                if (trip.polygon) {
                    trip.polygon.remove();
                    delete trip.polygon;
                }
                if (trip.points && trip.points.length) {
                    trip.points.forEach(function (point?: any) {
                        point.remove();
                    });
                    delete trip.points;
                }
            });
            vm.initBounds = true;
        }
        createNormalizedTime(vm.data, vm.staticSettings.normalizationStep);
        createNormalizedTrips(vm.datasources, vm.data, vm.staticSettings.normalizationStep);
        createTripsOnMap(apply);
        if (vm.initBounds && !vm.initTrips) {
            vm.trips.forEach(function (trip?: any) {
                vm.map.extendBounds(vm.map.bounds, trip.polyline);
                vm.initBounds = !vm.datasources.every(
                    function (ds?: any) {
                        return ds.dataReceived === true;
                    });
                vm.initTrips = vm.trips.every(function (trip?: any) {
                    return trip.marker !== undefined && trip.polyline !== undefined;
                });
            });

            vm.map.fitBounds(vm.map.bounds);
        }
    }

    function isNumber(value?: any): boolean {
        return typeof value === 'number' && !isNaN(value);
    }

    function padValue(val: any, dec: any): string {
        let strVal: string;
        const n = Math.pow(10, dec);
        val = Math.round(val * n) / n;
        strVal = val.toString();
        if (dec > 0) {
            let dotPosition = strVal.indexOf('.');
            if (dotPosition === -1) {
                strVal += '.';
                dotPosition = strVal.length - 1;
            }
            const cnt = dec - (strVal.length - dotPosition - 1);
            for (let i = 0; i < cnt; i++) {
                strVal += '0';
            }
        }
        return strVal;
    }

    function processPattern(pattern?: any, datasources?: any, dsIndex?: any) {
        let replaceInfo: any = {};
        replaceInfo.variables = [];
        let reg: any = /\$\{([^}]*)\}/g;
        let match: any = reg.exec(pattern);
        while (match !== null) {
            let variableInfo: any = {};
            variableInfo.variable = match[0];
            let label: any = match[1];
            let valDec: any = 2;
            if (label.indexOf(':') > -1) {
                let labelParts: any = label.split(':');
                label = labelParts[0];
                valDec = parseFloat(labelParts[1]);
            }
            variableInfo.valDec = valDec;
            variableInfo.dataKeyIndex = -1;
            if (datasources && datasources[dsIndex]) {
                let datasource: any = datasources[dsIndex];
                for (let i: any = 0; i < datasource.dataKeys.length; i++) {
                    let dataKey: any = datasource.dataKeys[i];
                    if (dataKey.label === label) {
                        variableInfo.dataKeyIndex = i;
                        break;
                    }
                }
            }
            replaceInfo.variables.push(variableInfo);
            match = reg.exec(pattern);
        }
        return replaceInfo;
    }

    function fillPatternWithActions(pattern?: any, actionFunctionName?: any, actionHandler?: any) {
        return pattern;
    }

    function fillPattern(pattern?: any, replaceInfo?: any, currentNormalizedValue?: any) {
        let text: any = structuredClone(pattern);
        let reg: any = /\$\{([^}]*)\}/g;
        if (replaceInfo) {
            for (let v: any = 0; v < replaceInfo.variables.length; v++) {
                let variableInfo: any = replaceInfo.variables[v];
                let label: any = reg.exec(pattern)[1].split(":")[0];
                let txtVal: any = '';
                if (label.length > -1 && currentNormalizedValue[label] !== undefined) {
                    let varData: any = currentNormalizedValue[label];
                    if (isNumber(varData)) {
                        txtVal = padValue(varData, variableInfo.valDec, 0);
                    } else {
                        txtVal = varData;
                    }
                }
                text = text.split(variableInfo.variable).join(txtVal);
            }
        }
        return text;
    }

    function createNormalizedTime(data?: any, step?: any) {
        if (!step) step = 1000;
        let max_time: any = -Infinity;
        let min_time: any = Infinity;
        if (data) {
            for (let i: any = 0; i < data.length; i++) {
                for (let j: any = 0; j < data[i].data.length; j++) {
                    if (max_time < data[i].data[j][0]) {
                        max_time = data[i].data[j][0]
                    }
                    if (min_time > data[i].data[j][0]) {
                        min_time = data[i].data[j][0];
                    }
                }
            }
        }
        vm.minTime = vm.animationTime = min_time;
        if(min_time === Infinity){
            vm.animationTime = null;
        } else {
            vm.animationTime = min_time
        }
        vm.maxTimeIndex = Math.ceil((max_time - min_time) / step);
        if (vm.index < vm.minTimeIndex) {
            vm.index = vm.minTimeIndex;
        } else if (vm.index > vm.maxTimeIndex) {
            vm.index = vm.maxTimeIndex;
        }
    }

    function createNormalizedTrips(dataSources?: any, data?: any, step?: any) {
        vm.trips = [];
        step = step || 1000;
        if (dataSources && data) {
            for (let i: any = 0; i < dataSources.length; i++) {
                vm.trips.push({
                    dataSource: dataSources[i],
                    dSIndex: i,
                    timeRange: {}
                })
            }

            for (let i: any = 0; i < data.length; i++) {
                let ds: any = data[i].datasource;
                let tripIndex: any = vm.trips.findIndex(function (el?: any) {
                    return el.dataSource.entityId === ds.entityId;
                });
                if (tripIndex > -1) {
                    createNormalizedValue(data[i].data, data[i].dataKey.label, vm.trips[tripIndex].timeRange, step);
                }
            }
        }

        createNormalizedLatLngs();
    }

    function createNormalizedValue(dataArray?: any, dataKey?: any, timeRange?: any, step?: any) {
        for (let i: any = 0; i < dataArray.length; i++) {
            let normalizeTime: any = vm.minTime + Math.ceil((dataArray[i][0] - vm.minTime) / step) * step;
            timeRange[normalizeTime] = timeRange[normalizeTime] || {};
            timeRange[normalizeTime][dataKey] = dataArray[i][1];
        }
    }

    function createNormalizedLatLngs() {
        vm.trips.forEach(function (item?: any) {
            item.latLngs = [];
            for (let timestamp in item.timeRange) {
                if(Object.prototype.hasOwnProperty.call(item.timeRange, timestamp)) {
                    let lat: any = item.timeRange[timestamp][vm.staticSettings.latKeyName];
                    let lng: any = item.timeRange[timestamp][vm.staticSettings.lngKeyName];
                    if (lat && lng && vm.map) {
                        item.timeRange[timestamp].latLng = vm.map.createLatLng(lat, lng);
                    }
                    item.latLngs.push(item.timeRange[timestamp].latLng);
                }
            }
        });
    }

    function createPointPopup(point?: any, index?: any, trip?: any) {
        let popup: any = L.popup();
        popup.setContent(calculatePointTooltip(trip, index));
        point.bindPopup(popup, {autoClose: vm.staticSettings.autocloseTooltip, closeOnClick: false});
        return popup;
    }

    function createTripsOnMap(apply?: any) {
        if (vm.trips.length > 0) {
            vm.trips.forEach(function (trip?: any) {
                configureTripSettings(trip, apply);
                if (Object.keys(trip.timeRange).length > 0 && trip.latLngs.every((el: any) => el !== undefined)) {
                    if (vm.staticSettings.showPoints) {
                        trip.points = [];
                        Object.keys(trip.timeRange).forEach(function (tRange?: any, index?: any) {
                            if (trip.timeRange[tRange] && trip.timeRange[tRange].latLng
                                && (!vm.staticSettings.usePointAsAnchor || vm.staticSettings.pointAsAnchorFunction(vm.ctx.data, trip.timeRange[tRange], trip.dSIndex))) {
                                let point: any = L.circleMarker(trip.timeRange[tRange].latLng, {
                                    color: trip.settings.pointColor,
                                    radius: trip.settings.pointSize
                                }).addTo(vm.map.map);
                                if (vm.staticSettings.pointTooltipOnRightPanel) {
                                    point.popup = createPointPopup(point, index, trip);
                                } else {
                                    point.on('click', function () {
                                        showHidePointTooltip(calculatePointTooltip(trip, index), index);
                                    });
                                }
                                if (vm.staticSettings.usePointAsAnchor) trip.timeRange[tRange].hasAnchor = true;
                                trip.points.push(point);
                            }
                        });
                    }

                    if (trip.marker === undefined) {
                        trip.polyline = vm.map.createPolyline(trip.latLngs, trip.settings);
                        if (vm.staticSettings.usePolylineDecorator) {
                            trip.polylineDecorator = L.polylineDecorator(trip.polyline, {
                                patterns: [
                                    {
                                        offset: vm.staticSettings.decoratorOffset,
                                        endOffset: vm.staticSettings.endDecoratorOffset,
                                        repeat: vm.staticSettings.decoratorRepeat,
                                        symbol: L.Symbol[vm.staticSettings.decoratorSymbol]({
                                            pixelSize: vm.staticSettings.decoratorSymbolSize,
                                            polygon: false,
                                            pathOptions: {
                                                color: vm.staticSettings.useDecoratorCustomColor ? vm.staticSettings.decoratorCustomColor : trip.settings.color,
                                                stroke: true
                                            }
                                        })
                                    }
                                ],
                                interactive: false,
                            }).addTo(vm.map.map);
                        }
                    }


                    if (trip.timeRange && Object.keys(trip.timeRange).length && trip.marker === undefined) {
                        trip.marker = L.marker(calculateCurrentDate(trip.timeRange, vm.index).latLng);
                        trip.marker.setZIndexOffset(1000);
                        trip.marker.setIcon(vm.staticSettings.icon);
                        trip.marker.setRotationOrigin('center center');
                        trip.marker.on('click', function () {
                            showHideTooltip(trip);
                        });
                        trip.marker.addTo(vm.map.map);
                        moveMarker(trip);
                    }
                }

                if (vm.staticSettings.showPolygon && calculateCurrentDate(trip.timeRange, vm.index)[vm.staticSettings.polKeyName] !== undefined) {
                    let polygonSettings: any = {
                        fill: true,
                        fillColor: trip.settings.polygonColor,
                        color: trip.settings.polygonStrokeColor,
                        weight: trip.settings.polygonStrokeWeight,
                        fillOpacity: trip.settings.polygonOpacity,
                        opacity: trip.settings.polygonStrokeOpacity
                    };
                    let polygonLatLngsRaw: any = mapPolygonArray(JSON.parse(calculateCurrentDate(trip.timeRange, vm.index)[vm.staticSettings.polKeyName]));
                    trip.polygon = L.polygon(polygonLatLngsRaw, polygonSettings).addTo(vm.map.map);
                    trip.polygon.on('click',function(){showHidePolygonTooltip(trip)});
                }
            });
        }
    }

    function calculateCurrentDate(tripTimeRange?: any, index?: any) {
        let time: any = vm.minTime + index * vm.staticSettings.normalizationStep;
        if (Object.hasOwnProperty.call(tripTimeRange, time)) {
            return tripTimeRange[time];
        } else {
            let timeInterval: any = Object.keys(tripTimeRange);
            for (let i: any = 1; i < timeInterval.length; i++) {
                if (timeInterval[i - 1] < time && timeInterval[i] > time) {
                    let calcPosition: any = structuredClone(tripTimeRange[timeInterval[i - 1]]);
                    let startLatLng: any = tripTimeRange[timeInterval[i - 1]].latLng;
                    let finishLatLng: any = tripTimeRange[timeInterval[i]].latLng;
                    let percentRouteComplete: any = (time - timeInterval[i - 1]) / (timeInterval[i] - timeInterval[i - 1]);
                    calcPosition[vm.staticSettings.latKeyName] = startLatLng.lat + (finishLatLng.lat - startLatLng.lat) * percentRouteComplete;
                    calcPosition[vm.staticSettings.lngKeyName] = startLatLng.lng + (finishLatLng.lng - startLatLng.lng) * percentRouteComplete;
                    calcPosition.latLng = vm.map.createLatLng(calcPosition[vm.staticSettings.latKeyName], calcPosition[vm.staticSettings.lngKeyName]);
                    calcPosition.angle = vm.staticSettings.rotationAngle + findAngle(startLatLng, finishLatLng);
                    return calcPosition;
                }
            }
        }
        return {};
    }

    function findAngle(startPoint?: any, endPoint?: any) {
        let angle: any = -Math.atan2(endPoint.lat - startPoint.lat, endPoint.lng - startPoint.lng);
        angle = angle * 180 / Math.PI;
        return parseInt(angle.toFixed(2));
    }

    function mapPolygonArray(rawArray?: any) {
        return rawArray.map(function (el?: any) {
            if (el.length === 2) {
                if (!angular.isNumber(el[0]) && !angular.isNumber(el[1])) {
                    return el.map(function (subEl?: any) {
                        return mapPolygonArray(subEl);
                    })
                } else {
                    return vm.map.createLatLng(el[0], el[1]);
                }
            } else if (el.length > 2) {
                return mapPolygonArray(el);
            } else {
                return vm.map.createLatLng(false);
            }
            return undefined;
        });
    }

    function moveMarker(trip?: any) {
        let postionMarker: any = calculateCurrentDate(trip.timeRange, vm.index);
        if (angular.isDefined(postionMarker)) {
            if (angular.isDefined(trip.marker)) {
                trip.markerAngleIsSet = true;
                trip.marker.setLatLng(postionMarker.latLng);
                trip.marker.setRotationAngle(postionMarker.angle);
                trip.marker.update();
            } else {
                if (trip.timeRange && trip.timeRange.length) {
                    trip.marker = L.marker(postionMarker.latLng);
                    trip.marker.setZIndexOffset(1000);
                    trip.marker.setIcon(vm.staticSettings.icon);
                    trip.marker.setRotationOrigin('center center');
                    trip.marker.on('click', function () {
                        showHideTooltip(trip);
                    });
                    trip.marker.addTo(vm.map.map);
                    trip.marker.update();
                }
            }
        }
        configureTripSettings(trip);
    }


    function showHideTooltip(trip?: any) {
        if (vm.staticSettings.displayTooltip) {
            if (vm.staticSettings.showTooltip && trip && (vm.activeTripIndex !== trip.dSIndex || vm.staticSettings.tooltipMarker !== 'marker')) {
                vm.staticSettings.showTooltip = true;
                vm.staticSettings.tooltipMarker = 'marker';
            } else {
                vm.staticSettings.showTooltip = !vm.staticSettings.showTooltip;
            }
        }
        if (trip && vm.activeTripIndex !== trip.dSIndex) vm.activeTripIndex = trip.dSIndex;
        if (vm.trips.length) {
            vm.mainTooltip = vm.trips[vm.activeTripIndex].settings.tooltipText;
        }
    }

    function showHidePointTooltip(text?: any, index?: any) {
        if (vm.staticSettings.displayTooltip) {
            if (vm.staticSettings.tooltipMarker && vm.staticSettings.tooltipMarker.includes('point')) {
               if (vm.staticSettings.tooltipMarker === 'point' + index) {
                   vm.staticSettings.showTooltip = !vm.staticSettings.showTooltip;
               } else {
                   vm.staticSettings.showTooltip = true;
                   vm.mainTooltip = $sce.trustAsHtml(text);
                   vm.staticSettings.tooltipMarker = 'point' + index;
               }
            } else {
                vm.staticSettings.showTooltip = true;
                vm.mainTooltip = $sce.trustAsHtml(text);
                vm.staticSettings.tooltipMarker = 'point' + index;
            }
        }
    }

    function showHidePolygonTooltip(trip?: any) {
        if (vm.staticSettings.displayTooltip) {
            if (vm.staticSettings.showTooltip && trip && (vm.activeTripIndex !== trip.dSIndex || vm.staticSettings.tooltipMarker !== 'polygon')) {
                vm.staticSettings.showTooltip = true;
                vm.staticSettings.tooltipMarker = 'polygon';
            } else {
                vm.staticSettings.showTooltip = !vm.staticSettings.showTooltip;
            }
        }
        if (trip && vm.activeTripIndex !== trip.dSIndex) vm.activeTripIndex = trip.dSIndex;
        vm.mainTooltip = vm.trips[vm.activeTripIndex].settings.polygonTooltipText;
    }
}

/**
 * Ported from the AngularJS directive `tripAnimation` (module `thingsboard.widgets.tripAnimation`) in src/app/widget/lib/tripAnimation/trip-animation-widget.js:87.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'trip-animation',
  standalone: true,
  imports: [TranslatePipe, MatSliderModule, MatSelectModule, MatIconModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './trip-animation.directive.html',
})
export class TripAnimationDirective {
  readonly ctx = model<any>();
  readonly self = model<any>();

  // TODO(port): elements not resolved to a component: md-slider-container
  // TODO(port): AngularJS built-in filters in the template: date — use Angular pipes

  restrict: any = "E";
  scope: any = true;
  bindToController: any;
  controller: any = tripAnimationController;
  controllerAs: any;
  templateUrl: any = template;

  constructor() {
    let vm = this;
    let self = this;
    this.bindToController = {
            ctx: '=',
            self: '='
        };
    this.controllerAs = 'vm';
  }
}
