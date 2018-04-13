import PouchDB from 'pouchdb';

export class Configurations {
    data: any;
    db: any;

    constructor() {
        this.data = {
            _id: '',
            night_time_start: '',
            night_time_end: '',
            night_time_rate: '',
            holiday_rate: ''
        };
        this.db = new PouchDB('Configurations');
    }

    public setValues(data: any) {
        this.data._id = data._id;
        this.data.night_time_start = data.night_time_start;
        this.data.night_time_end = data.night_time_end;
        this.data.night_time_rate = data.night_time_rate;
        this.data.holiday_rate = data.holiday_rate;
        return true;
    }


    public save() {
        try {
            this.db.put(this.data);
            return true;
        } catch (e) {
            console.log(e);
        }
    }

    public delete() {
        this.db.get(this.data._id).then(doc => {
            doc._deleted = true;
            return this.db.put(doc);
        }, reason => {
            return reason;
        });
    }

    public async find(id: any) {
        this.db.get(id)
            .then(job => {
                this.data = job;
            });
        return this.db.get(id);
    }

    public findAll() {
        return this.db.allDocs(({include_docs: true}));
    }

}
