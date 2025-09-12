import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>
  ) { }

  async handleCreateCompany(authorId: string, createCompanyDto: CreateCompanyDto) {
    try {
      const { address, description, name } = createCompanyDto
      return this.companyModel.create({
        name, address, description, createdBy: authorId
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
