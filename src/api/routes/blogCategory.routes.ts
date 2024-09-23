import { Router, Request, Response, NextFunction } from "express";

import { validate } from "@/middlewares/validateResource";
import BlogCategoryModel from "@/models/Blog_categoryModels";
import { BlogCatService } from "../services/blogCat.service";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import { BlogCatCtrl } from "@/controllers/blog_category.controllers";
import {
  blogCategorySchema,
  updateBlogCategorySchema,
} from "@/validators/blog.schema";

const router = Router();
let blogcatservice = new BlogCatService(BlogCategoryModel);
let blogctrl = new BlogCatCtrl(blogcatservice);

router.use(auth, isAdmin);

router
  .route("/category")
  .get((req: Request, res: Response, next: NextFunction) =>
    blogctrl.getAllCategory(req, res, next)
  )
  .post(
    validate(blogCategorySchema),
    (req: Request, res: Response, next: NextFunction) =>
      blogctrl.createNewCategory(req, res, next)
  );

router
  .route("/category/:id")
  .get((req: Request, res: Response, next: NextFunction) =>
    blogctrl.getSingleCategory(req, res, next)
  )
  .patch(
    validate(updateBlogCategorySchema),
    (req: Request, res: Response, next: NextFunction) =>
      blogctrl.updateSingleCategory(req, res, next)
  )
  .delete((req: Request, res: Response, next: NextFunction) =>
    blogctrl.delete_category(req, res, next)
  );

export default router;
