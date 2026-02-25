import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";


export default function useSettings() {
    const  {settingForms, setSettingForms} = useContext(UserContext)
    return [settingForms, setSettingForms]
}
