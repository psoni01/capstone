import { FlatList } from "native-base";
import { useState } from "react";
import UserCard from "../listItems/UserCard";

const Users = (props) => {

   const users = props.users;



    return (
        <FlatList
            mt={5}
            data={users}
            renderItem={({ item }) => (
                <UserCard
                    id={item._id}
                    email={item.email}
                    name={item.name}
                    skills={item.skills}
                    expoToken={item.expoToken}
                    image={item.image}
                    />
            )} />
    )
};

export default Users;

