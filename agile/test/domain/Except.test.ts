import {withFailure, withSuccess} from "../../src/domain/Except";

test('should get failure value', () => {
    const failure = {reason: "A failure.", type: 0};
    const except = withFailure(failure);
    expect(except.value).toBe(failure);
});

test('should get success value', () => {
    const except = withSuccess(1);
    expect(except.value).toBe(1);
});

test('should invoke on success and return another expect', () => {
    const onSuccess = jest.fn(x => 1 + x);
    let except = withSuccess(1).onSuccess(onSuccess);
    expect(onSuccess).toBeCalled();
    expect(except.value).toBe(2);
});

test('should invoke on success and return another failed expect', () => {
    const failure = {reason: "A failure.", type: 0};
    const onSuccess = jest.fn(() => withFailure(failure));
    let except = withSuccess(1).onSuccess(onSuccess);
    expect(onSuccess).toBeCalled();
    // @ts-ignore
    expect(except.value.value).toBe(failure);
});

test('should not call else on success', () => {
    const onFail = jest.fn(() => {});
    const except = withSuccess(1).else(onFail);
    expect(onFail).not.toBeCalled();
});

