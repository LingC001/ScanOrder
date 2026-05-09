import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  readonly location: string;

  @IsNotEmpty()
  readonly tableNumber: string;

  @IsString()
  readonly comment;

  @IsNotEmpty()
  readonly cartData;

  @IsNotEmpty()
  readonly totalFoodsPrice: number;

  @IsNotEmpty()
  readonly allFoodsNumber: number;

  @IsOptional()
  finished: boolean;
}
