import { SetMetadata } from '@nestjs/common'
import { PUBLIC_KEY, ALLROLL_KEY, STOPBODY_KEY } from './key-decorator';

export const PublicAccess = () => SetMetadata(PUBLIC_KEY, true);
export const AllRoll = () => SetMetadata(ALLROLL_KEY, true);
export const StopBody = () => SetMetadata(STOPBODY_KEY, true);