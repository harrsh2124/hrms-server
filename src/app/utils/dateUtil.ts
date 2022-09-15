import isDate from 'validator/lib/isDate';

export const sanitizeDate = (date: string) => {
    let sanitizedDate = date.split('T')[0];

    if (!isDate(sanitizedDate)) {
        return false;
    }

    return new Date(`${sanitizedDate}T00:00:00.000Z`);
};

export const isBefore = (endDate: Date, startDate?: Date) => {
    if (!startDate) {
        startDate = new Date();
    }

    console.log(startDate.getDate(), endDate.getDate(), ' << >> ');
    return startDate.getDate() > endDate.getDate();
};
