// https://cplusplus.com/reference/queue/queue/
export default class Queue<T> {
    private _array: T[];

    public constructor() {
        this._array = [];
    }

    size(): number {
        return this._array.length;
    }

    push_front(value: T): void {
        this._array.push(value);
    }

    pop_front(): void {
        this._array.splice(0, 1);
    }

    front(): T {
        return this._array[0];
    }

    back(): T { 
        return this._array[this._array.length - 1];
    }
    
    empty(): boolean {
        return this._array.length == 0 ? true: false;
    }
};