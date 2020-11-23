import postResolvers from './postResolvers';
import userResolvers from './userResolvers';
import commentResolvers from './commentResolvers';
import likeResolvers from './likeResolvers';


export default {
    Post: {
        likeCount: (parent:any) => parent.likes.length,
        commentCount: (parent:any) => parent.comments.length
    },
    Query:{
        ...postResolvers.Query,
        ...userResolvers.Query
    },
    Mutation:{
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...likeResolvers.Mutation
    }
}