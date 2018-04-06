import {Directive, Input} from '@angular/core';

@Directive({
    selector: '[appLocalVariables]',
    exportAs: 'appLocalVariables'
})
export class LocalVariablesDirective {
    @Input('appLocalVariables') set appLocalVariables(struct: any) {
        if (typeof struct === 'object') {
            for (var variableName in struct) {
                this[variableName] = struct[variableName];
            }
        }
    }

    constructor() {
    }
}
