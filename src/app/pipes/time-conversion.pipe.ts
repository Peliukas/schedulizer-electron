import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'timeConversion'
})
export class TimeConversionPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (args === 'toTime' && value) {
            let timeHours = Math.floor(value);
            let timeMinutes = Math.round((value - timeHours) * 60);
            if (timeHours > 0 && timeMinutes > 0) {
                return timeHours + 'h ' + timeMinutes + 'min';
            } else if (timeHours > 0 && timeMinutes <= 0) {
                return timeHours + 'h';
            } else if (timeHours <= 0 && timeMinutes > 0) {
                return timeMinutes + 'min';
            }
        }
        return '0min';
    }

}
