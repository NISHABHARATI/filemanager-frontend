import { createContext } from "react";

const UserContext = createContext({
    loggedInUser: false,
})

export default UserContext;