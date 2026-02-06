import { ImageMetaData, ImageMetaDataDocument } from "../models";

interface IFilesRepository {
    getImageMetaDataByKey(key: string): Promise<ImageMetaDataDocument | null>;
    deleteImageMetaDataByImageKey(
        imageKey: string
    ): Promise<Partial<ImageMetaDataDocument | null>>;
}

class FilesRepository implements IFilesRepository {
    async getImageMetaDataByKey(
        key: string
    ): Promise<ImageMetaDataDocument | null> {
        const imageMetaData = await ImageMetaData.findOne({
            image_key: key,
            is_deleted: false
        }).lean<ImageMetaDataDocument>();

        return imageMetaData;
    }

    async deleteImageMetaDataByImageKey(
        imageKey: string
    ): Promise<Partial<ImageMetaDataDocument | null>> {
        const data = await ImageMetaData.findOneAndUpdate(
            { image_key: imageKey },
            {
                is_deleted: true,
                deleted_at: new Date()
            }
        );

        return {
            image_key: data?.image_key.toString() || ""
        };
    }
}

export const filesRepo = new FilesRepository();
