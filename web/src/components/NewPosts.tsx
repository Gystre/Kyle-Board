import { SocketCmds } from "@kyle/common";
import React, { Component } from "react";
import { PostResultFragment } from "../generated/graphql";
import { socket } from "../utils/socket";
import { Post } from "./Post";

class NewPosts extends Component {
    state = {
        posts: [] as PostResultFragment[],
    };

    componentDidMount() {
        socket.connect();
        socket.on(SocketCmds.SendMessage, (post: PostResultFragment) => {
            // date comes in 2022-03-08T23:18:21.279Z for some reason so fix it
            post.createdAt = new Date(post.createdAt).getTime().toString();

            this.setState({ posts: [post, ...this.state.posts] });
        });
    }

    render() {
        return (
            <>
                {this.state.posts.map((post) => {
                    return <Post key={post.id} post={post} />;
                })}
            </>
        );
    }
}

export default NewPosts;
