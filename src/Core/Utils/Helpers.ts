import { Request } from 'express';
import { ORDER_BY } from 'src/Constants/OrderBy';
import { Model, RootFilterQuery, Types } from 'mongoose';

/**
 * @param request Express request
 * @returns userId => string
 */
const getUserIdFromRequest = (request: Request): string => {
    return request.user.sub;
};

const getUserIdFromRequestNumber = (request: Request): number => {
    return Number(request.user.sub);
};

/**
 * Tính khoảng cách giữa 2 ngày, trả về số ngày (có thể là số âm nếu from > to)
 * @param from Ngày bắt đầu
 * @param to Ngày kết thúc
 * @returns Số ngày cách nhau giữa hai mốc thời gian
 */
const calculateDateDiffInDays = (from: Date, to: Date): number => {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());

    const diffInMs = end.getTime() - start.getTime();
    return diffInMs / MS_PER_DAY;
};

const convertDateToDDMMYYYY = (date: Date) => {
    return date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear();
};

const convertDateToYYYYMMDD = (date: Date) => date.toString().slice(0, 9);

const transformOrderByToNumber = (orderBy: ORDER_BY) => (orderBy === ORDER_BY.ASC ? 1 : -1);

function arrayToMapByKey<T>(array: any[], key: string): Record<string, T> {
    return array.reduce((acc, item) => {
        const mapKey = item[key];
        if (mapKey !== undefined && mapKey !== null) {
            acc[String(mapKey)] = item;
        }
        return acc;
    }, {});
}

const checkElementInArrayObjectId = (array: Types.ObjectId[], keySearch: string) => {
    return array.map(String).some((value) => value === keySearch);
};

export {
    getUserIdFromRequest,
    calculateDateDiffInDays,
    transformOrderByToNumber,
    convertDateToDDMMYYYY,
    arrayToMapByKey,
    getUserIdFromRequestNumber,
    convertDateToYYYYMMDD,
    checkElementInArrayObjectId,
};
