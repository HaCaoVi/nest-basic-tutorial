
import { SoftDeleteModel } from '@common/interfaces/customize.interface';
import { softDeletePlugin } from '@common/plugins/soft-delete.plugin';
import { Permission } from '@modules/permissions/schemas/permission.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
    _id: mongoose.Types.ObjectId

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, default: false })
    isActive: boolean;

    @Prop({ required: true, type: [mongoose.Schema.Types.ObjectId], ref: "Permission" })
    permissions: Permission[];

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

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.index({ isDeleted: 1, createdAt: -1 });
RoleSchema.index({ company: 1, isDeleted: 1, createdAt: -1 });
RoleSchema.index({ location: 1, isDeleted: 1, createdAt: -1 });
RoleSchema.index({ isActive: 1, isDeleted: 1, createdAt: -1 });

RoleSchema.plugin(softDeletePlugin);

export type RoleModelType = SoftDeleteModel<RoleDocument>;
