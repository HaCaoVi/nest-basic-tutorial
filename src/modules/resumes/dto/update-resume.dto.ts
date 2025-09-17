import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';

enum ResumeStatus {
    PENDING = 'PENDING',
    REVIEWING = 'REVIEWING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}
export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @IsNotEmpty({ message: "Status must not be empty!" })
    @IsEnum(ResumeStatus, { message: 'status must be PENDING, REVIEWING, APPROVED, or REJECTED' })
    status?: ResumeStatus;
}
