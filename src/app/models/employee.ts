import PouchDB from 'pouchdb';
import {Schedule} from './schedule';

export class Employee {

    data: any;
    db: any;

    constructor() {
        this.data = {
            _id: '',
            firstname: '',
            lastname: '',
            position_id: '',
            schedule_id: '',
        };
        this.db = new PouchDB('Employees');
    }

    public setValues(data: any) {
        this.data._id = data._id;
        this.data.firstname = data.firstname;
        this.data.lastname = data.lastname;
        this.data.position_id = data.position_id;
        this.data.schedule_id = data.schedule_id;
        return true;
    }


    public save() {
        try {
            this.db.get(this.data._id).then(doc => {
                this.data._rev = doc._rev;
                this.db.put(this.data);
            }, cause => {
                console.log('creating new employee...');
                this.db.put(this.data);
            });
            console.log('employee saved!');
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    public delete() {
        this.db.get(this.data._id).then(doc => {
            if (this.data.schedule_id) {
                let tempSchedule = new Schedule();
                let scheduleRef = new Schedule().find(this.data.schedule_id)
                    .then(schedule => {
                        if (schedule.is_private) {
                            tempSchedule.data._id = schedule._id;
                            tempSchedule.delete();
                        }
                    });
            }
            doc._deleted = true;
            return this.db.put(doc);
        }, reason => {
            return reason;
        });
    }


    public async find(id: any) {
        this.db.get(id)
            .then(employee => {
                this.data = employee;
            });
        return this.db.get(id);
    }

    public findAll() {
        return this.db.allDocs(({include_docs: true}));
    }


}
