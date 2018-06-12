import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'lithuanizeMonth'
})
export class LithuanizeMonthPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let lithuanianMonth = '';
        value = new Date(value);
        if (args === 'month-year') {
            switch (value.getMonth() + 1) {
                case 1:
                    lithuanianMonth = 'Sausis';
                    break;
                case 2:
                    lithuanianMonth = 'Vasaris';
                    break;
                case 3:
                    lithuanianMonth = 'Kovas';
                    break;
                case 4:
                    lithuanianMonth = 'Balandis';
                    break;
                case 5:
                    lithuanianMonth = 'Gegužė';
                    break;
                case 6:
                    lithuanianMonth = 'Birželis';
                    break;
                case 7:
                    lithuanianMonth = 'Liepa';
                    break;
                case 8:
                    lithuanianMonth = 'Rugpjūtis';
                    break;
                case 9:
                    lithuanianMonth = 'Rugsėjis';
                    break;
                case 10:
                    lithuanianMonth = 'Spalis';
                    break;
                case 11:
                    lithuanianMonth = 'Lapkritis';
                    break;
                case 12:
                    lithuanianMonth = 'Gruodis';
                    break;
            }
            return value.getFullYear() + ', ' + lithuanianMonth;
        } else if (args === 'month-year-latin') {
            switch (value.getMonth() + 1) {
                case 1:
                    lithuanianMonth = 'Sausis';
                    break;
                case 2:
                    lithuanianMonth = 'Vasaris';
                    break;
                case 3:
                    lithuanianMonth = 'Kovas';
                    break;
                case 4:
                    lithuanianMonth = 'Balandis';
                    break;
                case 5:
                    lithuanianMonth = 'Geguze';
                    break;
                case 6:
                    lithuanianMonth = 'Birzelis';
                    break;
                case 7:
                    lithuanianMonth = 'Liepa';
                    break;
                case 8:
                    lithuanianMonth = 'Rugpjutis';
                    break;
                case 9:
                    lithuanianMonth = 'Rugsejis';
                    break;
                case 10:
                    lithuanianMonth = 'Spalis';
                    break;
                case 11:
                    lithuanianMonth = 'Lapkritis';
                    break;
                case 12:
                    lithuanianMonth = 'Gruodis';
                    break;
            }
            return value.getFullYear() + ', ' + lithuanianMonth;
        } else {
            switch (value.getMonth()) {
                case 1:
                    lithuanianMonth = 'Sausio';
                    break;
                case 2:
                    lithuanianMonth = 'Vasario';
                    break;
                case 3:
                    lithuanianMonth = 'Kovo';
                    break;
                case 4:
                    lithuanianMonth = 'Balandžio';
                    break;
                case 5:
                    lithuanianMonth = 'Gegužės';
                    break;
                case 6:
                    lithuanianMonth = 'Birželio';
                    break;
                case 7:
                    lithuanianMonth = 'Liepos';
                    break;
                case 8:
                    lithuanianMonth = 'Rugpjūčio';
                    break;
                case 9:
                    lithuanianMonth = 'Rugsėjo';
                    break;
                case 10:
                    lithuanianMonth = 'Spalio';
                    break;
                case 11:
                    lithuanianMonth = 'Lapkričio';
                    break;
                case 12:
                    lithuanianMonth = 'Gruodžio';
                    break;
            }
            return lithuanianMonth + ' ' + value.getDate() + ', ' + value.getFullYear();
        }
    }

}
