
import { SoftDeleteModel } from '@common/interfaces/customize.interface';
import { softDeletePlugin } from '@common/plugins/soft-delete.plugin';
import { Company } from '@modules/companies/schemas/company.schema';
import { User } from '@modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {

    @Prop({ required: true })
    name: string;

    @Prop({ type: [String], required: true })
    skills: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true })
    company: mongoose.Schema.Types.ObjectId;

    @Prop()
    location: string;

    @Prop()
    salary: number;

    @Prop()
    quantity: number;

    @Prop({ enum: ['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'] })
    level: string;

    @Prop({ type: String, maxLength: 5000 })
    description: string;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop({ default: false, index: true })
    isActive: boolean

    @Prop({ default: false, index: true })
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null })
    createdBy: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null })
    updatedBy: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null })
    deletedBy: mongoose.Schema.Types.ObjectId;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
JobSchema.index({ isDeleted: 1, createdAt: -1 });
JobSchema.index({ company: 1, isDeleted: 1, createdAt: -1 });
JobSchema.index({ location: 1, isDeleted: 1, createdAt: -1 });
JobSchema.index({ isActive: 1, isDeleted: 1, createdAt: -1 });

JobSchema.plugin(softDeletePlugin);

export type JobModelType = SoftDeleteModel<JobDocument>;
