import {
  IsEmail,
  IsStrongPassword,
  IsString,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name is too short' })
  name: string;
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password is too weak' },
  )
  password: string;
}
