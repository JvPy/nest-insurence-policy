import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Policy {
  @Prop()
  name: string;

  @Prop()
  roleNumber: number;
}

export const PolicySchema = SchemaFactory.createForClass(Policy);
