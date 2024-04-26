import {Request, Response, Router} from "express";
import {blogs, blogsService} from "../services/blogs-service";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {OutputBlogType, OutputPostType} from "../utils/types";
import {
    validateAuthorization,
    validateBlogsRequests,
    validateErrorsMiddleware,
    validatePostsRequests, validationBlogsFindByParamId
} from "../middlewares/middlewares";
import {posts, postsService} from "../services/posts-service";
import {blogsQueryRepository} from "../repositories/query-repositories/blogs-query-repository";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";

export const blogsController = Router({});

blogsController.get('/', async (req:Request, res:Response)=>{
    const queryValues = getQueryValues({
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        searchNameTerm:req.query.searchNameTerm
    })
    const blogs = await blogsQueryRepository.getAllBlogs({...queryValues});
    if(!blogs || !blogs.items.length) {
        return res.status(CodeResponsesEnum.Not_found_404).send([])
    }
    res.status(CodeResponsesEnum.OK_200).send(blogs)
})

blogsController.get('/:id', validationBlogsFindByParamId, async (req:Request, res:Response)=>{
    const blogID = req.params.id;
    const blogByID:OutputBlogType|null = await blogsQueryRepository.findBlogByID(blogID);
    if (!blogID || !blogByID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.status(CodeResponsesEnum.OK_200).send(blogByID);
})

blogsController.get('/:id/posts', async (req:Request, res:Response)=>{
     const blogID = req.params.id;
     const blogByID:OutputBlogType|null = await blogsQueryRepository.findBlogByID(blogID);
     if(!blogID || !blogByID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
     }

    const queryValues = getQueryValues({
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        searchNameTerm:req.query.searchNameTerm
    })

    const posts = await postsQueryRepository.findAllPostsByBlogID(blogID, {...queryValues});

    if (!posts || !posts.items.length) {
        return res.status(CodeResponsesEnum.OK_200).send([]);
    }

    res.status(CodeResponsesEnum.OK_200).send(posts);
});

blogsController.post('/', validateAuthorization, validateBlogsRequests, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const newBlog: OutputBlogType|null = await blogsService.createBlog(req.body);
    if (newBlog){
        blogs.push(newBlog);
        res.status(CodeResponsesEnum.Created_201).send(newBlog);
    }
});

blogsController.post('/:id/posts', validateAuthorization, validatePostsRequests,validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const blogID = req.params.id;
    const blogByID:OutputBlogType|null = await blogsQueryRepository.findBlogByID(blogID);
    if(!blogID || !blogByID){
        res.sendStatus(CodeResponsesEnum.Not_found_404);
        return
    }
    const newPost: OutputPostType|null = await postsService.createPost(req.body, blogByID.name, blogID);
    if (newPost){
        posts.push(newPost);
        res.status(CodeResponsesEnum.Created_201).send(newPost);
    }
});

blogsController.put('/:id', validateAuthorization, validationBlogsFindByParamId, validateBlogsRequests, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    debugger
    const blogID = req.params.id;
    const isUpdated:boolean = await blogsService.updateBlog(blogID, req.body);
    if (!isUpdated || !blogID){
        res.sendStatus(CodeResponsesEnum.Not_found_404);

    }
    const blog = await blogsQueryRepository.findBlogByID(blogID);
    res.status(CodeResponsesEnum.Not_content_204).send(blog);
});

blogsController.delete('/:id', validateAuthorization, validationBlogsFindByParamId, validateErrorsMiddleware,async (req:Request, res:Response)=>{
    const blogID:string = req.params.id;
    const isDeleted:boolean = await blogsService.deleteBlog(blogID);
    if (!isDeleted || !blogID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
})


