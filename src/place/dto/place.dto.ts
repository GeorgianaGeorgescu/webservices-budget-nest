import {
    IsNumber,
    IsString,
  } from 'nestjs-swagger-dto';

export class PlaceDto {
    @IsString({name: 'name', maxLength: 255, description:'Get all places'})
    name: string;

    @IsNumber({ name: 'rating', min:1, max:5})
    rating: number | null;
}

export class CreatePlaceRequest {
    @IsString({name: 'name', maxLength: 255})
    name: string;
    
    @IsNumber({ name: 'rating', min:1, max:5})
    rating?: number;
}

export class PlaceSummaryDto {
    @IsNumber({ name: 'id', min: 1 })
    id: number;
  
    @IsString({ name: 'name', maxLength: 255, example:"Place" })
    name: string;
  }

export class UpdatePlaceRequest extends CreatePlaceRequest{};
export type GetAllPlacesResponse = PlaceDto[];