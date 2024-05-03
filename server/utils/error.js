const errorHandler = (statusCode,message) => {
    const error = new Error() // todo need to study about it
    error.statusCode = statusCode;
    error.succes = false;
    error.message = message;
    return error
}
 export default errorHandler;