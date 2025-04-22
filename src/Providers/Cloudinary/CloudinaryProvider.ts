import { v2 } from 'cloudinary';
import { CLOUDINARY } from 'src/Constants/Cloudinary';

export const CloudinaryProvider = {
    provide: CLOUDINARY,
    useFactory: (): any => {
        return v2.config({
            cloud_name: 'dw7n0yuly',
            api_key: '798954367599822',
            api_secret: 'YdrNNTAhaRIXHrQjDACA84_Espw',
        });
    },
};
