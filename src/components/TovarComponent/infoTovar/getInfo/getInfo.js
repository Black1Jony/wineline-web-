import fieldGroups from './info.json';
export const extractCategoryWithOther= (data, type)=>  {
  const categoryFields = fieldGroups[type] || [];
  const usedKeys = new Set();
  const main = [];
  const other = [];

  for (const key of categoryFields) {
    if (data[key] !== undefined) {
      main.push({ label: key, value: data[key] });
      usedKeys.add(key);
    }
  }

  for (const key in data) {
    if (!usedKeys.has(key)) {
      other.push({ label: key, value: data[key] });
    }
  }

  return {
    main,
    other
  };
}

