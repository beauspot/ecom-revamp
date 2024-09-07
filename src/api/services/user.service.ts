import { authModel } from "../models/userModels";
import { UserOrderModel } from "../models/orderModel";
import { productModel } from "../models/productsModels";
import { CouponModel } from "../models/coupon.models";
import { UserCartModel } from "../models/cartModel";
import { mailer } from "@/config/nodeMailer";
import CustomAPIError from "@/helpers/utils/custom-errors";
import UnauthenticatedError from "@/helpers/utils/unauthenticated";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { StatusCodes } from "http-status-codes";
import { generateToken } from "@/helpers/utils/jsonWebToken";
import { generateRefreshToken } from "../helpers/utils/refreshToken";
import { UserDataInterface } from "@/interfaces/user_interface";
import {
  OrderInterface,
  UpdateOrderStatusParams,
} from "@/interfaces/order_interface";
import jwt from "jsonwebtoken";
import { blacklistTokens } from "@/models/blacklistTokens";
import crypto from "crypto";
import { IDecoded } from "@/interfaces/authenticateRequest";
import { CartItem } from "@/interfaces/cartModel_Interface";
import { CartModelInterface } from "@/interfaces/cartModel_Interface";
import { CreateOrderParams } from "@/interfaces/create_order";
import uniqid from "uniqid";

import dotenv from "dotenv";

dotenv.config();

// User signup Services
export const create_user_service = async (
  userData: Partial<UserDataInterface>
) => {
  try {
    const newUser = await authModel.create({ ...userData });
    const userToken = newUser.createJWT();

    // Send a welcome
    const { email } = newUser;
    const subject = "Welcome to Online Shopping Mall";
    const text = "This is an online shopping mall shop with ease";

    mailer(email, subject, text);
    return { newUser, userToken };
  } catch (error: any) {
    throw new Error(`Error signing up new User: ${error.message}`);
  }
};

