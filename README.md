# use-next-router-query

Easily treat query parameters as state in Next.js.

This is useful when you want to keep some React state in sync with the URL. For example, if you're writing a search bar and you want to keep the search text in the URL so that people can share the search state.

This library takes care of updating the browser history and enabling navigation with the forward and back buttons.

### How to use
```tsx
import {useNextRouterQuery} from 'use-next-router-query'

const Component = () => {
    const [queryState, setQueryState] = useNextRouterQuery({a: 123, b: "hello"})
    return (
        <>
            <div>{queryState.a}</div>
            <div>{queryState.b}</div>
            <button onClick={() => setQueryState({...queryState, a: 456})}>Set A</button>
            <button onClick={() => setQueryState({...queryState, b: "world"})}>Set B</button>
        </>
    )
}
```