import { ApiResponse } from "./global";

export type SystemPermissionType = {
  id: string;
  title: string;
  description: string;
  forAdmin: boolean;
  createdAt: string;
};

export type SystemPermissionGroupType = {
  resourceTitle: string;
  resourceDescription: string;
  permissions: SystemPermissionType[];
  resourceId: string;
};

export type UserPermissionsType = {
  systemPermissions: SystemPermissionGroupType[];
  userPermissions: string[];
};

export type AuthUserType = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileUrl: string | null;
  currentUserType: string | null;
  completionPercent: string;
  isProfileCompleted: boolean;
  token: string;
  dateJoined: string;
  permissions: UserPermissionsType;
};

export type LoginResponseType = ApiResponse<AuthUserType>;
