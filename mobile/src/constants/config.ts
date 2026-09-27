const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  console.warn(
    '[config] EXPO_PUBLIC_API_URL is not set. Create mobile/.env and point it to your computer LAN IP, e.g. http://192.168.1.20:3000/api/v1'
  );
}

export const config = {
  apiUrl: apiUrl ?? 'http://127.0.0.1:3000/api/v1',
};
