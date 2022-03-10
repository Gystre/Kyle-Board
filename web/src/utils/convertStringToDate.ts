export const convertStringToDate = (date: string) => {
    var obj = new Date(parseInt(date));

    return obj.toLocaleString();
};
