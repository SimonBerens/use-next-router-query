import {useRouter} from "next/router"
import {useEffect, useState} from "react"

type QueriesType = Record<string, string>

export function useNextRouterQuery(initialQueries: QueriesType) {
    const {query, push, isReady, beforePopState} = useRouter()
    const [queryState, setQueryState] = useState<QueriesType>(initialQueries)

    useEffect(() => {
        beforePopState(({url}) => {
            const mockSearchParams = new URL(`http://localhost:3000${url}`).searchParams
            for (const [queryKey,] of Object.entries(initialQueries)) {
                const queryValue = mockSearchParams.get(queryKey)
                if (queryValue === null) {
                    queryState[queryKey] = initialQueries[queryKey]
                } else {
                    queryState[queryKey] = queryValue // preserve order
                }
            }
            setQueryState({...queryState})
            return true
        })
    }, [setQueryState, queryState, initialQueries, beforePopState])

    useEffect(() => {
        if (isReady) {
            for (const [queryKey,] of Object.entries(queryState)) {
                if (query[queryKey] !== undefined) {
                    queryState[queryKey] = query[queryKey] as string
                }
            }
            setQueryState({...queryState})
        }
    }, [isReady, query, queryState, setQueryState])

    function updateValues(newValues: QueriesType) {
        for (const [queryKey,] of Object.entries(newValues)) {
            queryState[queryKey] = newValues[queryKey]
        }
        const newQueryState = {...queryState}
        setQueryState(newQueryState)
        const queryString = Object.entries(newQueryState)
            .map(([key, value]) => `${key}=${value}`).join('&')
        void push('?' + queryString, undefined, {shallow: true})
    }
    return [queryState, updateValues] as const
}