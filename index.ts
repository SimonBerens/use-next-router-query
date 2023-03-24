import {useRouter} from "next/router"
import {useEffect, useState} from "react"

type QueriesType = Record<string, string>

export function useNextRouterQuery(baseRoute: string, initialQueries: QueriesType) {
    const {query, push, isReady, beforePopState} = useRouter()
    const [queryState, setQueryState] = useState<QueriesType>(initialQueries)

    useEffect(() => {
        beforePopState(({url}) => {
            const mockSearchParams = new URL(`http://localhost:3000${url}`).searchParams
            const newQueryState: QueriesType ={}
            for (const [queryKey,] of Object.entries(initialQueries)) {
                const queryValue = mockSearchParams.get(queryKey)
                if (queryValue === null) {
                    newQueryState[queryKey] = initialQueries[queryKey]
                } else {
                    newQueryState[queryKey] = queryValue // preserve order
                }
            }
            setQueryState(newQueryState)
            return true
        })

        return () => {
            beforePopState(() => true)
        };
    }, [setQueryState, beforePopState])

    useEffect(() => {
        if (isReady) {
            const newQueryState: QueriesType ={}
            for (const [queryKey,] of Object.entries(initialQueries)) {
                if (query[queryKey] !== undefined) {
                    newQueryState[queryKey] = query[queryKey] as string
                } else {
                    newQueryState[queryKey] = initialQueries[queryKey]
                }
            }
            setQueryState(newQueryState)
        }
    }, [isReady, query, setQueryState])

    function updateValues(newValues: QueriesType) {
        const newQueryState = {...newValues}
        setQueryState(newQueryState)
        const queryString = Object.entries(newQueryState)
            .map(([key, value]) => `${key}=${value}`).join('&')
        void push(baseRoute + '?' + queryString, undefined, {shallow: true})
    }
    return [queryState, updateValues] as const
}