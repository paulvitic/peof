import {Fail, Failure, withFailure, withSuccess} from "../../src/domain/Except";

test('should get failure value', () => {
    const failure = {reason: "A failure.", type: 0};
    const except = withFailure(failure);
    expect(except.value).toBe(failure);
});

test('should get success value', () => {
    const except = withSuccess(1);
    expect(except.value).toBe(1);
});

