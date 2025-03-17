import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updatedAt' } })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ enum: ['pending', 'in-progress', 'completed'], default: 'pending' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);