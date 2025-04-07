export default class ApiResponse<T> {
    data: T;
    message: string;
    status: string;
    errors?: any;
}
