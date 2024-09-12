import { Exclude, Expose } from "class-transformer";

export class UserResponseDto {
  @Expose() 
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  refreshToken: string;

  @Expose()
  role: string;

  @Exclude()
  mobileNumber: string;

  @Expose() 
  fullname: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
    // Build the fullname from firstName and lastName
    // this.fullname = `${this.firstName} ${this.lastName}`;
  }
}
