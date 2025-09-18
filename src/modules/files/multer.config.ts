import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import fs from "fs"
import { diskStorage } from "multer";
import path, { join } from "path";
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    getRootPath = () => {
        return process.cwd();
    };

    ensureExistsSync(targetDirectory: string) {
        if (!fs.existsSync(targetDirectory)) {
            fs.mkdirSync(targetDirectory, { recursive: true });
            console.log('Directory created:', targetDirectory);
        }
    }


    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const folder = req?.headers?.folder_type ?? "default";
                    const uploadPath = join(this.getRootPath(), `public/images/${folder}`);

                    this.ensureExistsSync(uploadPath);

                    cb(null, uploadPath);
                },
                filename: (req, file, cb) => {
                    //get image extension
                    let extName = path.extname(file.originalname);

                    //get image's name (without extension)
                    let baseName = path.basename(file.originalname, extName);

                    let finalName = `${baseName}-${Date.now()}${extName}`
                    cb(null, finalName)
                }
            }),

            fileFilter: (req, file, callback) => {
                if (
                    !file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/) &&
                    !file.mimetype.match(/^application\/vnd.openxmlformats-officedocument.wordprocessingml.document$/)
                ) {
                    return callback(
                        new UnprocessableEntityException(
                            `Invalid file type '${file.mimetype}'. Allowed types: jpeg, png, gif, webp, docx.`
                        ),
                        false,
                    );
                }

                callback(null, true);
            },
        };
    }
}
