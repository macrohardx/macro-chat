export interface IMaybe<T> {
    
    error?: any

    ok: boolean

    result?: T
}