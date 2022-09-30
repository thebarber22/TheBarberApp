import { Service } from "./Service";

export class AppointmentsService{
    startDateTime:any;
    endDateTime:any;
    companyId:string;
    clientId:string;
    employeeId:string;
    serviceList:Service[];
}