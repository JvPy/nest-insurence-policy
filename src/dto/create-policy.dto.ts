import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
export class CreatePolicyDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly roleNumber: number;
}
