"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const Post_1 = __importDefault(require("../../models/Post"));
const verifySignature_1 = __importDefault(require("../../utils/verifySignature"));
exports.default = {
    Mutation: {
        createComment(_, { postid, body }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = verifySignature_1.default(context);
                if (!user || typeof user === 'string')
                    return new apollo_server_express_1.AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
                const post = yield Post_1.default.findById(postid);
                if (!post)
                    return new apollo_server_express_1.UserInputError('Wrong post id');
                let newComment = {
                    body,
                    username: user.username,
                    userid: user.id,
                    createdAt: new Date().toISOString()
                };
                post.comments.unshift(newComment);
                yield post.save();
                return newComment;
            });
        },
        deleteComment(_, { postid, commentid }, context) {
            return __awaiter(this, void 0, void 0, function* () {
                let user = verifySignature_1.default(context);
                if (!user || typeof user === 'string')
                    return new apollo_server_express_1.AuthenticationError('Invalid token: authorization header must be provided "Bearer [token]"');
                const post = yield Post_1.default.findById(postid);
                if (!post)
                    return new apollo_server_express_1.UserInputError('Wrong post id');
                let idxComment = post.comments.findIndex(comment => comment._id == commentid);
                if (idxComment == -1)
                    return new apollo_server_express_1.UserInputError('Wrong comment id');
                //Just owner post and owner comment can delete the comment.
                if (user.id != post.userid && user.id != post.comments[idxComment].userid)
                    return new apollo_server_express_1.AuthenticationError('Action not allowed');
                post.comments.splice(idxComment, 1);
                yield post.save();
                return 'Comment Deleted';
            });
        }
    }
};
