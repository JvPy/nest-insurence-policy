import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPolicy } from 'src/interface/policy.interface';
import { CreatePolicyDto } from 'src/dto/create-policy.dto';
import { UpdatePolicyDto } from 'src/dto/update-policy.dto';

@Injectable()
export class PolicyService {
  constructor(@InjectModel('Policy') private policyModel: Model<IPolicy>) {}

  async createPolicy(createPolicyDto: CreatePolicyDto): Promise<IPolicy> {
    return this.policyModel.create(createPolicyDto);
  }

  async getAllPolicies(): Promise<IPolicy[]> {
    const policies = await this.policyModel.find();

    if (!policies || policies.length == 0) {
      throw new NotFoundException('Policy data not found!');
    }

    return policies;
  }

  async getPolicy(policyId: string): Promise<IPolicy> {
    const policy = await this.policyModel.findById(policyId);

    if (!policy) {
      throw new NotFoundException(`Policy #${policyId} not found`);
    }

    return policy;
  }

  async updatePolicy(
    policyId: string,
    updatePolicyDto: UpdatePolicyDto,
  ): Promise<IPolicy> {
    const existingStudent = await this.policyModel.findByIdAndUpdate(
      policyId,
      updatePolicyDto,
      { new: true },
    );

    if (!existingStudent) {
      throw new NotFoundException(`Policy #${policyId} not found`);
    }

    return existingStudent;
  }

  async deletePolicy(policyId: string): Promise<IPolicy> {
    const deletedPolicy = await this.policyModel.findByIdAndDelete(policyId);

    if (!deletedPolicy) {
      throw new NotFoundException(`Policy #${policyId} not found`);
    }

    return deletedPolicy;
  }
}
