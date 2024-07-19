import { APICall } from './index';

const ControllerName = "Accounts";

export const GetHospitalTypesLookup = () => {
    return APICall("get", ControllerName + "/lookup", null, lang)
}