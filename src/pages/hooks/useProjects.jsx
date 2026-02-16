import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

export default function useProjects() {
    
    const {projects, setProjects} = useContext(UserContext)
    return { projects, setProjects}

}
