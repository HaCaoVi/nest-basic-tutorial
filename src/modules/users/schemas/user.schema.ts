
import { SoftDeleteModel } from '@common/interfaces/customize.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum AccountType {
    LOCAL = 'LOCAL',
    GOOGLE = 'GOOGLE',
    FACEBOOK = 'FACEBOOK',
}


@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    age: number;

    @Prop()
    gender: string;

    @Prop()
    address: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
    company: mongoose.Schema.Types.ObjectId;

    @Prop({
        required: true,
        enum: AccountType,
    })
    accountType: AccountType

    @Prop()
    role: string

    @Prop()
    refreshToken: string;

    @Prop({ default: false })
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

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ isDeleted: 1, createdAt: -1 });
UserSchema.index({ email: 1, accountType: 1 }, { unique: true });

export type UserModelType = SoftDeleteModel<UserDocument>;
