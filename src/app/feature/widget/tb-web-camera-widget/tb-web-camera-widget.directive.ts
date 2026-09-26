import { Component, ElementRef, effect, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

const DEFAULT_IMAGE_TYPE = 'image/jpeg';
const DEFAULT_IMAGE_QUALITY = 0.92;

/**
 * Ported from the AngularJS directive `tbWebCameraWidget` (module `thingsboard.widgets.webCameraWidget`) in src/app/widget/lib/web-camera-input-widget.js:22.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-web-camera-widget',
  standalone: true,
  imports: [TranslatePipe, MatIconModule, MatButtonModule],
  templateUrl: './tb-web-camera-widget.directive.html',
})
export class TbWebCameraWidgetDirective {
  readonly ctx = model<any>();

  private readonly elementRef = inject(ElementRef);
  private readonly http = inject(HttpClient);

  videoInput: any[] = [];
  videoDevice = '';
  previewPhoto = '';
  isShowCamera = false;
  isPreviewPhoto = false;

  isEntityDetected = false;
  dataKeyDetected = false;
  isCameraSupport = false;
  isDeviceDetect = false;

  private streamDevice: MediaStream | null = null;
  private indexWebCamera = 0;
  private videoElement: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private photoCamera: HTMLElement | null = null;
  private dataKeyType = '';
  private width = 640;
  private height = 480;

  constructor() {
    effect(() => {
      const ctx: any = this.ctx();
      if (ctx && ctx.datasources && ctx.datasources.length) {
        const datasource: any = ctx.datasources[0];
        if (datasource.type === 'entity') {
          if (datasource.entityType && datasource.entityId) {
            this.isEntityDetected = true;
          }
        }
        this.width = ctx.settings.maxWidth ? ctx.settings.maxWidth : 640;
        this.height = ctx.settings.maxHeight ? ctx.settings.maxWidth : 480;
        if (datasource.dataKeys.length) {
          this.dataKeyType = datasource.dataKeys[0].type;
          this.dataKeyDetected = true;
        }
        if (this.hasGetUserMedia()) {
          this.isCameraSupport = true;
          this.getDevices().then(deviceInfos => this.gotDevices(deviceInfos)).then(() => {
            this.isDeviceDetect = !!this.videoInput.length;
          });
        }
      }
    });
  }

  private getVideoAspectRatio(): number {
    if (this.videoElement && this.videoElement.videoWidth && this.videoElement.videoWidth > 0 &&
        this.videoElement.videoHeight && this.videoElement.videoHeight > 0) {
      return this.videoElement.videoWidth / this.videoElement.videoHeight;
    }
    return this.width / this.height;
  }

  videoWidth(): number {
    const videoRatio = this.getVideoAspectRatio();
    return Math.min(this.width, this.height * videoRatio);
  }

  videoHeight(): number {
    const videoRatio = this.getVideoAspectRatio();
    return Math.min(this.height, this.width / videoRatio);
  }

  private hasGetUserMedia(): boolean {
    return !!(window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia);
  }

  takePhoto(): void {
    this.isShowCamera = true;
    const element = this.elementRef.nativeElement as HTMLElement;
    this.videoElement = element.querySelector<HTMLVideoElement>('#videoStream');
    this.photoCamera = element.querySelector<HTMLElement>('#photoCamera');
    this.canvas = element.querySelector<HTMLCanvasElement>('canvas');
    if (this.photoCamera && this.photoCamera.requestFullscreen) {
      this.photoCamera.requestFullscreen();
    }
    this.getStream();
  }

  cancelPhoto(): void {
    this.isPreviewPhoto = false;
    this.previewPhoto = '';
  }

  switchWebCamera(): void {
    this.indexWebCamera = (this.indexWebCamera + 1) % this.videoInput.length;
    this.videoDevice = this.videoInput[this.indexWebCamera].deviceId;
    this.getStream();
  }

  private getDevices(): Promise<MediaDeviceInfo[]> {
    return window.navigator.mediaDevices.enumerateDevices();
  }

  private gotDevices(deviceInfos: MediaDeviceInfo[]): void {
    for (const deviceInfo of deviceInfos) {
      const device: any = {
        deviceId: deviceInfo.deviceId,
        label: ''
      };
      if (deviceInfo.kind === 'videoinput') {
        device.label = deviceInfo.label || `Camera ${this.videoInput.length + 1}`;
        this.videoInput.push(device);
      }
    }
  }

  private getStream(): Promise<void> {
    if (this.streamDevice !== null) {
      this.streamDevice.getTracks().forEach(track => {
        track.stop();
      });
    }
    const constraints: MediaStreamConstraints = {
      video: { deviceId: this.videoDevice !== '' ? { exact: this.videoDevice } : undefined }
    };
    return window.navigator.mediaDevices.getUserMedia(constraints).then(stream => this.gotStream(stream));
  }

  private gotStream(stream: MediaStream): void {
    this.streamDevice = stream;
    if (this.videoDevice === '') {
      let index = this.videoInput.findIndex(option => option.label === stream.getVideoTracks()[0].label);
      index = index === -1 ? 0 : index;
      this.indexWebCamera = index;
      this.videoDevice = this.videoInput[index].deviceId;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = stream;
    }
  }

  createPhoto(): void {
    if (!this.canvas || !this.videoElement) {
      return;
    }
    this.canvas.width = this.videoWidth();
    this.canvas.height = this.videoHeight();
    this.canvas.getContext('2d')!.drawImage(this.videoElement, 0, 0, this.videoWidth(), this.videoHeight());
    const ctx: any = this.ctx();
    const mimeType = ctx?.settings?.imageFormat ? ctx.settings.imageFormat : DEFAULT_IMAGE_TYPE;
    const quality = ctx?.settings?.imageQuality ? ctx.settings.imageQuality : DEFAULT_IMAGE_QUALITY;
    this.previewPhoto = this.canvas.toDataURL(mimeType, quality);
    this.isPreviewPhoto = true;
  }

  closeCamera(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    this.isShowCamera = false;
    if (this.streamDevice !== null) {
      this.streamDevice.getTracks().forEach(track => {
        track.stop();
      });
    }
    this.streamDevice = null;
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  savePhoto(): void {
    const ctx: any = this.ctx();
    const datasource: any = ctx.datasources[0];
    const saveData: any[] = [{
      key: datasource.dataKeys[0].name,
      value: this.previewPhoto
    }];
    let promiseData: Promise<any> = null as any;
    if (this.dataKeyType === 'attribute') {
      promiseData = this.saveEntityAttributes(datasource.entityType, datasource.entityId, 'SERVER_SCOPE', saveData);
    } else if (this.dataKeyType === 'timeseries') {
      promiseData = this.saveEntityTimeseries(datasource.entityType, datasource.entityId, 'scope', saveData);
    }
    promiseData.then(() => {
      this.isPreviewPhoto = false;
      this.closeCamera();
    });
  }

  private saveEntityAttributes(entityType: string, entityId: string, scope: string, attributes: any[]): Promise<any> {
    const attributesData: { [key: string]: any } = {};
    attributes.forEach(attribute => {
      attributesData[attribute.key] = attribute.value;
    });
    return firstValueFrom(this.http.post(`/api/plugins/telemetry/${entityType}/${entityId}/attributes/${scope}`, attributesData));
  }

  private saveEntityTimeseries(entityType: string, entityId: string, scope: string, timeseries: any[]): Promise<any> {
    const timeseriesData: { [key: string]: any } = {};
    timeseries.forEach(item => {
      timeseriesData[item.key] = item.value;
    });
    return firstValueFrom(this.http.post(`/api/plugins/telemetry/${entityType}/${entityId}/timeseries/${scope}`, timeseriesData));
  }
}
