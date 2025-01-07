import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateStartupDto{
  @IsOptional()
  @IsString()
  title: string
  
  @IsOptional()
  @IsNumber()
  @Type(()=>Number)
  views: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  pitch: string;


}