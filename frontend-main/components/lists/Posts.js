import { FlatList } from "native-base";
import { useEffect, useState } from "react";
import PostCard from "../listItems/PostCard";
import axiosRequest from "../../config/axiosRequest";
import ip from "../../config/ip";
import { auth } from '../../config/firebase'

const Posts = (props) => {

   const {posts, pinned} = props;
//    const [pinned,setPinned] = useState([]);

// useEffect(() => {
//     posts.forEach(element => {
//         console.log(`Pinned Posts ${pinned}, EMail : ${element.email}, postText: ${element.text}`); 
//      });
// })

    return (
        <FlatList
        marginBottom={30}
            data={posts}
            renderItem={({ item }) => (
                <PostCard
                    id={item._id}
                    email={item.email}
                    text={item.text}
                    images={item.images}
                   
                    handlePosts={props.handlePosts}
                    pinned={pinned}
                    />
            )} />

        
    )
};

export default Posts;

