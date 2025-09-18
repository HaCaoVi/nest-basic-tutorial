
import { SoftDeleteModel } from '@common/interfaces/customize.interface';
import { softDeletePlugin } from '@common/plugins/soft-delete.plugin';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    apiPath: string;

    @Prop({ required: true })
    method: string;

    @Prop({ required: true })
    module: string;

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

export const PermissionSchema = SchemaFactory.createForClass(Permission);
PermissionSchema.index({ isDeleted: 1, createdAt: -1 });
PermissionSchema.index({ company: 1, isDeleted: 1, createdAt: -1 });
PermissionSchema.index({ location: 1, isDeleted: 1, createdAt: -1 });
PermissionSchema.index({ isActive: 1, isDeleted: 1, createdAt: -1 });

PermissionSchema.plugin(softDeletePlugin);

export type PermissionModelType = SoftDeleteModel<PermissionDocument>;
