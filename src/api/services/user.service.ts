import crypto from "crypto";
import uniqid from "uniqid";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Service, Inject } from "typedi";

import logger from "@/utils/logger";
import { authModel } from "@/models/userModels";
import { UserOrderModel } from "@/models/orderModel";
import { productModel } from "@/models/productsModels";
import { CouponModel } from "@/models/coupon.models";
import { UserCartModel } from "@/models/cartModel";

import { mailer } from "@/config/nodeMailer";
import {ServiceAPIError}  from "@/helpers/utils/custom-errors";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { generateToken } from "@/helpers/utils/jsonWebToken";
import { generateRefreshToken } from "@/helpers/utils/refreshToken";
import { UserDataInterface } from "@/interfaces/user_interface";
import {
  OrderInterface,
  UpdateOrderStatusParams,
} from "@/interfaces/order_interface";
import { blacklistTokens } from "@/models/blacklistTokens";
import { IDecoded } from "@/interfaces/authenticateRequest";
import { CartItem } from "@/interfaces/cartModel_Interface";
import { CreateOrderParams } from "@/interfaces/create_order";
import { CartModelInterface } from "@/interfaces/cartModel_Interface";


dotenv.config();

@Service()
export class UserService {
  constructor(
    @Inject(() => authModel) private auth: typeof authModel,
    @Inject(() => productModel) private product: typeof productModel,
    @Inject(() => UserOrderModel) private order: typeof UserOrderModel,
    @Inject(() => UserCartModel) private cart: typeof UserCartModel,
    @Inject(() => CouponModel) private coupon: typeof CouponModel,
    @Inject(() => blacklistTokens) private blacklisttokens: typeof blacklistTokens
  ) { }
  
  // User signup Services
  create_user_service = async (
    userData: Partial<UserDataInterface>
  ) => {
    const newUser = await this.auth.create({ ...userData });
    const userToken = newUser.createJWT();

    // Send a welcome
    const { email } = newUser;
    const subject = "Welcome to Online Shopping Mall";
    const text = "This is an online shopping mall shop with ease";

    mailer(email, subject, text);
    return { newUser, userToken };
    
  };
    
