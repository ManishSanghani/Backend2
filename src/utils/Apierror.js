class Apierror extends Error{
    constructor(
        statuscode,
        message="Something went Wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.message=message;
        this.statuscode=statuscode
        this.success=false
        this.data=null
        this.errors=errors;

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {Apierror}