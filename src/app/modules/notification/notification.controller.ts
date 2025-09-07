import { catchAsync } from "../../utils/catchAsync";
import { Request,Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { notificationServices } from './notification.service';

// ----- create notification constroller ------ //
const cretaeNotification= catchAsync( async(req:Request,res:Response)=>{
    const result = notificationServices.createNotificationService(req.body);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Notification created successfully',
        data:result
    })
})

export const notificationController={
    cretaeNotification
}
