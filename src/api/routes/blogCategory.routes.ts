import { Router, Request, Response, NextFunction } from "express";

import BlogCategoryModel from "@/models/Blog_categoryModels";
import { BlogCatService } from "../services/blogCat.service";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import { BlogCatCtrl } from "@/controllers/blog_category.controllers";

const router = Router();
let blogcatservice = new BlogCatService(BlogCategoryModel);
let blogctrl = new BlogCatCtrl(blogcatservice);

router.use(auth, isAdmin);

router
  .route("/category")
  .get((req: Request, res: Response, next: NextFunction) =>
    blogctrl.getAllCategory(req, res, next)
  )
  .post((req: Request, res: Response, next: NextFunction) =>
    blogctrl.createNewCategory(req, res, next)
  );

router
  .route("/category/:id")
  .get((req: Request, res: Response, next: NextFunction) =>
    blogctrl.getSingleCategory(req, res, next)
  )
  .patch((req: Request, res: Response, next: NextFunction) =>
    blogctrl.updateSingleCategory(req, res, next)
  )
  .delete((req: Request, res: Response, next: NextFunction) =>
    blogctrl.delete_category(req, res, next)
  );

export default router;
