import fs from "fs";
import path from "path";

export interface TokenEntry {
  token: string;
  createdAt: number;
  ttlHours: number;
}

const TOKENS_FILE = path.join(process.cwd(), "tokens.json");

// ✅ Read all tokens from file
function readTokens(): TokenEntry[] {
  if (!fs.existsSync(TOKENS_FILE)) return [];
  return JSON.parse(fs.readFileSync(TOKENS_FILE, "utf-8"));
}

// ✅ Save tokens to file
function writeTokens(tokens: TokenEntry[]) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

// ✅ Clean expired tokens automatically
export function cleanExpiredTokens() {
  const now = Date.now();
  const tokens = readTokens();
  const validTokens = tokens.filter(
    (t) => now < t.createdAt + t.ttlHours * 3600 * 1000
  );
  if (validTokens.length !== tokens.length) {
    writeTokens(validTokens);
  }
  return validTokens;
}

// ✅ Generate a new token
export function generateToken(label: string, ttlHours: number) {
  const tokens = readTokens();
  const token = Math.random().toString(36).substring(2, 10); // random 8 chars
  tokens.push({ token, createdAt: Date.now(), ttlHours });
  writeTokens(tokens);
  return token;
}

// ✅ Get all tokens (without auto-clean)
export function getAllTokens() {
  return readTokens();
}

// ✅ Delete a specific token
export function deleteToken(token: string) {
  const tokens = readTokens().filter((t) => t.token !== token);
  writeTokens(tokens);
}

// ✅ Validate a token (NEW FUNCTION)
export function validateToken(token: string): boolean {
  const now = Date.now();
  const tokens = cleanExpiredTokens(); // auto-removes expired tokens
  return tokens.some(
    (t) => t.token === token && now < t.createdAt + t.ttlHours * 3600 * 1000
  );
}