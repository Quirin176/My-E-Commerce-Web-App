import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductRequest {
    @IsString()
    name!: string;

    @IsString()
    slug!: string;

    @IsOptional()
    @IsString()
    shortDescription?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    price!: number;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsArray()
    @IsString({ each: true })
    imageUrls!: string[];

    @IsString()
    categoryId!: string;

    @IsArray()
    @IsNumber({}, { each: true })
    selectedOptionValueIds!: number[];
}
