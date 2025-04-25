import { generateSlug } from "./generateSlug";

export const generateUniqueSlug = (
  title: string,
  existingSlugs: string[]
): string => {
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  let count = 1;

  while (existingSlugs.includes(slug)) {
    count += 1;
    slug = `${baseSlug}-${count}`;
  }

  return slug;
};
