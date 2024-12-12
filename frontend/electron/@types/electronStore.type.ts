import Store from 'electron-store';

export type ElectronStoreWithGetSet<T extends Record<string, any>> = Store<T> & {
    get: <K extends keyof T>(key: K) => T[K],
    set: <K extends keyof T>(key: K, value: T[K]) => void,
    store: T,
};