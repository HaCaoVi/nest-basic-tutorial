
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    description: string;

    @Prop({ default: false, index: true })
    isDeleted: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
    createdBy: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
    updatedBy: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
    deletedBy: mongoose.Schema.Types.ObjectId;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deletedAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
CompanySchema.index({ isDeleted: 1, createdAt: -1 });