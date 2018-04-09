import PouchDB from 'pouchdb';

export class PeriodTemplate {
    data: any;
    db: any;

    constructor() {
        this.data = {
            _id: '',
            start_date: '',
            end_date: '',
            breaks: [],
            week_days: []
        };
        this.db = new PouchDB('PeriodTemplates');
    }

    public setValues(data: any) {
        this.data._id = data._id;
        this.data.start_date = data.start_date;
        this.data.end_date = data.end_date;
        this.data.breaks = data.breaks;
        this.data.week_days = data.week_days;
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
            console.log('failed to delete: ', reason);
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
