import {useRouter} from "next/router";
import {useEffect, useState} from "react";

export function useNextRouterQuery(initialValue: string, queryKey: string) {
    const {query, push, isReady, beforePopState} = useRouter()
    const [value, setValue] = useState<string>(initialValue)

    useEffect(() => {
        beforePopState(({url}) => {
            const mockUrl = new URL(`http://localhost:3000${url}`)
            const queryValue = mockUrl.searchParams.get(queryKey)
            if (queryValue === null) {
                setValue(initialValue)
            } else {
                setValue(queryValue)
            }
            return true
        })
    }, [setValue, initialValue, queryKey, beforePopState])

    useEffect(() => {
        if (isReady && query[queryKey] !== undefined) {
            setValue(query[queryKey])
        }
    }, [isReady, query, queryKey, setValue])

    function updateValue(newValue: string) {
        setValue(newValue)
        void push(`?${queryKey}=${newValue}`, undefined, {shallow: true})
    }
    return [value, updateValue] as const
}