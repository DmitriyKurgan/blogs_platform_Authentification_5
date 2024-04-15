import {WithId} from "mongodb";
import {OutputPostType, PostType} from "../../utils/types";
import {getPostsFromDB} from "../../utils/utils";


export const PostMapper = (post : WithId<PostType>) : OutputPostType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export async function getAllPosts(query:any): Promise<any | { error: string }> {
    return getPostsFromDB(query);
}

export async function findAllPostsByBlogID(blogID: string, query: any): Promise<any | { error: string }> {
    return getPostsFromDB(query, blogID)
}
