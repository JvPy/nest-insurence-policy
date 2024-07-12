import { PolicyController } from './policy.controller';
import { PolicyService } from '../../service/policy/policy.service';
import { CreatePolicyDto } from '../../dto/create-policy.dto';
import { HttpStatus } from '@nestjs/common';
import { IPolicy } from '../../interface/policy.interface';

describe('PolicyController', () => {
  let controller: PolicyController;
  let policyService: PolicyService;

  beforeEach(() => {
    policyService = new PolicyService(null); // Mock or use a testing database service
    controller = new PolicyController(policyService);
  });

  const validCreatePolicyDto: CreatePolicyDto = {
    name: 'policy name',
    roleNumber: 1,
  };

  const createPolicy: Partial<IPolicy> = {
    name: 'policy name',
    roleNumber: 1,
  };

  const anotherCreatePolicy: Partial<IPolicy> = {
    name: 'policy name 2',
    roleNumber: 2,
  };

  it('should create a policy', async () => {
    jest
      .spyOn(policyService, 'createPolicy')
      .mockResolvedValue(createPolicy as IPolicy);

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.createPolicy(response, validCreatePolicyDto);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Policy has been created successfully',
      newPolicy: expect.any(Object),
    });
  });

  it('should handle error while creating policy', async () => {
    jest
      .spyOn(policyService, 'createPolicy')
      .mockRejectedValue(new Error('Policy creation failed'));

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.createPolicy(response, validCreatePolicyDto);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error: Policy not created!',
      error: 'Bad Request',
    });
  });

  it('should get all policies', async () => {
    const policiesMock = [createPolicy, anotherCreatePolicy];

    jest
      .spyOn(policyService, 'getAllPolicies')
      .mockResolvedValue(policiesMock as IPolicy[]);

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.getAllPolicies(response);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(response.json).toHaveBeenCalledWith({
      message: 'All policies data found successfully',
      policies: policiesMock,
    });
  });

  it('should get a policy by ID', async () => {
    const policyId = 'mock-policy-id';
    const policyMock = createPolicy;

    jest
      .spyOn(policyService, 'getPolicy')
      .mockResolvedValue(policyMock as IPolicy);

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.getPolicy(response, policyId);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Policy found successfully',
      policy: policyMock,
    });
  });

  it('should update a policy by ID', async () => {
    const policyId = 'mock-policy-id';
    const updatePolicyDto = {
      ...createPolicy,
      name: 'new name',
    };
    const existingPolicyMock = createPolicy;

    jest
      .spyOn(policyService, 'updatePolicy')
      .mockResolvedValue(existingPolicyMock as IPolicy);

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.updatePolicy(response, policyId, updatePolicyDto);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Policy has been successfully updated',
      existingPolicy: existingPolicyMock,
    });
  });

  it('should delete a policy by ID', async () => {
    const policyId = 'mock-policy-id';
    const deletedPolicyMock = createPolicy;

    jest
      .spyOn(policyService, 'deletePolicy')
      .mockResolvedValue(deletedPolicyMock as IPolicy);

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.deletePolicy(response, policyId);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Policy deleted successfully',
      deletedPolicy: deletedPolicyMock,
    });
  });
});
