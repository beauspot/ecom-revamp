import { Router, Request, Response, NextFunction } from "express";

import { BlogModel } from "@/models/blogModel";
import { BlogService } from "@/services/blog.service";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import { BlogsController } from "@/controllers/blog.controllers";
import { uploadPhoto, blogImageResize } from "@/middlewares/uploadImages";

const router = Router();
let blogservice = new BlogService(BlogModel);
let blogctrl = new BlogsController(blogservice);

router
  .route("/posts")
  .get(auth, (req: Request, res: Response, next: NextFunction) =>
    blogctrl.getallBlogs(req, res, next)
  );

router
  .route("/posts")
  .post(auth, isAdmin, (req: Request, res: Response, next: NextFunction) =>
    blogctrl.create_new_blog(req, res, next)
  );

router
  .route("/posts/:id")
  .patch(auth, isAdmin, (req: Request, res: Response, next: NextFunction) =>
    blogctrl.update_blog(req, res, next)
  );

router
  .route("/posts/:id")
  .get(auth, (req: Request, res: Response, next: NextFunction) =>
    blogctrl.get_single_blog(req, res, next)
  );

router
  .route("/posts/:id")
  .delete(auth, isAdmin, (req: Request, res: Response, next: NextFunction) =>
    blogctrl.deleteblog(req, res, next)
  );

router
  .route("/likes")
  .put(auth, (req: Request, res: Response, next: NextFunction) =>
    blogctrl.likeBlogController(req, res)
  );

router
  .route("/dislikes")
  .put(auth, (req: Request, res: Response, next: NextFunction) =>
    blogctrl.dislikeBlogController(req, res)
  );
  
router
  .route("/upload/:id")
  .put(
    auth,
    isAdmin,
    uploadPhoto.array("image", 10),
    blogImageResize,
    (req: Request, res: Response, next: NextFunction) =>
      blogctrl.uploadBlogImageCtrl(req, res, next)
  );

export default router;
