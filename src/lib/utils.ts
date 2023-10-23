import { CallApiRequest } from './types';

export const apiRequest = async ({
  url,
  method,
  data
}: CallApiRequest<any>) => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Response wasn`t ok!');
  }

  return await response.json();
};
