import { IsEmail, IsPhoneNumber, IsString, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(3, { message: 'Username is too short' })
  @MaxLength(20, { message: 'Username is too long' })
  username!: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  // Use 'US', 'VN', etc., for specific regions.
  @IsPhoneNumber('VN', { message: 'Please provide a valid phone number' })
  phone!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, { message: 'Password is too long' })
  password!: string;
}