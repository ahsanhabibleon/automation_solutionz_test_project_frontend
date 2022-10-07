export const getError = (error: any) => {
    return error.response && error.response.data.message ? error.response.data.message : error.message;
}

export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}