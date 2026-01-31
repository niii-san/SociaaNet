import { Image, ImageDocument } from "../models";

interface IFilesRepository {
    getImageMetaDataByKey(key: string): Promise<ImageDocument | null>;
}

class FilesRepository implements IFilesRepository {
    async getImageMetaDataByKey(key: string): Promise<ImageDocument | null> {
        const imageMetaData = await Image.findOne({
            image_key: key,
            is_deleted: false
        }).lean<ImageDocument>();

        return imageMetaData;
    }
}

export const filesRepo = new FilesRepository();
