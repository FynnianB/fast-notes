import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@common/hooks/store.hooks';
import type { RootState } from '../../store';

export function useStateRef<T>(initialValue: T): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] {
    const [value, setValue] = useState<T>(initialValue);

    const ref = useRef<T>(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return [value, setValue, ref];
}

export function useAppSelectorRef<TSelected>(
    selector: (state: RootState) => TSelected,
): [TSelected, MutableRefObject<TSelected>] {
    const selectedState = useAppSelector(selector);

    const ref = useRef<TSelected>(selectedState);

    useEffect(() => {
        ref.current = selectedState;
    }, [selectedState]);

    return [selectedState, ref];
}
