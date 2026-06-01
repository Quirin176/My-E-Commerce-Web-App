import { IsArray, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

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
    basePrice!: number;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsString()
    categoryId!: string;

    @IsArray()
    @IsNumber({}, { each: true })
    selectedOptionValueIds!: number[];
}
