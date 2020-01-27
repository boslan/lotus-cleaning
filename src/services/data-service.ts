import { Observable } from '../core/observable';

const _data: { [key: string]: Observable<any> } = {};

export const getStore = <T>(storeName: string): Observable<T> => {
    if (!_data[storeName]) {
        _data[storeName] = new Observable<T>();
    }
    return _data[storeName];
};
