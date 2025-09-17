
import { SoftDeleteModel } from '@common/interfaces/customize.interface';
import { softDeletePlugin } from '@common/plugins/soft-delete.plugin';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {

    @Prop({ required: true })
    email: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    url: string

    @Prop({ default: "PENDING", enum: ['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'] })
    status: string

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Company" })
    company: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Job" })
    job: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    history: [
        { status: string, updatedAt: Date, updatedBy: { _id: mongoose.Schema.Types.ObjectId, email: string } }
    ]

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

export const ResumeSchema = SchemaFactory.createForClass(Resume);
ResumeSchema.index({ isDeleted: 1, createdAt: -1 });
ResumeSchema.index({ company: 1, isDeleted: 1, createdAt: -1 });
ResumeSchema.index({ location: 1, isDeleted: 1, createdAt: -1 });
ResumeSchema.index({ isActive: 1, isDeleted: 1, createdAt: -1 });

ResumeSchema.plugin(softDeletePlugin);

export type ResumeModelType = SoftDeleteModel<ResumeDocument>;