  // Login User service
  login_user_service = async (
    userData: Partial<UserDataInterface>
  ) => {
    const { email, password } = userData; // Extract Email and Password from userData

    // checking if both fields are omitted
    if (!email || !password) {
      throw new ServiceAPIError(
        `Email and Password are required for login.`
      );
    }
    const userExists = await this.auth.findOne({ email: email });
    if (!userExists) {
      throw new ServiceAPIError(
        "Password or email didn't match any on our database"
      );
    }
    // comparing the password of the user.
    const isMatch = await userExists.comparePwd(password);
    if (!isMatch) {
      throw new ServiceAPIError(
        "Password or email didn't match any on our database"
      );
    } else {
      //const token = userExists.createJWT();
      const token: string = generateToken(userExists._id);
      const refreshToken = generateRefreshToken(userExists._id);
      const updateLoggedUser = await this.auth.findByIdAndUpdate(
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
  login_admin_service = async (
    AdminData: Partial<UserDataInterface>
  ) => {
    const { email, password } = AdminData; // Extract Email and Password from userData

    // checking if both fields are omitted
    if (!email || !password) {
      throw new ServiceAPIError(
        `Email and Password are required for login.`
      );
    }
    const AdminExists = await this.auth.findOne({ email: email });

    if (!AdminExists) {
      throw new ServiceAPIError(
        "Password or email didn't match any on our database"
      );
    }

    // checking fot the role of the Admin
    if (AdminExists.role !== "admin")
      throw new ServiceAPIError(
        `The User is not an administrator`
      );

    // comparing the password of the user.
    const isMatch = await AdminExists.comparePwd(password);
    if (!isMatch) {
      throw new ServiceAPIError(
        "Password or email didn't match any on our database"
      );
    } else {
      //const token = userExists.createJWT();
      const token: string = generateToken(AdminExists._id);
      const refreshToken = generateRefreshToken(AdminExists._id);
      const updateLoggedUser = await this.auth.findByIdAndUpdate(
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
  get_all_users_service = async (): Promise<UserDataInterface[]> => {
    const getUsers = await this.auth.find();
    if (getUsers.length <= 0) throw new ServiceAPIError(`No users found`);
    return getUsers;
  };
  
  // Get a Single user Service
  get_single_user_service = async (
    userID: string
  ): Promise<UserDataInterface> => {
    const id = userID; // destructure the user ID from the user
    validateMongoDbID(id);
    const userExists = await this.auth.findById({ _id: id });
    console.log(userExists);
    if (!userExists) {
      throw new ServiceAPIError(
        `The User with the ID: ${id} does not exist`
      );
    }
    return userExists;
  };

  //Delete a single user service
  delete_single_user = async (
    userId: Partial<UserDataInterface>
  ): Promise<UserDataInterface> => {
    const { id } = userId;
    validateMongoDbID(id);
    const user = await this.auth.findByIdAndDelete(id).lean();
    // console.log(user);
    if (!user) {
      throw new ServiceAPIError(
        `The user with the ID: ${id} does not exist`
      );
    }
    const deletedUser = user as UserDataInterface;
    return deletedUser;
  };
  
  // Updating the user Service
  updateUserService = async (
    userId: Partial<UserDataInterface>,
    updateData: UserDataInterface
  ): Promise<UserDataInterface> => {
    const { id } = userId;
    validateMongoDbID(id);
    const updateuser = await this.auth.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
      runValidators: true,
    });
    // console.log(userId);
    if (!updateuser) {
      throw new ServiceAPIError(
        `The user with the id: ${id} was not found to be update`
      );
    }
    return updateuser;
  };
  
  // blocking a user service
  blockUserService = async (
    User: Partial<UserDataInterface>
  ): Promise<UserDataInterface> => {
    const { id } = User;
    validateMongoDbID(id);
    const blockUser = await this.auth.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    if (!blockUser) {
      throw new ServiceAPIError(
        "The User is not avauilable on our database"
      );
    } else {
      return blockUser;
    }
  };
  
  // unblocking a user
  unBlockUserService = async (
    User: Partial<UserDataInterface>
  ): Promise<UserDataInterface> => {
    const { id } = User;
    validateMongoDbID(id);
    const unblockuser = await this.auth.findByIdAndUpdate(
      id,
      { isBlocked: false },
      {
        new: true,
      }
    );
    if (!unblockuser)
      throw new ServiceAPIError(
        "The User is not avauilable on our database"
      );
    return unblockuser;
  };
  
  // handle refresh Token service
  handle_refresh_token_service = async (
    cookies: UserDataInterface
  ) => {
    const refreshToken = cookies.refreshToken;
    if (!refreshToken) {
      throw new ServiceAPIError(
        "There is no refresh token in cookies"
      );
    }
    const token = await this.auth.findOne({ refreshToken });
    if (!token)
      throw new ServiceAPIError(
        "There are no refresh Tokens in cookies"
      );
    let accessToken;
    jwt.verify(refreshToken, process.env.JWT_SECRET!, (err, decoded) => {
      const decodeJWT = decoded as IDecoded;
      console.log("decodedData: ", decodeJWT);
      if (err || !decoded || token.id !== decodeJWT.id) {
        throw new ServiceAPIError(
          "There is something wrong with the refresh token"
        );
      }
      accessToken = generateToken(token.id);
    });
  
    return accessToken;
  };
  
  // Logout Service functionality
  LogoutService = async (
    cookies: string
  ): Promise<UserDataInterface | void> => {
    const refreshToken = cookies;

    if (!refreshToken) {
      throw new ServiceAPIError(
        "There is no refresh token in cookies"
      );
    }
    const token = await this.auth.findOne({ refreshToken });

    if (!token) {
      // logger.error("error ln 291");
      throw new ServiceAPIError(
        "There are no refresh token in cookies"
      );
    };
    
    jwt.verify(refreshToken, process.env.JWT_SECRET as string, (err, decoded) => {
      const decodeJWT = decoded as IDecoded;
      logger.info("decodedData: ", decodeJWT);
      if (err || token.id !== decodeJWT.id) {
        // logger.error(err);
        throw new ServiceAPIError(
          "There is something wrong with the refresh token"
        )
      };

      // Assuming we have a blacklistTokens model
      this.blacklisttokens.create({ token: refreshToken });
    });

  };
  
  // Forgot password service
  fgtPwdService = async (
    user_email: string
  ): Promise<UserDataInterface | void> => {
  
    const user = await this.auth.findOne({ email: user_email });

    if (!user) {
      throw new ServiceAPIError(
        `We could not find a user with the given email ${user_email}`
      );
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:4040/api/v1/users/resetPassword/${resetToken}`;
    const message = `We have received a password reset request. 
    Please use the link below to reset your password:\n\n${resetUrl}\n\nThis link expires after 10 minutes.`;
    const subject = "Password reset request received";
    mailer(user_email, subject, message);
  };
  
  // Reset password service
  resetPwdService = async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<UserDataInterface | void> => {
    // checking if the user exists with the given token & has not expired.
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await this.auth.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ServiceAPIError(
        "Token is invalid or it has expired!"
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
  addToWishListService = async (userID: string, prodID: string) => {
 
    const user = await this.auth.findById(userID);
    // console.log(user);
    if (!user) {
      // Handle the case where user is not found
      throw new ServiceAPIError("User not found");
    }
    const alreadyAdded = user.wishlists.find((id) => id.toString() === prodID);

    if (alreadyAdded) {
      return await this.auth.findByIdAndUpdate(
        userID,
        {
          $pull: { wishlists: prodID },
        },
        {
          new: true,
        }
      );
    } else {
      return await this.auth.findByIdAndUpdate(
        userID,
        {
          $push: { wishlists: prodID },
        },
        {
          new: true,
        }
      );
    };

    
  };

  getWishListService = async (
  userId: string | undefined
): Promise<UserDataInterface> => {
  const finduser = await this.auth.findById(userId).populate("wishlists");
  console.log("find User Data: finduser");
 
    if (!finduser) {
      throw new ServiceAPIError(
        `The User with the ID: ${userId} does not exist`,
      );
    }
    // console.log("find User Data:", finduser);
    return finduser;
 
};

  saveAddress_service = async (userID: string, address: string) => {
  validateMongoDbID(userID);
    const updateUser = await this.auth.findByIdAndUpdate(
      userID,
      { address },
      { new: true }
    );
    if (!updateUser) {
      throw new Error(`User with ID ${userID} not found`);
    }
    // console.log("user data: ", updateUser);
    return updateUser;
  };
  
   userCartService = async (userId: string, cart: CartItem[]) => {
  let products = [];

  const user = await this.auth.findById(userId);

  // checking if the user already has a cart.
  const userAlreadyHascart = await this.cart.findOne({
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

    const getPrice = await this.product
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

  const newCart = await new this.cart({
    products,
    cartTotal,
    orderby: user?._id,
  }).save();
  return newCart;
};
  
  // TODO: this needs to be worked on there is a bug in it...
  getUserCartService = async (
    userId: string
  ): Promise<CartModelInterface | null | void> => {
    // console.log("User ID Data: ", userId);
    validateMongoDbID(userId);

    const cart = await this.order.findOne({ orderby: userId }).populate(
      "products.product",
      "_id title price totalAfterDiscount"
    );
    // console.log(cart);
    // return cart;
  };

emptyCartService = async (
  userId: string
): Promise<CartModelInterface | void> => {
  validateMongoDbID(userId);

    const user = await this.auth.findOne({ _id: userId });
    if (!user) throw new ServiceAPIError ("User not found");
    
  const cart = await this.cart.findOneAndRemove({ orderby: userId });
  
    if (!cart) 
      throw new ServiceAPIError("Cart not found");
  
    return cart;
};
  
  applyCouponService = async (
  userId: string,
  coupon: string
): Promise<number> => {
  validateMongoDbID(userId);

  const validCoupon = await this.coupon.findOne({ name: coupon });
  if (!validCoupon) {
    throw new ServiceAPIError ("Invalid Coupon");
  }
  const user = await this.auth.findOne({ _id: userId });
  if (!user) {
    throw new ServiceAPIError ("User not found");
  }

  // Use optional chaining to access cartTotal safely
  const userCart = await this.cart.findOne({ orderby: userId })?.populate(
    "products.product"
  );

  if (!userCart) 
    throw new ServiceAPIError ("User cart not found");
  

  const cartTotal = userCart.cartTotal || 0;

  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  await this.cart.findOneAndUpdate(
    { orderby: userId },
    { totalAfterDiscount },
    { new: true }
  );

  return parseFloat(totalAfterDiscount);
  };
  
  CreateOrderService = async ({
  userId,
  COD,
  couponApplied,
}: CreateOrderParams): Promise<void> => {
  
    validateMongoDbID(userId);
    const user = await this.auth.findById(userId);
    if (!user)
      throw new ServiceAPIError ("User not found");

    const userCart = await this.cart.findOne({ orderby: userId });
    if (!userCart)
      throw new ServiceAPIError ("User cart not found");

    let finalAmount =
      couponApplied && userCart.totalAfterDiscount
        ? userCart.totalAfterDiscount
        : userCart.cartTotal;

    const paymentMethod = COD ? "COD" : "Online Payment";

    const newOrder = await new this.order({
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
      await this.product.bulkWrite(update, {});
    } else {
      // console.error("Product or product._id is undefined:", item);
      throw new ServiceAPIError(`${userCart.products} is not an array`);
      // return null;
    }
 
  };
  
  getOrderService = async (userId: string) => {
  validateMongoDbID(userId);
  // console.log(`User ID: ${userId}`);
    const userOrders = await this.order.findOne({ orderby: userId })
      .populate("products.product")
      .populate("orderby")
      .exec();
    return userOrders;
  
  };
  
  getAllOrdersService = async () => {
    const alluserorders = await this.order.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    return alluserorders;
  };
  
  getOrderByUserIdService = async (userId: string) => {
  validateMongoDbID(userId);
    const user_orders = await this.order.findOne({ orderby: userId })
      .populate("products.product")
      .populate("orderby")
      .exec();
    return user_orders;
  };
  
  updateOrderStatus_service = async ({
    status,
    id,
  }: UpdateOrderStatusParams): Promise<OrderInterface | null> => {

    validateMongoDbID(id);
    const update = {
      orderStatus: status,
      paymentIntent: {
        status: status,
      },
    };

    const updatedOrder = await this.order.findOneAndUpdate(
      { _id: id },
      update,
      { new: true }
    );

    if (!updatedOrder) throw new ServiceAPIError("Order Not Found");
    
    return updatedOrder;
  };
};





