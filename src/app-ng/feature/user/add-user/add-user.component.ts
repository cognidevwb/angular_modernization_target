import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../api/services/user.service';
import { helpLinks } from '../../help/constants/help-links';
import { types } from '../../common/constants/types';

import $ from 'jquery';
import activationLinkDialogTemplate from '../../../../app/user/activation-link.dialog.tpl.html';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

/**
 * Ported from the AngularJS controller `AddUserController` (module `thingsboard.user`) in src/app/user/index.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'add-user',
  standalone: true,
  template: '', // TODO(port): this controller's screen template is the templateUrl of its route in the legacy router
})
export class AddUserComponent {
  protected readonly dialog = inject(MatDialog);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly document = inject(DOCUMENT);
  // TODO(port): '$q' — use Promise, or an Observable
  protected readonly userService = inject(UserService);
  protected readonly helpLinksRef: any = helpLinks;

  protected tenantId: any;
  protected customerId: any;
  protected usersType: any;
  helpLinks: any;
  item: any = {};
  activationMethods: any = [
        {
            value: 'displayActivationLink',
            name: 'user.display-activation-link'
        },
        {
            value: 'sendActivationMail',
            name: 'user.send-activation-mail'
        }
    ];
  userActivationMethod: any = 'displayActivationLink';
  theForm: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

  constructor() {
    this.tenantId = this.route.snapshot.params['tenantId'];
    this.customerId = this.route.snapshot.params['customerId'];
    this.usersType = this.router.$current.data.usersType;
    this.helpLinks = this.helpLinksRef;
    this.add = this.add;
    this.cancel = this.cancel;
  }

  cancel = (...rest: any[]): any => {
    this.dialog.cancel();
  };

  add = ($event?: any, ...rest: any[]): any => {
    var sendActivationMail: any = false;
    if (this.userActivationMethod == 'sendActivationMail') {
        sendActivationMail = true;
    }
    if (this.usersType === 'tenant') {
        this.item.authority = "TENANT_ADMIN";
        this.item.tenantId = {
            entityType: types.entityType.tenant,
            id: this.tenantId
        };
    } else if (this.usersType === 'customer') {
        this.item.authority = "CUSTOMER_USER";
        this.item.customerId = {
            entityType: types.entityType.customer,
            id: this.customerId
        };
    }
    this.userService.saveUser(this.item, sendActivationMail).then((item?: any) => {
        this.item = item;
        this.theForm.$setPristine();
        if (this.userActivationMethod == 'displayActivationLink') {
            this.userService.getActivationLink(this.item.id.id).then(
                (activationLink?: any) => {
                    this.displayActivationLink($event, activationLink).then(
                        () => {
                            this.dialog.hide();
                        }
                    );
                }
            );
        } else {
            this.dialog.hide();
        }
    });
  };

  displayActivationLink($event?: any, activationLink?: any, ...rest: any[]): any {
    let vm = this;
    var deferred: any = $q.defer();
    this.dialog.show({
        controller: 'ActivationLinkDialogController',
        controllerAs: 'vm',
        templateUrl: activationLinkDialogTemplate,
        locals: {
            activationLink: activationLink
        },
        parent: $(this.document.body),
        fullscreen: true,
        multiple: true,
        targetEvent: $event
    }).then(function () {
        deferred.resolve();
    });
    return deferred.promise;
  }
}
