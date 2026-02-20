export const generateFakeToken = () => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ time: Date.now() }));
  const signature = Math.random().toString(36).substring(2);

  return `${header}.${payload}.${signature}`;
};