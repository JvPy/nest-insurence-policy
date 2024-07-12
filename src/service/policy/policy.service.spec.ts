import { Test, TestingModule } from '@nestjs/testing';
import { PolicyService } from './policy.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPolicy } from '../../interface/policy.interface';
import { CreatePolicyDto } from '../../dto/create-policy.dto';
import { UpdatePolicyDto } from '../../dto/update-policy.dto';
import { NotFoundException } from '@nestjs/common';

describe('PolicyService', () => {
  let policyService: PolicyService;
  let policyModel: Model<IPolicy>;

  const mockPolicyModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const validCreatePolicyDto: CreatePolicyDto = {
    name: 'test',
    roleNumber: 1,
  };

  const anotherValidCreatePolicyDto: CreatePolicyDto = {
    name: 'test',
    roleNumber: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyService,
        {
          provide: getModelToken('Policy'),
          useValue: mockPolicyModel,
        },
      ],
    }).compile();

    policyService = module.get<PolicyService>(PolicyService);
    policyModel = module.get<Model<IPolicy>>(getModelToken('Policy'));
  });

  describe('createPolicy', () => {
    it('should create a new policy successfully', async () => {
      const createPolicyDto: CreatePolicyDto = validCreatePolicyDto;
      const newPolicy = { ...createPolicyDto, _id: '1' };

      mockPolicyModel.create.mockResolvedValue(newPolicy);

      const result = await policyService.createPolicy(createPolicyDto);

      expect(result).toEqual(newPolicy);
      expect(mockPolicyModel.create).toHaveBeenCalledWith(createPolicyDto);
    });
  });

  describe('getAllPolicies', () => {
    it('should return all policies', async () => {
      const policies = [
        { ...validCreatePolicyDto, _id: '1' },
        { ...anotherValidCreatePolicyDto, _id: '2' },
      ];
      mockPolicyModel.find.mockResolvedValue(policies);

      const result = await policyService.getAllPolicies();

      expect(result).toEqual(policies);
      expect(mockPolicyModel.find).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no policies found', async () => {
      mockPolicyModel.find.mockResolvedValue([]);

      await expect(policyService.getAllPolicies()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPolicy', () => {
    it('should return a policy by id', async () => {
      const policyId = '1';
      const policy = { ...validCreatePolicyDto, _id: policyId };
      mockPolicyModel.findById.mockResolvedValue(policy);

      const result = await policyService.getPolicy(policyId);

      expect(result).toEqual(policy);
      expect(mockPolicyModel.findById).toHaveBeenCalledWith(policyId);
    });

    it('should throw NotFoundException if policy not found', async () => {
      const policyId = '1';
      mockPolicyModel.findById.mockResolvedValue(null);

      await expect(policyService.getPolicy(policyId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updatePolicy', () => {
    it('should update a policy successfully', async () => {
      const policyId = '1';
      const updatePolicyDto: UpdatePolicyDto = {
        ...validCreatePolicyDto,
        name: 'new test',
      };
      const updatedPolicy = { _id: policyId, ...updatePolicyDto };

      mockPolicyModel.findByIdAndUpdate.mockResolvedValue(updatedPolicy);

      const result = await policyService.updatePolicy(
        policyId,
        updatePolicyDto,
      );

      expect(result).toEqual(updatedPolicy);
      expect(mockPolicyModel.findByIdAndUpdate).toHaveBeenCalledWith(
        policyId,
        updatePolicyDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if policy not found for update', async () => {
      const policyId = '1';
      const updatePolicyDto: UpdatePolicyDto = {
        ...validCreatePolicyDto,
        name: 'new test',
      };
      mockPolicyModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        policyService.updatePolicy(policyId, updatePolicyDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePolicy', () => {
    it('should delete a policy successfully', async () => {
      const policyId = '1';
      const deletedPolicy = { ...validCreatePolicyDto, _id: policyId };

      mockPolicyModel.findByIdAndDelete.mockResolvedValue(deletedPolicy);

      const result = await policyService.deletePolicy(policyId);

      expect(result).toEqual(deletedPolicy);
      expect(mockPolicyModel.findByIdAndDelete).toHaveBeenCalledWith(policyId);
    });

    it('should throw NotFoundException if policy not found for deletion', async () => {
      const policyId = '1';
      mockPolicyModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(policyService.deletePolicy(policyId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
