import React from "react";
import { User } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";

export default function UserComponent() {
    const user = useSelector((state) => state.user.user);
    return (
        <User
            name={user?.fullname}
            description={user?.role}
            
        />
    );
}
