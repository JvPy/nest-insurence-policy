import { Document } from 'mongoose';

export interface IPolicy extends Document {
  readonly name: string;
  readonly roleNumber: number;
  readonly createdAd: Date;
  readonly enabled: boolean;
}
