
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

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deletedAt: Date;

    @Prop({ ref: 'User', })
    createdBy: mongoose.Schema.Types.ObjectId

    @Prop({ default: null })
    updatedBy: mongoose.Schema.Types.ObjectId

    @Prop({ default: null })
    deletedBy: mongoose.Schema.Types.ObjectId
}

export const CompanySchema = SchemaFactory.createForClass(Company);
