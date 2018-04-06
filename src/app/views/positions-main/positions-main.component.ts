import {Component, Input, OnInit} from '@angular/core';
import {Position} from '../../models/position';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ConfirmationBoxComponent} from '../../components/confirmation-box/confirmation-box.component';

@Component({
    selector: 'app-positions-main',
    templateUrl: './positions-main.component.html',
    styleUrls: ['./positions-main.component.css']
})
export class PositionsMainComponent implements OnInit {

    @Input() positionList: any;
    @Input() bulkActions: any;

    constructor(private matDialog: MatDialog, private snackBar: MatSnackBar) {
    }

    ngOnInit() {
    }

    public deleteSelectedPosition(id: any) {
        let position = new Position();
        position.find(id)
            .then(data => {
                position.setValues(data);
                let dialogRef = this.matDialog.open(ConfirmationBoxComponent);
                dialogRef.afterClosed()
                    .subscribe(answer => {
                        if (answer === true) {
                            position.delete();
                            this.refreshList(position.data);
                            this.snackBar.open('An position has been removed', 'OK', {duration: 3000});
                        }
                    });
            });
    }


    public saveChanges(changes: any) {
        let position = new Position();
        position.setValues(changes);
        position.save() === true ?
            this.snackBar.open('Changes saved!', 'OK', {duration: 3000}) :
            this.snackBar.open('Something went wrong', 'OK', {duration: 3000});
    }

    public refreshList(event: any) {
        for (let position of this.positionList) {
            if (position.id === event._id) {
                this.positionList.splice(this.positionList.indexOf(position), 1);
                break;
            }
        }
    }

}
