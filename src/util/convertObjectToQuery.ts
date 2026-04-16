const convertObjectToQuery = (obj: Record<string, string>) => {
  return new URLSearchParams(obj).toString();
};

export default convertObjectToQuery;
