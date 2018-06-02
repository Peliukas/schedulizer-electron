import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'timeConversion'
})
export class TimeConversionPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        let result = '';
        if (args === 'toTime' && value) {
            let timeHours = Math.floor(value);
            let timeMinutes = Math.round((value - timeHours) * 60);
            if (timeHours > 0 && timeMinutes > 0) {
                result = timeHours + 'h ' + timeMinutes + 'min';
            } else if (timeHours > 0 && timeMinutes <= 0) {
                result = timeHours + 'h';
            } else if (timeHours <= 0 && timeMinutes > 0) {
                result = timeMinutes + 'min';
            }
            if (timeMinutes === 60) {
                timeHours += 1;
                timeMinutes = 0;
                result = timeHours + 'h ' + timeMinutes + 'min';
            }
            return result;
        }
        return '0min';
    }

}
