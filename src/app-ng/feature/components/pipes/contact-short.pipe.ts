import { Pipe, PipeTransform } from '@angular/core';

/**
 * Ported from the AngularJS filter `contactShort` (module `thingsboard.filters.contactShort`) in src/app/components/contact-short.filter.js:16.
 * Scaffolded by the playbook. Same name, so templates that wrote `| contactShort` keep working once this pipe is imported.
 */
@Pipe({ name: 'contactShort', standalone: true })
export class ContactShortPipe implements PipeTransform {
  transform(contact?: any, ...rest: any[]): any {
    var contactShort: any = '';
    if (contact) {
        if (contact.address) {
            contactShort += contact.address;
            contactShort += ' ';
        }
        if (contact.address2) {
            contactShort += contact.address2;
            contactShort += ' ';
        }
        if (contact.city) {
            contactShort += contact.city;
            contactShort += ' ';
        }
        if (contact.state) {
            contactShort += contact.state;
            contactShort += ' ';
        }
        if (contact.zip) {
            contactShort += contact.zip;
            contactShort += ' ';
        }
        if (contact.country) {
            contactShort += contact.country;
        }
    }
    if (contactShort === '') {
        contactShort = $filter('translate')('contact.no-address');
    }
    return contactShort;
  }
}
