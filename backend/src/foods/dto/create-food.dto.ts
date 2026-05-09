import { IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateFoodDto {
  @IsNotEmpty()
  readonly category: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly description: string;

  image: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly recommended: boolean;
}
