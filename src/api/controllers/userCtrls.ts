import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { plainToInstance } from "class-transformer";
import { Service, Inject } from "typedi";

import logger from "@/utils/logger";
import { generateRefreshToken } from "@/helpers/utils/refreshToken";
import { UserService } from "@/services/user.service";
import { AuthenticatedRequest } from "@/interfaces/authenticateRequest";
import { CustomAPIError } from "@/utils/custom-errors";
import { UserResponseDto } from "@/dto/auth.dto";
// import { validateUser, userWithID } from "@/config/validation";

@Service()
export class UserController {
  constructor(@Inject() private userService: UserService) {}

  // User Signup controller
  create_a_user = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      if (!req.body) {
        throw new CustomAPIError(
          `The body property is required.`,
          StatusCodes.FORBIDDEN
        );
      }

      // TODO: fixed properly with zod for validation
      // TODO: also you need a DTO to limit data transmission
      // const validateData = validateUser.parse(req.body);

      // Callling the create_user_service function.
      const { newUser, userToken } = await this.userService.create_user_service(
        req.body
      );
      
      // Convert the Mongoose document to a plain object, then to a DTO
      // const plainUserObj = newUser.toObject();
      // convert the user obj to DTO & send response
      const userRes = plainToInstance(UserResponseDto,  newUser, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false
      });

      // userRes.fullname = `${userRes.firstName} ${userRes.lastName}`

      // Convert DTO instance to a plain object for response
      // const userResPlain = JSON.parse(JSON.stringify(userRes));

      res
        .status(StatusCodes.CREATED)
        .json({ UserData: { userRes, token: userToken  }});
    }
  );

  // User Login Controller
  LoginUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, password } = req.body;

      // Pass email and password separately to login_user_service
      const { userExists, token, updateLoggedUser } =
        await this.userService.login_user_service({
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

      // TODO: in need of a DTO too
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
  LoginAdmin = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, password } = req.body;

      // Pass email and password separately to login_user_service
      const { AdminExists, token, updateLoggedUser } =
        await this.userService.login_admin_service({
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

      // TODO: in need of a DTO too
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
  getAllUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const users = await this.userService.get_all_users_service();
      //console.log(users);

      const formated_response = plainToInstance(UserResponseDto, users, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false
      });

      res.status(StatusCodes.OK).json({ numberOfUsers: formated_response.length, users: formated_response });
    }
  );

  //Get a single user controller
  getUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Destructuring the _id field from the req.params
    const { id } = req.params;

    const userDataID = await this.userService.get_single_user_service(id);

    const formated_response = plainToInstance(UserResponseDto, userDataID, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false
    })

    res.status(StatusCodes.OK).json({ user: formated_response });
  });

  // Deleting a single user controller
  deleteUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // Destructuring the ID field for req.params
      const { id } = req.params;
      const userDataId = await this.userService.delete_single_user({ id });
      res
        .status(StatusCodes.OK)
        .json({ status: "Deleted User Successfully", userDataId });
    }
  );

  // Updating the user controller
  updateuserCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updatedUser = await this.userService.updateUserService(
        { id },
        req.body
      );
      const formated_response = plainToInstance(UserResponseDto, updatedUser, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false
      });
      res
        .status(StatusCodes.OK)
        .json({ status: "successfully Updated User", user: formated_response });
    }
  );

  // Block User controller
  blockUserCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      // console.log(id);

      const blockedUser = await this.userService.blockUserService({ id });
          const formated_response = plainToInstance(UserResponseDto, blockedUser, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false
          });
      
      res.status(StatusCodes.OK).json({
        status: "User blocked Successfully",
        user: formated_response,
      });
    }
  );

  // Unblock User
  UnBlockUserCtrl = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      // console.log(req.user);
      const { id } = req.params;
      // console.log(id);
      const unblockedUser = await this.userService.unBlockUserService({ id });

      const formated_response = plainToInstance(UserResponseDto, unblockedUser, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false
      });

      res.status(StatusCodes.OK).json({
        status: `User Un-Blocked Successfully`,
        user: formated_response,
      });
    }
  );

  // Handle refresh Token controller
  handleRefreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { cookies } = req;
    const accessTokens = await this.userService.handle_refresh_token_service(
      cookies
    );
    console.log(accessTokens);
    res.status(StatusCodes.OK).json({ A_T: accessTokens });
  });

  // Log out controller functionality
  logoutUserCtrl = async (req: Request, res: Response): Promise<string | any | void> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const result = await this.userService.LogoutService(refreshToken);
      // logger.info(`result_data: ${result}`);
      if (!result) {
      // logger.info(`result_data: ${result}`);
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      })
        return res.sendStatus(200); // forbidden
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    })
      return res.sendStatus(200); // success
    } catch (error: any) {
      logger.error(error.message);
      throw new CustomAPIError(error.message, 404);
    }
 
  }

  // forgot password controller
  forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;

      await this.userService.fgtPwdService(email);
      res.status(StatusCodes.OK).json({
        status: "success",
        message: "Password reset link sent to the user email.",
      });
    }
  );

  passwordReset = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { token } = req.params;
      const { password, confirmPassword } = req.body;

      try {
        await this.userService.resetPwdService(
          token,
          password,
          confirmPassword
        );

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
  addToWishList = async (
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
      const updatedUser = await this.userService.addToWishListService(
        userId,
        prodId
      );
      res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  };

  getWishList = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const id = req?.user?.id;
    console.log("User ID:", id);
    try {
      if (!id) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: `ID: ${id} Not found` });
      }
      const findUser = await this.userService.getWishListService(id);
      res.status(StatusCodes.OK).json({ userData: findUser });
    } catch (error: any) {
      throw new CustomAPIError(
        `Server Error: ${error.message}`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  saveAddress = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const id: string = req?.user?.id ?? "";
    const updatedUser = await this.userService.saveAddress_service(
      id,
      req?.body?.address
    );
    if (!updatedUser) {
      res.status(404).json({ error: `User with ID ${id} not found` });
      return;
    }
    res.status(StatusCodes.OK).json({ userData: updatedUser });
  };

  userCartCtrl = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { cart } = req.body;
    const id = req?.user?.id;

    // Validate the user's MongoDB ID

    if (!id) {
      res
        .status(400)
        .json({ error: `The User-ID: ${id} is invalid or doesn't exist` });
      return;
    }

    const updatedCart = await this.userService.userCartService(id, cart);

    if (!updatedCart) {
      res.status(500).json({ error: "Could not update user cart" });
      return;
    }
    res.json(updatedCart);
  };

  getUserCartController = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const id = req?.user?.id;
    // console.log(req.user);
    if (!id) throw new CustomAPIError("Invalid user ID", StatusCodes.NOT_FOUND);
    // console.log("ID data from controller: ", id);

    const cart = await this.userService.getUserCartService(id);

    if (!cart) {
      throw new CustomAPIError(
        "Cart not found or empty",
        StatusCodes.NOT_FOUND
      );
    }

    res.status(StatusCodes.OK).json({ cartData: cart });
  };

  emptyCartCtrl = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const id = req?.user?.id;
    if (!id) {
      throw new CustomAPIError("invalid User ID", StatusCodes.NOT_ACCEPTABLE);
    }

    const emptyCart = await this.userService.emptyCartService(id);
    res.json({ message: "Cart has been emptied", cartData: emptyCart });
  };

  applyCouponCtrl = async (
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

    const totalAfterDiscount = await this.userService.applyCouponService(
      userId,
      coupon
    );
    res.status(StatusCodes.OK).json({ discount: totalAfterDiscount });

    return;
  };

  createOrderCtrl = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { COD, couponApplied } = req.body;
    const userId = req?.user?.id;

    if (!userId) {
      throw new CustomAPIError("Invalid user ID", StatusCodes.BAD_REQUEST);
    }

    await this.userService.CreateOrderService({ userId, COD, couponApplied });
    res.json({ message: "Success!" });
  };

  getOrdersController = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const userID = req?.user?.id;

    if (!userID) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid user ID" });
      return;
    }
    const userOrders = await this.userService.getOrderService(userID);

    res.status(StatusCodes.OK).json({ user_orders: userOrders });
  };

  getAllOrdersController = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const allUsers = await this.userService.getAllOrdersService();
      res.status(StatusCodes.OK).json({ users_data: allUsers });
    }
  );

  getOrderByUserIDController = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const userID = req?.user?.id;

    if (typeof userID === "string") {
      const order = await this.userService.getOrderByUserIdService(userID);
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
  };

  UpdateOrderStatusController = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { status } = req.body;
    const { id } = req.params;

    const updatedOrder = await this.userService.updateOrderStatus_service({
      status,
      id,
    });
    res.status(StatusCodes.OK).json(updatedOrder);
  };
}
