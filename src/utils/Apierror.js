class Apierror extends Error{
    constructor(
        statuscode,
        message="Something went Wrong",
        errors=[],
        statck=""
    ){
        super(message)
        this.message=message;
        this.statuscode=statuscode
        this.success=false
        this.data=null
        this.errors=errors;

        if(statck){
            this.statck=statck
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {Apierror}