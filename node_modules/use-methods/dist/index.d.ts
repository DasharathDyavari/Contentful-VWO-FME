import { PatchListener } from 'immer';
export declare type StateAndCallbacksFor<M extends MethodsOrOptions> = [StateFor<M>, CallbacksFor<M>];
export declare type StateFor<M extends MethodsOrOptions> = M extends MethodsOrOptions<infer S, any> ? S : never;
export declare type CallbacksFor<M extends MethodsOrOptions> = M extends MethodsOrOptions<any, infer R> ? {
    [T in ActionUnion<R>['type']]: (...payload: ActionByType<ActionUnion<R>, T>['payload']) => void;
} : never;
export declare type Methods<S = any, R extends MethodRecordBase<S> = any> = (state: S) => R;
export declare type Options<S = any, R extends MethodRecordBase<S> = any> = {
    methods: Methods<S, R>;
    patchListener?: PatchListener;
};
export declare type MethodsOrOptions<S = any, R extends MethodRecordBase<S> = any> = Methods<S, R> | Options<S, R>;
export declare type MethodRecordBase<S = any> = Record<string, (...args: any[]) => S extends object ? S | void : S>;
export declare type ActionUnion<R extends MethodRecordBase> = {
    [T in keyof R]: {
        type: T;
        payload: Parameters<R[T]>;
    };
}[keyof R];
export declare type ActionByType<A, T> = A extends {
    type: infer T2;
} ? (T extends T2 ? A : never) : never;
export default function useMethods<S, R extends MethodRecordBase<S>>(methodsOrOptions: MethodsOrOptions<S, R>, initialState: S): StateAndCallbacksFor<MethodsOrOptions<S, R>>;
export default function useMethods<S, R extends MethodRecordBase<S>, I>(methodsOrOptions: MethodsOrOptions<S, R>, initializerArg: I, initializer: (arg: I) => S): StateAndCallbacksFor<MethodsOrOptions<S, R>>;
