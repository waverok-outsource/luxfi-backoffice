const baseUrl = "/v1";

const SystemRoute = {
  analytics: `${baseUrl}/analytics/system-settings`,
  teamMembers: `${baseUrl}/users`,
  roles: `${baseUrl}/roles`,
  permissions: `${baseUrl}/permissions`,
};

export default SystemRoute;
