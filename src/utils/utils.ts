export const generateFakeToken = () => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ time: Date.now() }));
  const signature = Math.random().toString(36).substring(2);

  return `${header}.${payload}.${signature}`;
};

export const formatDateTime = (date?: string) => {
  if (!date) return "";

  const d = new Date(date);

  const time = d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const day = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${time},${day}`;
};
