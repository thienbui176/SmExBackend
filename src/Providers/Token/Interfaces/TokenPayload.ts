export interface TokenPayload<T> {
    type: string;
    subject: T;
}
