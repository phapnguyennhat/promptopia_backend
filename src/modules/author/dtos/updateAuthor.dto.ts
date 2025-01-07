import { IsOptional, IsString } from "class-validator";

export class UpdateAuthorDto {
  @IsOptional()
  @IsString()
  currentHashedRefreshToken?: string;

  @IsString()
  @IsOptional()
  imageId?: string
}