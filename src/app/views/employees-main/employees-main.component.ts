import {Component, Input, OnInit} from '@angular/core';


@Component({
    selector: 'app-employees-main',
    templateUrl: './employees-main.component.html',
    styleUrls: ['./employees-main.component.css']
})
export class EmployeesMainComponent implements OnInit {

    @Input() employeeList: any;
    @Input() bulkActions: any;

    constructor() {
    }

    ngOnInit() {
    }

    public refreshList(event: any) {
        for (let employee of this.employeeList) {
            if (employee.id === event._id) {
                this.employeeList.splice(this.employeeList.indexOf(employee), 1);
                break;
            }
        }
    }


}
