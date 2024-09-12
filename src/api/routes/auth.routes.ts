import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "@/services/user.service";
import { UserController } from "@/controllers/userCtrls";

import { authModel } from "@/models/userModels";
import { UserOrderModel } from "@/models/orderModel";
import { productModel } from "@/models/productsModels";
import { CouponModel } from "@/models/coupon.models";
import { blacklistTokens } from "@/models/blacklistTokens";
import { UserCartModel } from "@/models/cartModel";
import { validate } from "@/middlewares/validateResource";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import { createUserSchema, customerLoginSchema, adminLoginSchema } from "@/validators/auth.schema";

// const authRoute = express.Router();

let router = Router();
let UserServices = new UserService(authModel, productModel, UserOrderModel, UserCartModel, CouponModel, blacklistTokens);
let UserCtrl = new UserController(UserServices);

router.route("/signup").post(validate(createUserSchema),(req: Request, res: Response, next: NextFunction) => UserCtrl.create_a_user(req, res, next));
router.route("/login",).post(validate(customerLoginSchema), (req: Request, res: Response, next: NextFunction) => UserCtrl.LoginUser(req, res, next));
router.route("/admin-login").post(validate(adminLoginSchema), (req: Request, res: Response, next: NextFunction) => UserCtrl.LoginAdmin(req, res, next));
router.route("/cart/cash-order").post(auth, (req: Request, res: Response) => UserCtrl.createOrderCtrl(req, res));
router.route("/cart").post(auth, (req: Request, res: Response) => UserCtrl.userCartCtrl(req, res));
router.route("/cart/applycoupon").post(auth, (req: Request, res: Response) => UserCtrl.applyCouponCtrl(req, res));


router.route("/save-address").put(auth, (req: Request, res: Response) => UserCtrl.saveAddress(req, res));
router.route("/wishlist").put(auth, (req: Request, res: Response) => UserCtrl.addToWishList(req, res));
  
router.route("/allusers").get(auth, isAdmin, (req: Request, res: Response, next: NextFunction) => UserCtrl.getAllUser(req, res, next));
router.route("/refresh-token").get((req: Request, res: Response, next: NextFunction) => UserCtrl.handleRefreshToken(req, res, next));
router.route("/logout").get((req: Request, res: Response, next: NextFunction) => UserCtrl.logoutUserCtrl(req, res));
router.route("/user-cart").get(auth, (req: Request, res: Response) => UserCtrl.getUserCartController(req, res));
router.route("/get-orders").get(auth, (req: Request, res: Response) => UserCtrl.getOrdersController(req, res));
router.route("/empty-cart").delete(auth, (req: Request, res: Response) => UserCtrl.emptyCartCtrl(req, res));
router.route("/getallorders").get(auth, isAdmin, (req: Request, res: Response, next: NextFunction) => UserCtrl.getAllOrdersController(req, res, next));
router.route("/forgotpassword").post((req: Request, res: Response, next: NextFunction) => UserCtrl.forgotPassword(req, res, next));
router.route("/resetpassword/:token").patch((req: Request, res: Response, next: NextFunction) => UserCtrl.passwordReset(req, res, next));
router.route("/wishlist/:id").get(auth, (req: Request, res: Response) => UserCtrl.getWishList(req, res));
router.route("/getorderbyuser/:id").get(auth, isAdmin, (req: Request, res: Response) => UserCtrl.getOrderByUserIDController(req, res));
router.route("/:id").get((req: Request, res: Response, next: NextFunction) => UserCtrl.getUser(req, res, next));
router.route("/:id").delete((req: Request, res: Response, next: NextFunction) => UserCtrl.deleteUser(req, res, next));
router.route("/:id").patch(auth, isAdmin, (req: Request, res: Response, next: NextFunction) => UserCtrl.updateuserCtrl(req, res, next));
router.route("/block-user/:id").patch(auth, isAdmin, (req: Request, res: Response, next: NextFunction) => UserCtrl.blockUserCtrl(req, res, next));
router.route("/unblock-user/:id").patch(auth, isAdmin, (req: Request, res: Response, next: NextFunction) => UserCtrl.UnBlockUserCtrl(req, res, next));
router.route("/order/update-order/:id").put(auth, isAdmin, (req: Request, res: Response) => UserCtrl.UpdateOrderStatusController(req, res));

export default router;