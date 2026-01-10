import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'das9z8rup', 
      api_key: '477593152817542',      
      api_secret: 'UK37xJ--f2whwplYs3te5IQLQxc',
    });
  },
};