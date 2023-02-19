import { SetMetadata } from '@nestjs/common/decorators/core/set-metadata.decorator';
import { EVariables } from '../constants/namesVariables';
import { EUserRoles } from 'src/common/interfaces/userRoles.interfaces';

export const Roles = (role: EUserRoles) => SetMetadata(EVariables.ROLE, role);
