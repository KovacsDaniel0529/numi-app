// A helyi dátumot adja vissza YYYY-MM-DD formában.
// A toISOString() UTC-t használna, éjfél környékén ezért tévedne egy napot.
export const todayLocal = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};