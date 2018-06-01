import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatDatepickerModule, MatMenuModule, MatButtonModule, MatCardModule, MatTabsModule,
    MatTableModule, MatPaginatorModule, MatInputModule, MatSnackBarModule, MatSortModule, MatCheckboxModule,
    MatSelectModule, MatFormFieldModule, MatSidenavModule, MatGridListModule, MatListModule, MatExpansionModule,
    MatTooltipModule, MatSlideToggleModule, MatStepperModule, MatChipsModule, MatNativeDateModule
} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {StorageAdapterService} from './services/storage-adapter.service';
import {CalendarModule} from 'angular-calendar';

import {PageContentWrapperComponent} from './views/page-content-wrapper/page-content-wrapper.component';
import {CrudWindowComponent} from './components/crud-window/crud-window.component';
import {CalendarWrapperComponent} from './components/calendar-wrapper/calendar-wrapper.component';
import {EmployeesMainComponent} from './views/employees-main/employees-main.component';
import {SchedulesMainComponent} from './views/schedules-main/schedules-main.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfirmationBoxComponent} from './components/confirmation-box/confirmation-box.component';
import {PositionsMainComponent} from './views/positions-main/positions-main.component';
import {ModelListViewComponent} from './views/model-list-view/model-list-view.component';
import {AddBreakComponent} from './components/add-break/add-break.component';
import {ScheduleEditorComponent} from './components/schedule-editor/schedule-editor.component';
import {EmployeeEditorComponent} from './components/employee-editor/employee-editor.component';
import {LocalVariablesDirective} from './directives/local-variables.directive';
import {CalendarFreeDaySettingsComponent} from './views/calendar-free-day-settings/calendar-free-day-settings.component';
import {ExportImportWindowComponent} from './views/export-import-window/export-import-window.component';
import {HttpModule} from '@angular/http';
import {Ng2FileInputModule} from 'ng2-file-input';
import {DocumentPreviewComponent} from './components/document-preview/document-preview.component';
import {TimeConvertPipe} from './pipes/time-convert.pipe';
import {ElectronService, NgxElectronModule} from 'ngx-electron';
import {NgPipesModule} from 'angular-pipes';
import {UploadWindowComponent} from './components/upload-window/upload-window.component';
import {ExportSchedulesWindowComponent} from './components/export-schedules-window/export-schedules-window.component';
import {TimeConversionPipe} from './pipes/time-conversion.pipe';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export'


const routes: Routes = [
    {path: 'calendar', component: CalendarWrapperComponent},
    {path: 'schedules', component: SchedulesMainComponent},
    {path: 'employees', component: EmployeesMainComponent},
    {path: 'positions', component: PositionsMainComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        PageContentWrapperComponent,
        CrudWindowComponent,
        CalendarWrapperComponent,
        EmployeesMainComponent,
        SchedulesMainComponent,
        ConfirmationBoxComponent,
        PositionsMainComponent,
        ModelListViewComponent,
        AddBreakComponent,
        ScheduleEditorComponent,
        EmployeeEditorComponent,
        LocalVariablesDirective,
        CalendarFreeDaySettingsComponent,
        ExportImportWindowComponent,
        DocumentPreviewComponent,
        TimeConvertPipe,
        UploadWindowComponent,
        ExportSchedulesWindowComponent,
        TimeConversionPipe
    ],
    imports: [
        RouterModule.forRoot(routes),
        CalendarModule.forRoot(),
        BrowserModule,
        FormsModule,
        NgPipesModule,
        ReactiveFormsModule,
        HttpModule,
        BrowserModule,
        Ng2FileInputModule.forRoot(),
        NgxElectronModule,
        PDFExportModule,
        BrowserAnimationsModule,
        MatDatepickerModule, MatMenuModule, MatButtonModule, MatCardModule, MatTabsModule, MatStepperModule,
        MatTableModule, MatPaginatorModule, MatInputModule, MatSnackBarModule, MatSortModule, MatCheckboxModule,
        MatSelectModule, MatFormFieldModule, MatSidenavModule, MatGridListModule, MatListModule, MatExpansionModule,
        MatTooltipModule, MatSlideToggleModule, MatChipsModule, MatNativeDateModule
    ],
    providers: [StorageAdapterService, ElectronService, TimeConversionPipe],
    entryComponents: [CrudWindowComponent, ConfirmationBoxComponent, AddBreakComponent, DocumentPreviewComponent, UploadWindowComponent, ExportSchedulesWindowComponent],
    bootstrap: [AppComponent]
})

export class AppModule {
}
