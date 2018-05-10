import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import {Configurations} from '../../models/configurations';

@Component({
    selector: 'app-document-preview',
    templateUrl: './document-preview.component.html',
    styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnInit {
    @ViewChild('docBody') docBody;
    @ViewChild('table') table;
    calendarData: any = [];
    calendarDayNumbers: any = [];
    config: any;

    constructor(public dialogRef: MatDialogRef<DocumentPreviewComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        new Configurations().find('multipliers')
            .then(config => {
                this.config = config;
                this.calendarData = this.data;
                for (let i = 1; i < 32; i++) {
                    this.calendarDayNumbers.push(i);
                }
            });
    }

    public getDay(date: any) {
        return new Date(date).getDate();
    }

    public closeAndExportPDF() {
        const doc = new jsPDF('p', 'pt', 'a4');
        doc.addHTML(this.docBody.nativeElement, () => {
            doc.save('Esksportai.pdf');
        });
        this.dialogRef.close(this.docBody);
    }

    public closeAndExportXLS() {
        /* generate worksheet */
        let data = [[]];
        for (let year of this.calendarData.years) {
            if (year) {
                for (let month of year.months) {
                    if (month) {
                        data.push([parseInt(month.number) + 1 + '/' + year.year]);
                        data.push(['Darbuotoja(s)', 'Pareigos', ''].concat(this.calendarDayNumbers).concat(['Paprastų', 'Naktinių', 'Šventinių', 'Viso valandų', 'Uždarbis']));
                        for (let employee of month.employees) {
                            let tempWorkDays = [];
                            let tempBreaks = [];
                            for (let calendarDayNumber of this.calendarDayNumbers) {
                                let found: boolean;
                                employee.work_days.forEach(workDay => {
                                    if (calendarDayNumber === new Date(workDay.date).getDate()) {
                                        tempWorkDays.push(workDay.start_time + ' - ' + workDay.end_time);
                                        found = true;
                                        if (workDay.breaks) {
                                            let tempBreakTime = '';
                                            workDay.breaks.forEach(breakTime => {
                                                tempBreakTime += breakTime.start + '-' + breakTime.end + '\n';
                                            });
                                            tempBreaks.push(tempBreakTime);
                                        }
                                    }
                                });
                                if (!found) {
                                    tempWorkDays.push('');
                                    tempBreaks.push('');
                                }
                            }
                            const totalWorkHours = employee.month_salary.work_hours.ordinary_hours + employee.month_salary.work_hours.night_hours + employee.month_salary.work_hours.holiday_hours;
                            const totalSalary = employee.month_salary.work_hours.ordinary_hours *
                                employee.position.pay + employee.month_salary.work_hours.night_hours *
                                this.config.night_time_rate +
                                employee.month_salary.work_hours.night_hours * employee.position.pay +
                                employee.month_salary.work_hours.holiday_hours *
                                this.config.holiday_rate;
                            data.push([employee.firstname + ' ' + employee.lastname, employee.position.job_title, 'Darbo laikas'].concat(tempWorkDays).concat([employee.month_salary.work_hours.ordinary_hours, employee.month_salary.work_hours.night_hours, employee.month_salary.work_hours.holiday_hours, totalWorkHours, totalSalary]));
                            data.push(['', '', 'Pertraukos'].concat(tempBreaks));
                        }
                    }
                }
            }
        }
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Eksportas');
        /* save to file */
        XLSX.writeFile(wb, 'Eksportas.xlsx');
    }

    public getMonth(month: string) {
        return parseInt(month) + 1;
    }

}
