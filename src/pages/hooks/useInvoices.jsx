import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

export default function useInvoices(){
    const { invoices, setInvoices} = useContext(UserContext)
    return {invoices, setInvoices}
}