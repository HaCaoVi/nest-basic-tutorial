import { Controller, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { FilesService } from './files.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@common/decorators/customize.decorator';
// import { UploadConfig } from '@modules/files/upload.config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename
    }
  }

  // @Public()
  // @Post('upload-video')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadVideo(
  //   @UploadedFile(
  //     createUploadPipe(UploadConfig.video.fileType, UploadConfig.video.maxSize)
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   return {
  //     success: true,
  //     type: 'video',
  //     data: {
  //       filename: file.originalname,
  //       mimetype: file.mimetype,
  //       size: file.size,
  //     },
  //   };
  // }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
