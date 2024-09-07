import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { generateRefreshToken } from "@/helpers/utils/refreshToken";
import {
  create_user_service,
  login_user_service,
  get_all_users_service,
  get_single_user_service,
  delete_single_user,
  updateUserService,
  blockUserService,
  unBlockUserService,
  handle_refresh_token_service,
  LogoutService,
  fgtPwdService,
  resetPwdService,
  login_admin_service,
  addToWishListService,
  getWishListService,
  saveAddress_service,
  userCartService,
  getUserCartService,
  emptyCartService,
  applyCouponService,
  CreateOrderService,
  getOrderService,
  getAllOrdersService,
  getOrderByUserIdService,
  updateOrderStatus_service,
} from "@/services/user.service";

import { AuthenticatedRequest } from "@/interfaces/authenticateRequest";
import { CustomAPIError } from "@/utils/custom-errors";
import { validateUser, userWithID } from "@/config/validation";

// User Signup controller
export const create_a_user = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.body) {
      throw new Error("The body property is required.");
    }

    const validateData = validateUser.parse(req.body);

    // Callling the create_user_service function.
    const { newUser, userToken } = await create_user_service(validateData);
    res
      .status(StatusCodes.CREATED)
      .json({ UserData: { userEmail: newUser.email }, token: userToken });
  }
);

// User Login Controller
export const LoginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Pass email and password separately to login_user_service
    const { userExists, token, updateLoggedUser } = await login_user_service({
      email,
      password,
    });

    // checking if the user with the email exists or not.
    if (!userExists) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        errMessage: `The user with the email: ${email} is not registered`,
      });
    }
    const refreshToken = generateRefreshToken(userExists._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(StatusCodes.OK).json({
      userData: { userEmail: email },
      Token: token,
      refToken: updateLoggedUser?.refreshToken,
    });
  }
);

// Admin Login Controller
export const LoginAdmin = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Pass email and password separately to login_user_service
    const { AdminExists, token, updateLoggedUser } = await login_admin_service({
      email,
      password,
    });

    // checking if the user with the email exists or not.
    if (!AdminExists) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        errMessage: `The user with the email: ${email} is not registered`,
      });
    }
    const refreshToken = generateRefreshToken(AdminExists._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(StatusCodes.OK).json({
      userData: { userEmail: email },
      Token: token,
      refToken: updateLoggedUser?.refreshToken,
    });
  }
);

// Get all users Controller
export const getAllUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const users = await get_all_users_service();
    //console.log(users);
    res.status(StatusCodes.OK).json({ numberOfUsers: users.length, users });
  }
);

//Get a single user controller
export const getUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Destructuring the _id field from the req.params
    const { id } = req.params;

    const userDataID = await get_single_user_service(id);

    res.status(StatusCodes.OK).json({ userDataID });
  }
);

// Deleting a single user controller
export const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Destructuring the ID field for req.params
    const { id } = req.params;
    const userDataId = await delete_single_user({ id });
    res
      .status(StatusCodes.OK)
      .json({ status: "Deleted User Successfully", userDataId });
  }
);

// Updating the user controller
export const updateuserCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updatedUser = await updateUserService({ id }, req.body);
    res
      .status(StatusCodes.OK)
      .json({ status: "successfully Updated User", updatedUser });
  }
);

// Block User controller
export const blockUserCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    // console.log(id);
    const blockedUser = await blockUserService({ id });
    res.status(StatusCodes.OK).json({
      status: "User blocked Successfully",
      userData: { userBlocked: blockedUser.isBlocked },
    });
  }
);

// Unblock User
export const UnBlockUserCtrl = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // console.log(req.user);
    const { id } = req.params;
    // console.log(id);
    const unblockedUser = await unBlockUserService({ id });
    res.status(StatusCodes.OK).json({
      status: `User Un-Blocked Successfully`,
      userData: { userBlocked: unblockedUser.isBlocked },
    });
  }
);

// Handle refresh Token controller
export const handleRefreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { cookies } = req;
    const accessTokens = await handle_refresh_token_service(cookies);
    console.log(accessTokens);
    res.status(StatusCodes.OK).json({ A_T: accessTokens });
  }
);

// Log out controller functionality
export const logoutUserCtrl = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await LogoutService(refreshToken);
    if (!result) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      res.sendStatus(204); // forbidden
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(200); // success
  }
);

// forgot password controller
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    await fgtPwdService(email);
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Password reset link sent to the user email.",
    });
  }
);

