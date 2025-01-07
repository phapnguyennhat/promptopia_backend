import { IsNotEmpty, IsString } from "class-validator";

export class CreateStartupDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  category: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  pitch: string
  
}

export class CreateStartup extends CreateStartupDto {
  imageId: string

  authorId: string
}