// In-memory stand-in for a Cloudflare KV namespace, with expiry driven by an injectable clock.
export class MemoryKv {
  constructor(clock) {
    this.clock = clock;
    this.map = new Map();
  }
  async get(key, type) {
    const item = this.map.get(key);
    if (!item || (item.expiresAt && item.expiresAt <= this.clock())) return null;
    return type === 'json' ? JSON.parse(item.value) : item.value;
  }
  async put(key, value, options = {}) {
    const expiresAt = options.expirationTtl ? this.clock() + options.expirationTtl * 1000 : null;
    this.map.set(key, { value, expiresAt, ttl: options.expirationTtl ?? null });
  }
  async delete(key) {
    this.map.delete(key);
  }
  async list({ prefix = '' } = {}) {
    const keys = [...this.map.keys()].filter((key) => key.startsWith(prefix) && this.map.get(key)).map((name) => ({ name }));
    return { keys, list_complete: true };
  }
}
