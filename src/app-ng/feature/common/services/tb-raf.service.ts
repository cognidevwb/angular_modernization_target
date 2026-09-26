import { Injectable } from '@angular/core';
import { bindMethods } from '../../../legacy-injector';

/**
 * Ported from the AngularJS provider `tbRaf` (module `thingsboard.raf`) in src/app/common/raf.provider.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Injectable({ providedIn: 'root' })
export class TbRafService {
  private readonly __bound = bindMethods(this);

  $get($window?: any, $timeout?: any, ...rest: any[]): any {
    var requestAnimationFrame: any = $window.requestAnimationFrame ||
        $window.webkitRequestAnimationFrame;

    var cancelAnimationFrame: any = $window.cancelAnimationFrame ||
        $window.webkitCancelAnimationFrame ||
        $window.webkitCancelRequestAnimationFrame;

    var rafSupported: any = !!requestAnimationFrame;
    var raf: any = rafSupported
        ? function(fn?: any) {
        var id: any = requestAnimationFrame(fn);
        return function() {
            cancelAnimationFrame(id);
        };
    }
        : function(fn?: any) {
        var timer: any = setTimeout(fn, 16.66);
        return function() {
            clearTimeout(timer);
        };
    };

    raf.supported = rafSupported;

    return raf;
  }
}
