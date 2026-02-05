import { ErrorCodes } from "../constants/error-code";
import { GetImageDto } from "../dtos";
import { filesRepo } from "../repositories";
import { HttpError } from "../utils";

class FilesService {
    async getImage(dto: GetImageDto) {
        const image = await filesRepo.getImageMetaDataByKey(dto.imageKey);

        if (!image)
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Image not found"
            );

        //TODO: implement visibility check
        // if(image.visibility !== "private"){
        //     throw new HttpError(403,false,"FORBIDDEN","Image not found")
        // }

        return image;
    }
}

export const filesService = new FilesService();