// Login User service
export const login_user_service = async (
  userData: Partial<UserDataInterface>
) => {
  const { email, password } = userData; // Extract Email and Password from userData

  // checking if both fields are omitted
  if (!email || !password) {
    throw new CustomAPIError(
      `Email and Password are required for login.`,
      StatusCodes.BAD_REQUEST
    );
  }
  const userExists = await authModel.findOne({ email: email });
  if (!userExists) {
    throw new UnauthenticatedError(
      "Password or email didn't match any on our database",
      StatusCodes.NOT_FOUND
    );
  }
  // comparing the password of the user.
  const isMatch = await userExists.comparePwd(password);
  if (!isMatch) {
    throw new UnauthenticatedError(
      "Password or email didn't match any on our database",
      StatusCodes.NOT_FOUND
    );
  } else {
    //const token = userExists.createJWT();
    const token: string = generateToken(userExists._id);
    const refreshToken = generateRefreshToken(userExists._id);
    const updateLoggedUser = await authModel.findByIdAndUpdate(
      userExists._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    return { userExists, token, updateLoggedUser };
  }
};

// Login Admin Service
export const login_admin_service = async (
  AdminData: Partial<UserDataInterface>
) => {
  const { email, password } = AdminData; // Extract Email and Password from userData

  // checking if both fields are omitted
  if (!email || !password) {
    throw new CustomAPIError(
      `Email and Password are required for login.`,
      StatusCodes.BAD_REQUEST
    );
  }
  const AdminExists = await authModel.findOne({ email: email });

  if (!AdminExists) {
    throw new UnauthenticatedError(
      "Password or email didn't match any on our database",
      StatusCodes.NOT_FOUND
    );
  }

  // checking fot the role of the Admin
  if (AdminExists.role !== "admin")
    throw new CustomAPIError(
      `The User is not an administrator`,
      StatusCodes.BAD_REQUEST
    );

  // comparing the password of the user.
  const isMatch = await AdminExists.comparePwd(password);
  if (!isMatch) {
    throw new UnauthenticatedError(
      "Password or email didn't match any on our database",
      StatusCodes.NOT_FOUND
    );
  } else {
    //const token = userExists.createJWT();
    const token: string = generateToken(AdminExists._id);
    const refreshToken = generateRefreshToken(AdminExists._id);
    const updateLoggedUser = await authModel.findByIdAndUpdate(
      AdminExists._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    return { AdminExists, token, updateLoggedUser };
  }
};

// get all users service
export const get_all_users_service = async (): Promise<UserDataInterface[]> => {
  const getUsers = await authModel.find();
  if (getUsers.length <= 0) {
    throw new CustomAPIError(`No users found`, StatusCodes.NO_CONTENT);
  }
  return getUsers;
};

// Get a Single user Service
export const get_single_user_service = async (
  userID: string
): Promise<UserDataInterface> => {
  const id = userID; // destructure the user ID from the user
  validateMongoDbID(id);
  const userExists = await authModel.findById({ _id: id });
  console.log(userExists);
  if (!userExists) {
    throw new CustomAPIError(
      `The User with the ID: ${id} does not exist`,
      StatusCodes.NOT_FOUND
    );
  }
  return userExists;
};

//Delete a single user service
export const delete_single_user = async (
  userId: Partial<UserDataInterface>
): Promise<UserDataInterface> => {
  const { id } = userId;
  validateMongoDbID(id);
  const user = await authModel.findByIdAndDelete(id).lean();
  // console.log(user);
  if (!user) {
    throw new CustomAPIError(
      `The user with the ID: ${id} does not exist`,
      StatusCodes.NOT_FOUND
    );
  }
  const deletedUser = user as UserDataInterface;
  return deletedUser;
};

// Updating the user Service
export const updateUserService = async (
  userId: Partial<UserDataInterface>,
  updateData: UserDataInterface
): Promise<UserDataInterface> => {
  const { id } = userId;
  validateMongoDbID(id);
  const updateuser = await authModel.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  console.log(userId);
  if (!updateuser) {
    throw new CustomAPIError(
      `The user with the id: ${id} was not found to be updated`,
      StatusCodes.NOT_FOUND
    );
  }
  return updateuser;
};

// blocking a user service
export const blockUserService = async (
  User: Partial<UserDataInterface>
): Promise<UserDataInterface> => {
  const { id } = User;
  validateMongoDbID(id);
  const blockUser = await authModel.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
  if (!blockUser) {
    throw new UnauthenticatedError(
      "The User is not avauilable on our database",
      StatusCodes.NO_CONTENT
    );
  } else {
    return blockUser;
  }
};

// unblocking a user
export const unBlockUserService = async (
  User: Partial<UserDataInterface>
): Promise<UserDataInterface> => {
  const { id } = User;
  validateMongoDbID(id);
  const unblockuser = await authModel.findByIdAndUpdate(
    id,
    { isBlocked: false },
    {
      new: true,
    }
  );
  if (!unblockuser)
    throw new UnauthenticatedError(
      "The User is not avauilable on our database",
      StatusCodes.NO_CONTENT
    );
  return unblockuser;
};

// handle refresh Token service
export const handle_refresh_token_service = async (
  cookies: UserDataInterface
) => {
  const refreshToken = cookies.refreshToken;
  if (!refreshToken) {
    throw new CustomAPIError(
      "There is no refresh token in cookies",
      StatusCodes.NOT_FOUND
    );
  }
  const token = await authModel.findOne({ refreshToken });
  if (!token)
    throw new CustomAPIError(
      "There are no refresh Tokens in cookies",
      StatusCodes.UNAUTHORIZED
    );
  let accessToken;
  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET!, (err, decoded) => {
      const decodeJWT = decoded as IDecoded;
      console.log("decodedData: ", decodeJWT);
      if (err || !decoded || token.id !== decodeJWT.id) {
        throw new CustomAPIError(
          "There is something wrong with the refresh token",
          StatusCodes.NOT_ACCEPTABLE
        );
      }
      accessToken = generateToken(token.id);
    });
  } catch (error) {
    throw new CustomAPIError(
      "Error verifying refresh token",
      StatusCodes.UNAUTHORIZED
    );
  }
  return accessToken;
};

// Logout Service functionality
export const LogoutService = async (
  cookies: string
): Promise<UserDataInterface | void> => {
  const refreshToken = cookies;

  if (!refreshToken) {
    throw new CustomAPIError(
      "There is no refresh token in cookies",
      StatusCodes.NOT_FOUND
    );
  }
  const token = await authModel.findOne({ refreshToken });

  if (!token) {
    throw new CustomAPIError(
      "There are no refresh token in cookies",
      StatusCodes.UNAUTHORIZED
    );
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_SECRET!, (err, decoded) => {
      const decodeJWT = decoded as IDecoded;
      console.log("decodedData: ", decodeJWT);
      if (err || token.id !== decodeJWT.id) {
        throw new CustomAPIError(
          "There is something wrong with the refresh token",
          StatusCodes.NOT_ACCEPTABLE
        );
      }

      // Assuming we have a blacklistTokens model
      blacklistTokens.create({ token: refreshToken });
    });
  } catch (error) {
    throw new CustomAPIError(
      "Error verifying refresh token",
      StatusCodes.UNAUTHORIZED
    );
  }
};

