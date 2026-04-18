export default class ExpressError extends Error{
    constructor(statusCode , message){
        super(message);
        statusCode = this.statusCode;
    }
}