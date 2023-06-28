export default class Stack<T> {
    private _array: T[];

    public constructor() {
        this._array = [];
    }

    push(value: T) {
        this._array.push(value);
    }

    pop(): void {
        this._array.pop();
    }

    size(): number {
        return this._array.length;
    }

    back(): T { 
        return this._array[this._array.length - 1];
    }

    empty(): boolean {
        return this._array.length == 0 ? true: false;
    }
};
