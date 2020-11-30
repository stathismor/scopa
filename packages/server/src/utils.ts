export function generateRoomName(): string {
  return Math.random().toString(36).substring(4);
}
