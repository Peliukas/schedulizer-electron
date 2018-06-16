import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'lithuanianCharacterTransform'
})
export class LithuanianCharacterTransformPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let transformedString = '';
        if (args === 'toLatin') {
            for (let letter of value) {
                switch (letter) {
                    case 'ą':
                        transformedString += 'a';
                        break;
                    case 'Ą':
                        transformedString += 'A';
                        break;
                    case 'ę' || 'ė':
                        transformedString += 'e';
                        break;
                    case 'Ę' || 'Ė':
                        transformedString += 'E';
                        break;
                    case 'į':
                        transformedString += 'i';
                        break;
                    case 'Į':
                        transformedString += 'I';
                        break;
                    case 'š':
                        transformedString += 's';
                        break;
                    case 'Š':
                        transformedString += 'S';
                        break;
                    case 'ų' || 'ū':
                        transformedString += 'u';
                        break;
                    case 'Ų' || 'Ū':
                        transformedString += 'U';
                        break;
                    case 'ž':
                        transformedString += 'z';
                        break;
                    case 'Ž':
                        transformedString += 'Z';
                        break;
                    default:
                        transformedString += letter;
                }
            }
        }
        return transformedString;
    }

}
