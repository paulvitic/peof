// https://medium.com/inato/expressive-error-handling-in-typescript-and-benefits-for-domain-driven-design-70726e061c86
export interface Failure<F> {
    type: F;
    reason: string;
}

export type Except<L extends Failure<string | number>, A> = Fail<L, A> | Succeed<L, A>;

export class Fail<L extends Failure<string | number>, A> {
    readonly value: L;

    constructor(value: L) {
        this.value = value;
    }

    failed(): this is Fail<L, A> {
        return true;
    }

    succeeded(): this is Succeed<L, A> {
        return false;
    }

    onSuccess<B>(_: (a: A) => B): Except<L, B> {
        return this as any;
    }
}

export class Succeed<L extends Failure<string | number>, A> {
    readonly value: A;

    constructor(value: A) {
        this.value = value;
    }

    failed(): this is Fail<L, A> {
        return false;
    }

    succeeded(): this is Succeed<L, A> {
        return true;
    }

    onSuccess<B>(func: (a: A) => B): Except<L, B> {
        return new Succeed(func(this.value));
    }
}

export const withFailure = <L extends Failure<string | number>, A>(l: L): Except<L, A> => {
    return new Fail(l);
};

export const withSuccess = <L extends Failure<string | number>, A>(a: A): Except<L, A> => {
    return new Succeed<L, A>(a);
};


