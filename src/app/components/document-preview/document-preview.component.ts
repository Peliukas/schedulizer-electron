import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material';
import * as jsPDF from 'jspdf';

@Component({
    selector: 'app-document-preview',
    templateUrl: './document-preview.component.html',
    styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnInit {

    @ViewChild('docBody') docBody;
    calendarData: any = [];
    calendarDayNumbers: any = [];

    constructor(public dialogRef: MatDialogRef<DocumentPreviewComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.calendarData = this.data;
        for (let i = 1; i < 32; i++) {
            this.calendarDayNumbers.push(i);
        }

    }

    public getDay(date: any) {
        return new Date(date).getDate();
    }

    public closeAndExport() {
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.addHTML(this.docBody.nativeElement, () => {
            doc.save('Esksportai.pdf');
        });
        this.dialogRef.close(this.docBody);
    }

}
