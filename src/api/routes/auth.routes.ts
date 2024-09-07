import express from "express";
import {
  create_a_user,
  LoginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateuserCtrl,
  blockUserCtrl,
  UnBlockUserCtrl,
  handleRefreshToken,
  logoutUserCtrl,
  forgotPassword,
  passwordReset,
  LoginAdmin,
  addToWishList,
  getWishList,
  saveAddress,
  userCartCtrl,
  getUserCartController,
  emptyCartCtrl,
  applyCouponCtrl,
  createOrderCtrl,
  getOrdersController,
  getAllOrdersController,
  getOrderByUserIDController,
  UpdateOrderStatusController,
} from "@/controllers/userCtrls";
import { auth, isAdmin } from "@/middlewares/authMiddleware";

const authRoute = express.Router();

authRoute.post("/signup", create_a_user);
authRoute.post("/login", LoginUser);
authRoute.post("/admin-login", LoginAdmin);
authRoute.post("/cart/cash-order", auth, createOrderCtrl);
authRoute.post("/cart", auth, userCartCtrl);
authRoute.post("/cart/applycoupon", auth, applyCouponCtrl);

authRoute.put("/save-address", auth, saveAddress);
authRoute.put("/wishlist", auth, addToWishList);

authRoute.get("/allusers", auth, isAdmin, getAllUser);
authRoute.get("/refresh-token", handleRefreshToken);
authRoute.get("/logout", logoutUserCtrl);
authRoute.get("/user-cart", auth, getUserCartController);
authRoute.get("/get-orders", auth, getOrdersController);

authRoute.delete("/empty-cart", auth, emptyCartCtrl);
authRoute.get("/getallorders", auth, isAdmin, getAllOrdersController);
authRoute.post("/forgotpassword", forgotPassword);
authRoute.patch("/resetpassword/:token", passwordReset);

authRoute.get("/wishlist/:id", auth, getWishList);
authRoute.get("/getorderbyuser/:id", auth, isAdmin, getOrderByUserIDController);
authRoute.get("/:id", getUser);
authRoute.delete("/:id", deleteUser);
authRoute.patch("/:id", auth, isAdmin, updateuserCtrl);
authRoute.patch("/block-user/:id", auth, isAdmin, blockUserCtrl);
authRoute.patch("/unblock-user/:id", auth, isAdmin, UnBlockUserCtrl);
authRoute.put(
  "/order/update-order/:id",
  auth,
  isAdmin,
  UpdateOrderStatusController
);

export default authRoute;
