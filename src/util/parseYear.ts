export const parseYear = (input?: string): number => {
  if (!input) return 0;
  const match = input.match(/(\d{4})/);
  return match ? parseInt(match[1], 10) : 0;
};
