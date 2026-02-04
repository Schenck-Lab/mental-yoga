import { useCallback, useRef, useState } from 'react';


export function useSignal(initialValue) {
    const [value, setValue] = useState(initialValue);
    const ref = useRef(initialValue);

    const set = useCallback((next) => {
        setValue((prev) => {
            const v = typeof next === 'function' ? next(prev) : next;
            ref.current = v;
            return v;
        });
    }, []);

    return { value, set, ref };
}
