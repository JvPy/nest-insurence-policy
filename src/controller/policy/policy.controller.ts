import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PolicyService } from '../../service/policy/policy.service';
import { CreatePolicyDto } from '../../dto/create-policy.dto';
import { UpdatePolicyDto } from '../../dto/update-policy.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createPolicy(
    @Res() response,
    @Body() createPolicyDto: CreatePolicyDto,
  ) {
    try {
      const newPolicy = await this.policyService.createPolicy(createPolicyDto);

      return response.status(HttpStatus.CREATED).json({
        message: 'Policy has been created successfully',
        newPolicy,
      });
    } catch (err) {
      const badRequest = HttpStatus.BAD_REQUEST;

      return response.status(badRequest).json({
        statusCode: badRequest,
        message: 'Error: Policy not created!',
        error: 'Bad Request',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllPolicies(@Res() response) {
    try {
      const policies = await this.policyService.getAllPolicies();

      return response.status(HttpStatus.OK).json({
        message: 'All policies data found successfully',
        policies,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getPolicy(@Res() response, @Param('id') policyId: string) {
    try {
      const policy = await this.policyService.getPolicy(policyId);

      return response.status(HttpStatus.OK).json({
        message: 'Policy found successfully',
        policy,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updatePolicy(
    @Res() response,
    @Param('id') policyId: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ) {
    try {
      const existingPolicy = await this.policyService.updatePolicy(
        policyId,
        updatePolicyDto,
      );

      return response.status(HttpStatus.OK).json({
        message: 'Policy has been successfully updated',
        existingPolicy,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deletePolicy(@Res() response, @Param('id') policyId: string) {
    try {
      const deletedPolicy = await this.policyService.deletePolicy(policyId);
      return response.status(HttpStatus.OK).json({
        message: 'Policy deleted successfully',
        deletedPolicy,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
