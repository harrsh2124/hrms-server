export const validateDate = (date: any) => {
    const parsedDate = Date.parse(date);

    console.log(parsedDate);

    return !isNaN(parsedDate);
};
