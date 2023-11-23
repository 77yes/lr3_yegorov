import md5 from 'md5';

const salt = "random_str";

export class Task {
    static TS_COMPLETED = 'completed';
    static TS_INCOMPLETED = 'incompleted';

    constructor(
        public id: string = md5(Date.now() + salt),
        public title: string = '',
        public description: string = '',
        public status: string = Task.TS_INCOMPLETED
    ) {
        if (status !== Task.TS_COMPLETED && status !== Task.TS_INCOMPLETED) {
            throw new Error(`Invalid status: ${status}`);
        }
    }
}
