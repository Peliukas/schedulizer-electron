import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'timeConvert'
})
export class TimeConvertPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return null;
    }

    hoursTohhmm(hours: any) {
        var sign = hours < 0 ? '-' : '';
        var hour = Math.floor(Math.abs(hours));
        var minute = Math.floor((Math.abs(hours) * 60) % 60);
        return sign + (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute;
    }
}
