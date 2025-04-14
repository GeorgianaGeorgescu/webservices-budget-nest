import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class PlaceDto {
    name: string;
    rating: number | null;
}

export class CreatePlaceRequest {
    @IsString()
    @MaxLength(255)
    name: string;
  
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;
}

export type UpdatePlaceRequest = CreatePlaceRequest;
export type GetAllPlacesResponse = PlaceDto[];