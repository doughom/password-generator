import crypto from "node:crypto";

// Mock window.crypto with node:crypto.
globalThis.window = {};
globalThis.window.crypto = crypto;
