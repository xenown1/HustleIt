import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

export default function useClients() {
    const { clients, setClients } = useContext(UserContext)
    return {clients, setClients}
}