export const passwordReset = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
      await resetPwdService(token, password, confirmPassword);

      res.status(StatusCodes.OK).json({
        status: "Success",
        message: "Password reset Successful",
      });
    } catch (error: any) {
      res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
    }
  }
);

// add to wishlists controller
export const addToWishList = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userId = req?.user?.id;
  if (!userId) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: "User not authenticated" });
    return;
  }
  const { prodId } = req.body;

  try {
    const updatedUser = await addToWishListService(userId, prodId);
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

export const getWishList = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const id = req?.user?.id;
  console.log("User ID:", id);
  try {
    if (!id) {
      res.status(StatusCodes.NOT_FOUND).json({ error: `ID: ${id} Not found` });
    }
    const findUser = await getWishListService(id);
    res.status(StatusCodes.OK).json({ userData: findUser });
  } catch (error: any) {
    throw new CustomAPIError(
      `Server Error: ${error.message}`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const saveAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const id: string = req?.user?.id ?? "";
  try {
    const updatedUser = await saveAddress_service(id, req?.body?.address);
    if (!updatedUser) {
      res.status(404).json({ error: `User with ID ${id} not found` });
      return;
    }
    res.status(StatusCodes.OK).json({ userData: updatedUser });
  } catch (error) {
    // console.error("Error in saveAddress:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Could not save address" });
  }
};

export const userCartCtrl = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { cart } = req.body;
    const id = req?.user?.id;

    // Validate the user's MongoDB ID

    if (!id) {
      res
        .status(400)
        .json({ error: `The User-ID: ${id} is invalid or doesn't exist` });
      return;
    }

    const updatedCart = await userCartService(id, cart);

    if (!updatedCart) {
      res.status(500).json({ error: "Could not update user cart" });
      return;
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(StatusCodes.NOT_ACCEPTABLE).json({
      error: `Couldn't add Item to cart cause Item is already on the cart.`,
    });
  }
};

export const getUserCartController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const id = req?.user?.id;
  // console.log(req.user);
  if (!id) throw new CustomAPIError("Invalid user ID", StatusCodes.NOT_FOUND);
  // console.log("ID data from controller: ", id);

  try {
    const cart = await getUserCartService(id);

    if (!cart) {
      throw new CustomAPIError(
        "Cart not found or empty",
        StatusCodes.NOT_FOUND
      );
    }

    res.status(StatusCodes.OK).json({ cartData: cart });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const emptyCartCtrl = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const id = req?.user?.id;
  if (!id) {
    throw new CustomAPIError("invalid User ID", StatusCodes.NOT_ACCEPTABLE);
  }
  try {
    const emptyCart = await emptyCartService(id);
    res.json({ message: "Cart has been emptied", cartData: emptyCart });
  } catch (error: any) {
    console.error("Error in emptyCartCtrl:", error);
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const applyCouponCtrl = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { coupon } = req.body;
  const userId = req.user?.id;

  if (!userId)
    throw new CustomAPIError(
      `User ID: ${userId} is invalid`,
      StatusCodes.NOT_ACCEPTABLE
    );

  try {
    const totalAfterDiscount = await applyCouponService(userId, coupon);
    res.status(StatusCodes.OK).json({ discount: totalAfterDiscount });
  } catch (error: any) {
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
  return;
};

export const createOrderCtrl = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { COD, couponApplied } = req.body;
    const userId = req?.user?.id;

    if (!userId) {
      throw new CustomAPIError("Invalid user ID", StatusCodes.BAD_REQUEST);
    }

    await CreateOrderService({ userId, COD, couponApplied });
    res.json({ message: "Success!" });
  } catch (error: any) {
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getOrdersController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userID = req?.user?.id;

  try {
    if (!userID) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid user ID" });
      return;
    }
    const userOrders = await getOrderService(userID);

    res.status(StatusCodes.OK).json({ user_orders: userOrders });
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const getAllOrdersController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const allUsers = await getAllOrdersService();
    res.status(StatusCodes.OK).json({ users_data: allUsers });
  }
);

export const getOrderByUserIDController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const userID = req?.user?.id;

  try {
    if (typeof userID === "string") {
      const order = await getOrderByUserIdService(userID);
      if (!order) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid User Order" });
        return;
      }
      res.status(StatusCodes.OK).json({ userorders: order });
    } else {
      throw new Error("User Order Cannot be processed.");
    }
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

export const UpdateOrderStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updatedOrder = await updateOrderStatus_service({ status, id });
    res.status(StatusCodes.OK).json(updatedOrder);
  } catch (error: any) {
    res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
