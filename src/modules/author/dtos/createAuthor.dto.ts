import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsString()
  password: string;


  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  bio: string
}