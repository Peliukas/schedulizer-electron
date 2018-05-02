import {Component, Input, OnInit} from '@angular/core';
import {Employee} from '../../models/employee';
import {Position} from '../../models/position';
import {MatDialog, MatSnackBar} from '@angular/material';
import {CrudWindowComponent} from '../../components/crud-window/crud-window.component';
import {ConfirmationBoxComponent} from '../../components/confirmation-box/confirmation-box.component';
import {Schedule} from '../../models/schedule';


@Component({
    selector: 'app-model-list-view',
    templateUrl: './model-list-view.component.html',
    styleUrls: ['./model-list-view.component.css']
})
export class ModelListViewComponent implements OnInit {

    objectList: any;
    bulkActions: boolean;
    @Input() modelName: string;

    constructor(private matDialog: MatDialog, private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.bulkActions = false;
        this.objectList = [];
        this.getObjectList();
    }

    public getObjectList() {
        switch (this.modelName) {
            case 'employee':
                new Employee().findAll()
                    .then(data => {
                        this.objectList = data.rows;
                    });
                break;
            case 'position':
                new Position().findAll()
                    .then(data => {
                        this.objectList = data.rows;
                    });
                break;
            case 'schedule':
                new Schedule().findAll()
                    .then(data => {
                        let publicSchedules = [];
                        for (let schedule of data.rows) {
                            if (!schedule.doc.is_private) {
                                publicSchedules.push(schedule);
                            }
                        }
                        this.objectList = publicSchedules;
                    });
                break;
            default:
        }

    }

    public showAddObjectModal() {
        let dialogRef = this.matDialog.open(CrudWindowComponent, {
            width: '310px',
            height: 'auto',
            data: {
                modelName: this.modelName
            }
        });
        dialogRef.afterClosed().subscribe(data => {
            if (data && data.data._id) {
                this.getObjectList();
                this.snackBar.open("Naujas įrašas pridėtas sėkmingai!", 'OK', {duration: 3000});
            }
        });
    }

}