// Forgot password service
export const fgtPwdService = async (
  user_email: string
): Promise<UserDataInterface | void> => {
  try {
    const user = await authModel.findOne({ email: user_email });

    if (!user) {
      throw new CustomAPIError(
        `We could not find a user with the given email ${user_email}`,
        StatusCodes.NOT_ACCEPTABLE
      );
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:4040/api/v1/users/resetPassword/${resetToken}`;
    const message = `We have received a password reset request. 
    Please use the link below to reset your password:\n\n${resetUrl}\n\nThis link expires after 10 minutes.`;
    const subject = "Password reset request received";
    mailer(user_email, subject, message);
  } catch (error) {
    throw new CustomAPIError(
      "Could not reset password",
      StatusCodes.BAD_REQUEST
    );
  }
};

// Reset password service
export const resetPwdService = async (
  token: string,
  newPassword: string,
  confirmPassword: string
): Promise<UserDataInterface | void> => {
  // checking if the user exists with the given token & has not expired.
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await authModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new CustomAPIError(
      "Token is invalid or it has expired!",
      StatusCodes.BAD_REQUEST
    );
  }

  // Resetting the user password
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = new Date(Date.now());

  await user.save();

  return user;
};

// add to wishlist functionality
export const addToWishListService = async (userID: string, prodID: string) => {
  try {
    const user = await authModel.findById(userID);
    // console.log(user);
    if (!user) {
      // Handle the case where user is not found
      throw new CustomAPIError("User not found", StatusCodes.NOT_FOUND);
    }
    const alreadyAdded = user.wishlists.find((id) => id.toString() === prodID);

    if (alreadyAdded) {
      return await authModel.findByIdAndUpdate(
        userID,
        {
          $pull: { wishlists: prodID },
        },
        {
          new: true,
        }
      );
    } else {
      return await authModel.findByIdAndUpdate(
        userID,
        {
          $push: { wishlists: prodID },
        },
        {
          new: true,
        }
      );
    }
  } catch (err) {
    throw new CustomAPIError(
      "Could not add product to wishlists",
      StatusCodes.BAD_REQUEST
    );
  }
};

export const getWishListService = async (
  userId: string | undefined
): Promise<UserDataInterface> => {
  const finduser = await authModel.findById(userId).populate("wishlists");
  console.log("find User Data: finduser");
  try {
    if (!finduser) {
      throw new CustomAPIError(
        `The User with the ID: ${userId} does not exist`,
        StatusCodes.NOT_FOUND
      );
    }
    console.log("find User Data:", finduser);
    return finduser;
  } catch (error) {
    throw new Error("Could not retrieve wishlist");
  }
};

export const saveAddress_service = async (userID: string, address: string) => {
  validateMongoDbID(userID);
  try {
    const updateUser = await authModel.findByIdAndUpdate(
      userID,
      { address },
      { new: true }
    );
    if (!updateUser) {
      throw new Error(`User with ID ${userID} not found`);
    }
    console.log("user data: ", updateUser);
    return updateUser;
  } catch (error) {
    // console.error("Error while updating user:", error);
    throw new Error("Could not save address");
  }
};

export const userCartService = async (userId: string, cart: CartItem[]) => {
  let products = [];

  const user = await authModel.findById(userId);

  // checking if the user already has a cart.
  const userAlreadyHascart = await UserCartModel.findOne({
    orderby: user?._id,
  });
  if (userAlreadyHascart) {
    userAlreadyHascart.remove();
  }

  for (let i = 0; i < cart.length; i++) {
    let cartItem = {
      product: cart[i].id,
      count: cart[i].count,
      color: cart[i].color,
      price: 0,
    };

    const getPrice = await productModel
      .findById(cart[i].id)
      .select("price")
      .exec();
    if (getPrice) {
      cartItem.price = getPrice.price;
    }

    products.push(cartItem);
  }

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  const newCart = await new UserCartModel({
    products,
    cartTotal,
    orderby: user?._id,
  }).save();
  return newCart;
};

// this needs to be worked on there is a bug in it...
export const getUserCartService = async (
  userId: string
): Promise<CartModelInterface | null> => {
  // console.log("User ID Data: ", userId);
  validateMongoDbID(userId);
  try {
    const cart = await UserCartModel.findOne({ orderby: userId }).populate(
      "products.product",
      "_id title price totalAfterDiscount"
    );
    // console.log(cart);
    return cart;
  } catch (error) {
    throw new CustomAPIError(
      "Could not retrieve user's cart",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const emptyCartService = async (
  userId: string
): Promise<CartModelInterface | void> => {
  validateMongoDbID(userId);
  try {
    const user = await authModel.findOne({ _id: userId });
    if (!user) {
      throw new CustomAPIError("User not found", StatusCodes.NOT_FOUND);
    }
    const cart = await UserCartModel.findOneAndRemove({ orderby: userId });
    if (!cart) {
      throw new CustomAPIError("Cart not found", StatusCodes.NOT_FOUND);
    }
    return cart;
  } catch (error) {
    console.error("Error in emptyCartService:", error);
    throw new CustomAPIError(
      "Couldn't empty the cart",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const applyCouponService = async (
  userId: string,
  coupon: string
): Promise<number> => {
  validateMongoDbID(userId);

  const validCoupon = await CouponModel.findOne({ name: coupon });
  if (!validCoupon) {
    throw new CustomAPIError("Invalid Coupon", StatusCodes.BAD_REQUEST);
  }
  const user = await authModel.findOne({ _id: userId });
  if (!user) {
    throw new CustomAPIError("User not found", StatusCodes.NOT_FOUND);
  }

  // Use optional chaining to access cartTotal safely
  const userCart = await UserCartModel.findOne({ orderby: userId })?.populate(
    "products.product"
  );

  if (!userCart) {
    throw new CustomAPIError("User cart not found", StatusCodes.NOT_FOUND);
  }

  const cartTotal = userCart.cartTotal || 0;

  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  await UserCartModel.findOneAndUpdate(
    { orderby: userId },
    { totalAfterDiscount },
    { new: true }
  );

  return parseFloat(totalAfterDiscount);
};

export const CreateOrderService = async ({
  userId,
  COD,
  couponApplied,
}: CreateOrderParams): Promise<void> => {
  try {
    validateMongoDbID(userId);
    const user = await authModel.findById(userId);
    if (!user)
      throw new CustomAPIError("User not found", StatusCodes.NOT_FOUND);

    const userCart = await UserCartModel.findOne({ orderby: userId });
    if (!userCart)
      throw new CustomAPIError("User cart not found", StatusCodes.NOT_FOUND);

    let finalAmount =
      couponApplied && userCart.totalAfterDiscount
        ? userCart.totalAfterDiscount
        : userCart.cartTotal;

    const paymentMethod = COD ? "COD" : "Online Payment";

    const newOrder = await new UserOrderModel({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmount,
        status: COD ? "Cash on Delivery" : "Paid Online",
        created: Date.now(),
        currency: "usd",
      },
      orderby: userId,
      orderStatus: COD ? "Cash on Delivery" : "Paid Online",
    }).save();

    if (Array.isArray(userCart.products)) {
      let update = userCart.products.map((item) => {
        return {
          updateOne: {
            filter: { id: item.product._id }, // this is where the error is coming
            update: { $inc: { quantity: -item.count, sold: +item.count } },
          },
        };
      });
      await productModel.bulkWrite(update, {});
    } else {
      // console.error("Product or product._id is undefined:", item);
      throw new Error(`${userCart.products} is not an array`);
      // return null;
    }
  } catch (error) {
    throw new CustomAPIError(
      "Failed To Create Orders",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getOrderService = async (userId: string) => {
  validateMongoDbID(userId);
  console.log(`User ID: ${userId}`);
  try {
    const userOrders = await UserOrderModel.findOne({ orderby: userId })
      .populate("products.product")
      .populate("orderby")
      .exec();
    return userOrders;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllOrdersService = async () => {
  try {
    const alluserorders = await UserOrderModel.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    return alluserorders;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getOrderByUserIdService = async (userId: string) => {
  validateMongoDbID(userId);
  try {
    const user_orders = await UserOrderModel.findOne({ orderby: userId })
      .populate("products.product")
      .populate("orderby")
      .exec();
    return user_orders;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateOrderStatus_service = async ({
  status,
  id,
}: UpdateOrderStatusParams): Promise<OrderInterface | null> => {
  try {
    validateMongoDbID(id);
    const update = {
      orderStatus: status,
      paymentIntent: {
        status: status,
      },
    };

    const updatedOrder = await UserOrderModel.findOneAndUpdate(
      { _id: id },
      update,
      { new: true }
    );

    if (!updatedOrder) {
      throw new CustomAPIError("Order Not Found", StatusCodes.NOT_FOUND);
    }
    return updatedOrder;
  } catch (error: any) {
    console.log(error.message);
    throw new CustomAPIError("Failed to update order status", 500);
  }
};
