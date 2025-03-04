import { UserRoleEnum } from "../enums/user.role.enum";

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: UserRoleEnum;
}
