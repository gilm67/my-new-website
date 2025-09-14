import fs from "fs";
import path from "path";

export type TokenEntry = {
  label?: string;
  token: string;
  createdAt: number;
  ttlHours: number;
};

// Prefer explicit env var; otherwise use local .data/ folder
const DATA_DIR = process.env.TOKENS_DIR || path.join(process.cwd(), ".data");
const TOKENS_FILE = process.env.TOKENS_FILE || path.join(DATA_DIR, "tokens.json");

// Ensure data folder exists
function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ✅ Read all tokens from file (returns [] if missing/invalid)
function readTokens(): TokenEntry[] {
  try {
    ensureDir();
    if (!fs.existsSync(TOKENS_FILE)) return [];
    const raw = fs.readFileSync(TOKENS_FILE, "utf8");
    return JSON.parse(raw) as TokenEntry[];
  } catch {
    return [];
  }
}

// ✅ Save tokens to file
function writeTokens(tokens: TokenEntry[]) {
  ensureDir();
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

// ✅ Clean expired tokens automatically
function cleanExpiredTokens(): TokenEntry[] {
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
export function generateToken(label: string, ttlHours = 24): string {
  const tokens = readTokens();
  const token = Math.random().toString(36).slice(2, 10);
  tokens.push({ label, token, createdAt: Date.now(), ttlHours });
  writeTokens(tokens);
  return token;
}

// ✅ Get all tokens (without auto-clean)
export function getAllTokens(): TokenEntry[] {
  return readTokens();
}

// ✅ Delete a specific token
export function deleteToken(token: string) {
  const tokens = readTokens().filter((t) => t.token !== token);
  writeTokens(tokens);
}

// ✅ Validate a token
export function validateToken(token: string): boolean {
  const tokens = cleanExpiredTokens();
  const now = Date.now();
  return tokens.some(
    (t) => t.token === token && now < t.createdAt + t.ttlHours * 3600 * 1000
  );
}
