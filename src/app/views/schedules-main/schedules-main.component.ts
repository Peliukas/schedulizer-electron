import {Component, Input, OnInit} from '@angular/core';


@Component({
    selector: 'app-schedules-main',
    templateUrl: './schedules-main.component.html',
    styleUrls: ['./schedules-main.component.css']
})
export class SchedulesMainComponent implements OnInit {

    @Input() scheduleList: any;
    @Input() bulkActions: boolean;


    constructor() {
    }

    ngOnInit() {

    }

    public refreshList(event: any) {
        for (let schedule of this.scheduleList) {
            if (schedule.id === event._id) {
                this.scheduleList.splice(this.scheduleList.indexOf(schedule), 1);
                break;
            }
        }
    }


}
