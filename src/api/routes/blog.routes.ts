import express from "express";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import { uploadPhoto, blogImageResize } from "@/middlewares/uploadImages";
import {
  create_new_blog,
  update_blog,
  get_single_blog,
  getallBlogs,
  deleteblog,
  likeBlogController,
  dislikeBlogController,
  uploadBlogImageCtrl,
} from "@/controllers/blog.controllers";

const router = express.Router();

router.post("/posts", auth, isAdmin, create_new_blog);
router.patch("/posts/:id", auth, isAdmin, update_blog);
router.get("/posts/:id", auth, get_single_blog);
router.get("/posts", auth, getallBlogs);
router.delete("/posts/:id", auth, isAdmin, deleteblog);
router.put("/likes", auth, likeBlogController);
router.put("/dislikes", auth, dislikeBlogController);
router.put(
  "/upload/:id",
  auth,
  isAdmin,
  uploadPhoto.array("images", 10),
  blogImageResize,
  uploadBlogImageCtrl
);


export default router;
