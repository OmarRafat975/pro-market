import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export enum Roles {
  User = 'user',
  Admin = 'admin',
}

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  password: string;
  @Prop({ type: String, enum: Roles, default: 'user' })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
