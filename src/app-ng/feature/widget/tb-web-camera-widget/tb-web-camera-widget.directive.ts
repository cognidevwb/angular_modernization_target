import { Component, model } from '@angular/core';
import webCameraWidgetTemplate from '../../../../app/widget/lib/web-camera-input-widget.tpl.html?raw';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function WebCameraWidgetController(this: any, $element?: any, $scope?: any, $window?: any, types?: any, utils?: any, attributeService?: any, Fullscreen?: any) {
    let vm: any = this;

    vm.videoInput = [];
    vm.videoDevice = "";
    vm.previewPhoto = "";
    vm.isShowCamera = false;
    vm.isPreviewPhoto = false;

    let streamDevice: any = null;
    let indexWebCamera: any = 0;
    let videoElement: any = null;
    let canvas: any = null;
    let photoCamera: any = null;
    let dataKeyType: any = "";
    let width: any = 640;
    let height: any = 480;

    const DEFAULT_IMAGE_TYPE: any = 'image/jpeg';
    const DEFAULT_IMAGE_QUALITY: any = 0.92;

    vm.getStream = getStream;
    vm.createPhoto = createPhoto;
    vm.takePhoto = takePhoto;
    vm.switchWebCamera = switchWebCamera;
    vm.cancelPhoto = cancelPhoto;
    vm.closeCamera = closeCamera;
    vm.savePhoto = savePhoto;

    vm.isEntityDetected = false;
    vm.dataKeyDetected = false;
    vm.isCameraSupport = false;
    vm.isDeviceDetect = false;

    $scope.$watch('vm.ctx', function () {
        if (vm.ctx && vm.ctx.datasources && vm.ctx.datasources.length) {
            let datasource: any = vm.ctx.datasources[0];
            if (datasource.type === types.datasourceType.entity) {
                if (datasource.entityType && datasource.entityId) {
                    if (vm.ctx.settings.widgetTitle && vm.ctx.settings.widgetTitle.length) {
                        $scope.titleTemplate = utils.customTranslation(vm.ctx.settings.widgetTitle, vm.ctx.settings.widgetTitle);
                    } else {
                        $scope.titleTemplate = vm.ctx.widgetConfig.title;
                    }
                    vm.isEntityDetected = true;
                }
            }
            width = vm.ctx.settings.maxWidth ? vm.ctx.settings.maxWidth : 640;
            height = vm.ctx.settings.maxHeight ? vm.ctx.settings.maxWidth : 480;
            if (datasource.dataKeys.length) {
                $scope.currentKey = datasource.dataKeys[0].name;
                dataKeyType = datasource.dataKeys[0].type;
                vm.dataKeyDetected = true;
            }
            if (hasGetUserMedia()) {
                vm.isCameraSupport = true;
                getDevices().then(gotDevices).then(() => {
                    vm.isDeviceDetect = !!vm.videoInput.length;
                });
            }
        }
    });

    function getVideoAspectRatio() {
        if (videoElement.videoWidth && videoElement.videoWidth > 0 &&
            videoElement.videoHeight && videoElement.videoHeight > 0) {
            return videoElement.videoWidth / videoElement.videoHeight;
        }
        return width / height;
    }

    vm.videoWidth = function() {
        const videoRatio: any = getVideoAspectRatio();
        return Math.min(width, height * videoRatio);
    }

    vm.videoHeight = function() {
        const videoRatio: any = getVideoAspectRatio();
        return Math.min(height, width / videoRatio);
    }

    function hasGetUserMedia() {
        return !!($window.navigator.mediaDevices && $window.navigator.mediaDevices.getUserMedia);
    }

    function takePhoto(){
        vm.isShowCamera = true;
        videoElement = $element[0].querySelector('#videoStream');
        photoCamera = $element[0].querySelector('#photoCamera');
        canvas = $element[0].querySelector('canvas');
        Fullscreen.enable(photoCamera);
        getStream();
    }

    function cancelPhoto() {
        vm.isPreviewPhoto = false;
        vm.previewPhoto = "";
    }

    function switchWebCamera() {
        indexWebCamera = (indexWebCamera+1)%vm.videoInput.length;
        vm.videoDevice = vm.videoInput[indexWebCamera].deviceId;
        getStream();
    }

    function getDevices() {
        return $window.navigator.mediaDevices.enumerateDevices();
    }

    function gotDevices(deviceInfos?: any) {
        for (const deviceInfo of deviceInfos) {
            let device: any = {
                deviceId: deviceInfo.deviceId,
                label: ""
            };
            if (deviceInfo.kind === 'videoinput') {
                device.label = deviceInfo.label || `Camera ${vm.videoInput.length + 1}`;
                vm.videoInput.push(device);
            }
        }
    }

    function getStream() {
        if (streamDevice !== null) {
            streamDevice.getTracks().forEach(track => {
                track.stop();
            });
        }
        const constraints: any = {
            video: {deviceId: vm.videoDevice !== "" ? {exact: vm.videoDevice} : undefined}
        };
        return $window.navigator.mediaDevices.getUserMedia(constraints).then(gotStream);
    }

    function gotStream(stream?: any) {
        streamDevice = stream;
        if(vm.videoDevice === ""){
            indexWebCamera = vm.videoInput.findIndex(option => option.label === stream.getVideoTracks()[0].label);
            indexWebCamera = indexWebCamera === -1 ? 0 : indexWebCamera;
            vm.videoDevice = vm.videoInput[indexWebCamera].deviceId;
        }
        videoElement.srcObject = stream;
    }

    function createPhoto() {
        canvas.width = vm.videoWidth();
        canvas.height = vm.videoHeight();
        canvas.getContext('2d').drawImage(videoElement, 0, 0, vm.videoWidth(), vm.videoHeight());
        const mimeType: any = vm.ctx.settings.imageFormat ? vm.ctx.settings.imageFormat : DEFAULT_IMAGE_TYPE;
        const quality: any = vm.ctx.settings.imageQuality ? vm.ctx.settings.imageQuality : DEFAULT_IMAGE_QUALITY;
        vm.previewPhoto = canvas.toDataURL(mimeType, quality);
        vm.isPreviewPhoto = true;
    }

    function closeCamera(){
        Fullscreen.cancel(photoCamera);
        vm.isShowCamera = false;
        if (streamDevice !== null) {
            streamDevice.getTracks().forEach(track => {
                track.stop();
            });
        }
        streamDevice = null;
        videoElement.srcObject = null;
    }

    function savePhoto(){
        let promiseData: any = null;
        let datasource: any = vm.ctx.datasources[0];
        let saveData: any = [{
            key: datasource.dataKeys[0].name,
            value: vm.previewPhoto
        }];
        if(dataKeyType === types.dataKeyType.attribute){
            promiseData = attributeService.saveEntityAttributes(datasource.entityType, datasource.entityId, types.attributesScope.server.value, saveData);
        } else if(dataKeyType === types.dataKeyType.timeseries){
            promiseData = attributeService.saveEntityTimeseries(datasource.entityType, datasource.entityId, "scope", saveData);
        }
        promiseData.then(()=>{
            vm.isPreviewPhoto = false;
            closeCamera();
        })
    }
}

/**
 * Ported from the AngularJS directive `tbWebCameraWidget` (module `thingsboard.widgets.webCameraWidget`) in src/app/widget/lib/web-camera-input-widget.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-web-camera-widget',
  standalone: true,
  imports: [TranslatePipe, MatIconModule, MatButtonModule],
  templateUrl: './tb-web-camera-widget.directive.html',
})
export class TbWebCameraWidgetDirective {
  readonly ctx = model<any>();

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            ctx: '='
        };
  controller: any = WebCameraWidgetController;
  controllerAs: any;
  templateUrl: any = webCameraWidgetTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
