import { Request } from 'express';

interface RequestWithUser extends Request {
    user: {
      id: string;
      rol: string;
    },
}

export default RequestWithUser;