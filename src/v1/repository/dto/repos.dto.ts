import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class BranchDto {
  @ApiProperty({
    example: 'dev',
  })
  name: string;

  @ApiProperty({
    example: 'f0bb5942f47193d153a205dc089cbbf38299dd1a',
  })
  lastCommit: string;
}

export class RepoDto {
  @ApiProperty({
    example: 'TestRepo',
  })
  public name: string;

  @ApiProperty({
    example: 'testuser',
  })
  public owner: string;

  @ApiProperty({
    example: [],
  })
  public branches: BranchDto[];
}

export class GetReposDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    default: 1,
    required: false,
  })
  public page?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    default: 50,
    required: false,
  })
  public perPage?: number;
}
