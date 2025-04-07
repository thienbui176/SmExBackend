import { Request } from 'express';

/**
 * @param request Express request
 * @returns userId => string
 */
const getUserIdFromRequest = (request: Request): string => {
    return request.user.sub;
};

/**
 * Tính khoảng cách giữa 2 ngày, trả về số ngày (có thể là số âm nếu from > to)
 * @param from Ngày bắt đầu
 * @param to Ngày kết thúc
 * @returns Số ngày cách nhau giữa hai mốc thời gian
 */
const calculateDateDiffInDays = (from: Date, to: Date): number => {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    // Làm tròn về nửa đêm để tránh sai số do thời gian
    const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());

    const diffInMs = end.getTime() - start.getTime();
    return diffInMs / MS_PER_DAY;
};

export { getUserIdFromRequest, calculateDateDiffInDays };
