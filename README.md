# Echo Prime SDK

The official TypeScript SDK for **Echo Prime Technologies** — 30 modules covering 5,500+ intelligence engines, AI chat with 14 personalities, voice synthesis, knowledge search, brain memory, credential vault, autonomous bots, scrapers, agents, 37,400+ tools, dark web intel, crypto trading, graph RAG, swarm coordination, fleet management, and more.

**Zero dependencies. Tree-shakeable. Works everywhere.**

```
npm install @echo-omega-prime/sdk
```

## Quick Start

```typescript
import EchoPrime from '@echo-omega-prime/sdk';

const echo = new EchoPrime({ apiKey: 'your-api-key' });

// Query 5,500+ intelligence engines
const results = await echo.engines.query('MACRS depreciation rules for oil wells?', 'tax');

// AI chat with 14 personalities
const reply = await echo.chat.send('Analyze this contract for risk factors', {
  personality: 'nexus',
});

// Search the Knowledge Forge (26,000+ documents)
const docs = await echo.knowledge.search('Cloudflare Workers best practices');

// Dark web threat monitoring
const threats = await echo.darkweb.scan('echo-ept.com');

// Crypto trading
const portfolio = await echo.crypto.portfolio();

// Health check
const status = await echo.health();
```


## Custom GPT Connector Example

Want to connect a **Custom GPT** to Echo SDK? Use the minimal connector example in:

- `examples/custom-gpt-connector/README.md`
- `examples/custom-gpt-connector/openapi.yaml`
- `examples/custom-gpt-connector/server.mjs`

This gives you a ready Actions-compatible API (`/chat`, `/knowledge/search`) that proxies to Echo SDK securely from your server.

## Installation

```bash
# GitHub Packages (available now)
npm install @echo-omega-prime/sdk --registry=https://npm.pkg.github.com

# npm (coming soon)
npm install @echo-prime/sdk
```

> Configure GitHub Packages auth in your `.npmrc`:
> ```
> @echo-omega-prime:registry=https://npm.pkg.github.com
> //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
> ```

## All 30 Modules

Import the full SDK or only the modules you need:

```typescript
// Full SDK (tree-shakes unused modules)
import EchoPrime from '@echo-omega-prime/sdk';

// Individual modules (smallest bundle)
import { EchoEngines } from '@echo-omega-prime/sdk/engines';
import { EchoVoice } from '@echo-omega-prime/sdk/voice';
import { EchoDarkweb } from '@echo-omega-prime/sdk/darkweb';
```

---

### Engines — 5,500+ Intelligence Engines

Query domain-specific AI reasoning systems across 880+ domains: tax, legal, oilfield, medical, finance, cybersecurity, and more. Not wrappers — embedded domain expertise with doctrine-backed responses.

```typescript
import { EchoEngines } from '@echo-omega-prime/sdk/engines';

const engines = new EchoEngines({ apiKey: 'your-key' });

const result = await engines.query('Safe harbor for underpayment penalties?', 'tax');
const batch = await engines.queryBatch([
  { query: 'IRC Section 1031 exchange rules', domain: 'tax' },
  { query: 'Force majeure in oil leases', domain: 'legal' },
]);
const taxEngines = await engines.list('tax');
const matches = await engines.search('depreciation');
```

### Knowledge — 26,000+ Documents

Search and ingest documents across 576+ categories.

```typescript
import { EchoKnowledge } from '@echo-omega-prime/sdk/knowledge';

const knowledge = new EchoKnowledge({ apiKey: 'your-key' });

const results = await knowledge.search('Cloudflare D1 migration patterns');
const categories = await knowledge.categories();
await knowledge.ingest('My Document', 'Document content...', 'engineering');
```

### Brain — Infinite Memory

Cross-session semantic memory. Store decisions, recall context, search across all memories.

```typescript
import { EchoBrain } from '@echo-omega-prime/sdk/brain';

const brain = new EchoBrain({ apiKey: 'your-key' });

await brain.ingest('Decided to use Hono router for all Workers', 8, ['architecture']);
const memories = await brain.search('router decision');
await brain.store('project-config', { framework: 'hono', runtime: 'workers' });
const config = await brain.recall('project-config');
```

### Doctrine — Domain Expertise Generation

Generate doctrine blocks using 24 FREE LLM providers. Real domain expertise, not generic text.

```typescript
import { EchoDoctrine } from '@echo-omega-prime/sdk/doctrine';

const doctrine = new EchoDoctrine({ apiKey: 'your-key' });

const result = await doctrine.generate('tax', 'MACRS depreciation');
const providers = await doctrine.providers();
const taxDoctrines = await doctrine.search('depreciation', 'tax');
```

### Voice — TTS, STT, Emotion, Voice Cloning

6 voice personalities, 19 emotions, voice cloning, speech-to-text.

```typescript
import { EchoVoice } from '@echo-omega-prime/sdk/voice';

const voice = new EchoVoice({ apiKey: 'your-key' });

const audio = await voice.synthesize('Hello from Echo Prime', {
  voice: 'echo', emotion: 'confident', format: 'mp3',
});
const transcript = await voice.transcribe(audioBuffer, { language: 'en' });
const emotions = await voice.analyzeEmotion('I am thrilled about this result!');
const cloned = await voice.cloneVoice('my-voice', audioSamples);
```

### Chat — 14 AI Personalities

Conversational AI with session management and personality switching.

```typescript
import { EchoChat } from '@echo-omega-prime/sdk/chat';

const chat = new EchoChat({ apiKey: 'your-key' });

const reply = await chat.send('Explain quantum computing');
const analysis = await chat.send('Analyze this network traffic', {
  personality: 'prometheus',
});

const session = chat.createSession({ personality: 'nexus' });
const r1 = await chat.sendInSession(session, 'Write a binary search in Rust');
const r2 = await chat.sendInSession(session, 'Now add error handling');
```

**Personalities:** `echo_prime`, `bree`, `raven`, `sage`, `thinker`, `nexus`, `gs343`, `phoenix`, `prometheus`, `belle`, `tech_expert`, `warmaster`, `r2`, `third_person`

### Vault — Credential Management

Secure credential storage, search, health scoring, and breach detection.

```typescript
import { EchoVault } from '@echo-omega-prime/sdk/vault';

const vault = new EchoVault({ apiKey: 'your-key' });

await vault.store('aws-prod', 'admin', 's3cr3t', { category: 'cloud' });
const cred = await vault.get('aws-prod');
const results = await vault.search('aws');
const health = await vault.health();
```

### Tools — 37,000+ MCP Tools

Search and execute tools from the MEGA Gateway across 1,873 servers.

```typescript
import { EchoTools } from '@echo-omega-prime/sdk/tools';

const tools = new EchoTools({ apiKey: 'your-key' });

const matches = await tools.search('pdf');
const result = await tools.execute('tool-id', { input: 'data' });
const categories = await tools.categories();
const chains = await tools.chains(); // Multi-tool workflows
```

### Monitoring — Request Telemetry

Local request metrics — no API calls, runs entirely in-process.

```typescript
import { EchoMonitor } from '@echo-omega-prime/sdk/monitoring';

const monitor = new EchoMonitor();

monitor.record({ endpoint: '/engines/query', method: 'POST', status: 200, latency_ms: 142, cached: false });
const summary = monitor.summarize();
// { total_requests, error_rate, avg_latency, p95_latency, p99_latency, ... }
```

### Agent — Autonomous AI Agents

Create and manage long-running autonomous agents with scheduling.

```typescript
import { EchoAgent } from '@echo-omega-prime/sdk/agent';

const agent = new EchoAgent({ apiKey: 'your-key' });

const config = await agent.create({
  name: 'research-agent',
  description: 'Monitors competitor pricing',
  instructions: 'Check pricing pages daily and report changes',
  schedule: '0 9 * * *',
});
const run = await agent.run(config.id, { target: 'competitor.com' });
const status = await agent.status(run.id);
```

### Scraper — Web Data Extraction

Configure and run scrapers with rate limiting and proxy rotation.

```typescript
import { EchoScraper } from '@echo-omega-prime/sdk/scraper';

const scraper = new EchoScraper({ apiKey: 'your-key' });

const config = await scraper.create({
  name: 'court-records',
  target_url: 'https://records.county.gov',
  selectors: { title: 'h2.case-title', date: '.filing-date' },
  schedule: '0 */6 * * *',
  rate_limit: { requests_per_second: 2 },
});
const job = await scraper.run(config.id);
const records = await scraper.records(config.id, 100);
```

### Bot — Social Media Automation

Deploy bots across 9 platforms with 14 AI personalities.

```typescript
import { EchoBot } from '@echo-omega-prime/sdk/bot';

const bot = new EchoBot({ apiKey: 'your-key' });

const config = await bot.create({
  name: 'twitter-presence',
  platform: 'twitter',
  personality: 'echo_prime',
  schedule: { posts_per_day: 4 },
  content_categories: ['ai_tech', 'industry', 'builds'],
});
await bot.post(config.id, { content: 'Just shipped 50 new engines.' });
const stats = await bot.stats(config.id);
```

**Platforms:** `discord`, `twitter`, `telegram`, `linkedin`, `whatsapp`, `messenger`, `slack`, `reddit`, `instagram`

### MEGA Gateway — 37,000+ Tools Across 1,873 Servers

Direct access to the MEGA Gateway tool registry.

```typescript
import { EchoMegaGateway } from '@echo-omega-prime/sdk/mega-gateway';

const gateway = new EchoMegaGateway({ apiKey: 'your-key' });

const tools = await gateway.search('browser automation');
const result = await gateway.execute('server-name', 'tool-name', { param: 'value' });
const servers = await gateway.servers();
const categories = await gateway.categories();
const stats = await gateway.stats();
```

**Categories:** `AI_ML`, `API`, `AUTOMATION`, `CLOUD`, `COMMUNICATION`, `DATA`, `DEVTOOLS`, `FINANCE`, `MEDIA`, `MONITORING`, `NETWORK`, `SECURITY`

### Graph RAG — Knowledge Graph

312K+ nodes, 3.3M+ edges across 93 domains. Traverse relationships, find paths, semantic graph search.

```typescript
import { EchoGraphRAG } from '@echo-omega-prime/sdk/graph-rag';

const graph = new EchoGraphRAG({ apiKey: 'your-key' });

const results = await graph.search('MACRS depreciation', { domain: 'tax', depth: 3 });
const paths = await graph.findPaths('entity-a', 'entity-b');
const neighbors = await graph.neighbors('node-id', { maxDepth: 2 });
const stats = await graph.stats();
```

### Swarm — Multi-Agent Coordination

MoltBook social feed, swarm task assignment, agent-to-agent messaging, broadcast system.

```typescript
import { EchoSwarm } from '@echo-omega-prime/sdk/swarm';

const swarm = new EchoSwarm({ apiKey: 'your-key' });

await swarm.post({ content: 'Engine build complete', mood: 'celebrating', tags: ['build'] });
const feed = await swarm.feed({ limit: 20 });
const agents = await swarm.agents();
const task = await swarm.assignTask('worker-1', { description: 'Build tax engine', priority: 8 });
await swarm.broadcast('Deploy freeze in effect', 'high');
const stats = await swarm.stats();
```

### Dark Web Intelligence

Monitor the dark web for threats, breaches, brand mentions, and credential exposure.

```typescript
import { EchoDarkweb } from '@echo-omega-prime/sdk/darkweb';

const darkweb = new EchoDarkweb({ apiKey: 'your-key' });

const threats = await darkweb.scan('mycompany.com');
const breaches = await darkweb.checkBreach('user@company.com');
const alerts = await darkweb.alerts();
await darkweb.createAlert({
  name: 'Brand Monitor',
  keywords: ['mycompany', 'my-product'],
  severity_threshold: 'medium',
});
const intel = await darkweb.intel({ severity: 'critical', limit: 50 });
const stats = await darkweb.stats();
```

### Crypto — Trading & Portfolio Management

Automated trading strategies, portfolio tracking, order management.

```typescript
import { EchoCrypto } from '@echo-omega-prime/sdk/crypto';

const crypto = new EchoCrypto({ apiKey: 'your-key' });

const portfolio = await crypto.portfolio();
const order = await crypto.placeOrder({
  pair: 'BTC-USDC', side: 'buy', amount: 0.1, strategy: 'grid',
});
const strategies = await crypto.strategies();
await crypto.configureStrategy('grid', { lower: 60000, upper: 70000, grids: 10 });
const stats = await crypto.stats();
```

### News — Real-Time News Intelligence

News aggregation, sentiment analysis, topic tracking, and alerts.

```typescript
import { EchoNews } from '@echo-omega-prime/sdk/news';

const news = new EchoNews({ apiKey: 'your-key' });

const articles = await news.latest({ topic: 'artificial intelligence', limit: 20 });
const sentiment = await news.analyzeSentiment('oil prices');
const topics = await news.topics();
await news.createAlert({ topic: 'crypto regulation', keywords: ['SEC', 'bitcoin'] });
const stats = await news.stats();
```

### SEC EDGAR — Financial Filings

Monitor SEC filings, track companies, get alerts on new filings.

```typescript
import { EchoSECEdgar } from '@echo-omega-prime/sdk/sec-edgar';

const sec = new EchoSECEdgar({ apiKey: 'your-key' });

const filings = await sec.filings('AAPL', { type: '10-K' });
await sec.watch('NVDA', { filing_types: ['10-K', '10-Q', '8-K'] });
const watchlist = await sec.watchlist();
const alerts = await sec.alerts();
const stats = await sec.stats();
```

### Reddit — Social Intelligence

Monitor subreddits, track keywords, sentiment analysis across Reddit.

```typescript
import { EchoReddit } from '@echo-omega-prime/sdk/reddit';

const reddit = new EchoReddit({ apiKey: 'your-key' });

const posts = await reddit.search('artificial intelligence', { subreddit: 'machinelearning' });
await reddit.watch('r/startup', { keywords: ['AI', 'funding'] });
const alerts = await reddit.alerts();
const trending = await reddit.trending();
const stats = await reddit.stats();
```

### Price Alerts — Asset Monitoring

Real-time price monitoring with configurable alerts for any asset.

```typescript
import { EchoPriceAlerts } from '@echo-omega-prime/sdk/price-alerts';

const prices = new EchoPriceAlerts({ apiKey: 'your-key' });

await prices.create({ asset: 'BTC', condition: 'above', threshold: 100000, asset_type: 'crypto' });
const active = await prices.list();
const snapshot = await prices.snapshot('BTC');
const history = await prices.history('alert-id');
const stats = await prices.stats();
```

### Landman — Title & Deed Intelligence

259,000+ deed records across 80 Texas counties. Chain of title, runsheets, title investigation.

```typescript
import { EchoLandman } from '@echo-omega-prime/sdk/landman';

const landman = new EchoLandman({ apiKey: 'your-key' });

const investigation = await landman.investigate({
  county: 'Reeves', state: 'TX',
  legal_description: 'Section 270, Block 8, H&GN Survey',
});
const chain = await landman.chainOfTitle(investigation.id);
const runsheet = await landman.runsheet(investigation.id);
const deeds = await landman.searchDeeds({ county: 'Reeves', grantor: 'Smith' });
const stats = await landman.stats();
```

### Model Host — Custom AI Inference

Run inference against custom LoRA-adapted models. 10 adapters across tax, legal, medical, cyber, and more.

```typescript
import { EchoModelHost } from '@echo-omega-prime/sdk/model-host';

const models = new EchoModelHost({ apiKey: 'your-key' });

const response = await models.chat({
  model: 'titlehound',
  messages: [{ role: 'user', content: 'Analyze this chain of title gap' }],
});
const available = await models.list();
await models.switchAdapter('taxlaw');
const stats = await models.stats();
```

**Adapters:** `titlehound`, `doctrine-generator`, `landman`, `taxlaw`, `legal`, `realestate`, `cyber`, `engineering`, `medical`, `software`

### Harvester — Data Collection

Manage data harvesting sources across web, government, and social platforms.

```typescript
import { EchoHarvester } from '@echo-omega-prime/sdk/harvester';

const harvester = new EchoHarvester({ apiKey: 'your-key' });

const sources = await harvester.sources();
await harvester.addSource({
  name: 'TX Court Records', type: 'government',
  url: 'https://records.texas.gov', schedule: '0 */12 * * *',
});
const items = await harvester.items({ source: 'TX Court Records', limit: 50 });
const discovery = await harvester.discover('oilfield regulations');
const stats = await harvester.stats();
```

### Scanner — County Document Scanning

Automated courthouse document scanning and OCR pipeline.

```typescript
import { EchoScanner } from '@echo-omega-prime/sdk/scanner';

const scanner = new EchoScanner({ apiKey: 'your-key' });

const job = await scanner.createJob({
  county: 'Midland', state: 'TX',
  document_types: ['deed', 'lease', 'assignment'],
});
const status = await scanner.jobStatus(job.id);
const docs = await scanner.documents({ county: 'Midland', limit: 100 });
const counties = await scanner.countyStatus();
const stats = await scanner.stats();
```

### Workflows — Automation Pipelines

Create multi-step workflows with scheduling, branching, and error handling.

```typescript
import { EchoWorkflows } from '@echo-omega-prime/sdk/workflows';

const workflows = new EchoWorkflows({ apiKey: 'your-key' });

const workflow = await workflows.create({
  name: 'daily-intel',
  steps: [
    { name: 'scrape-news', action: 'scraper.run', config: { source: 'reuters' } },
    { name: 'analyze', action: 'engine.query', config: { domain: 'news' } },
    { name: 'notify', action: 'notification.send', config: { channel: 'slack' } },
  ],
  schedule: '0 8 * * *',
});
const run = await workflows.run(workflow.id);
const history = await workflows.runs(workflow.id);
const crons = await workflows.crons();
const stats = await workflows.stats();
```

### Notifications — Multi-Channel Alerts

Send notifications across email, SMS, Slack, Telegram, Discord, and webhooks.

```typescript
import { EchoNotifications } from '@echo-omega-prime/sdk/notifications';

const notify = new EchoNotifications({ apiKey: 'your-key' });

await notify.send({
  channel: 'slack', priority: 'high',
  title: 'Security Alert', body: 'Unusual login attempt detected',
});
const rules = await notify.rules();
await notify.createRule({
  name: 'critical-errors',
  condition: { event: 'error', severity: 'critical' },
  channels: ['slack', 'sms'],
});
const stats = await notify.stats();
```

### Fleet — Worker & Service Management

Monitor and manage Cloudflare Workers, deployments, and service health.

```typescript
import { EchoFleet } from '@echo-omega-prime/sdk/fleet';

const fleet = new EchoFleet({ apiKey: 'your-key' });

const health = await fleet.health();
const workers = await fleet.workerStatus('echo-x-bot');
const services = await fleet.services();
await fleet.register({ name: 'my-worker', url: 'https://my-worker.workers.dev', type: 'bot' });
const deployments = await fleet.deployments({ limit: 10 });
const stats = await fleet.stats();
```

### Memory Prime — 9-Pillar Permanent Archive

Permanent memory storage across 9 pillars: decisions, errors, patterns, context, code, conversations, knowledge, tasks, metrics.

```typescript
import { EchoMemoryPrime } from '@echo-omega-prime/sdk/memory-prime';

const memory = new EchoMemoryPrime({ apiKey: 'your-key' });

await memory.store('decisions', 'Chose Hono over Express for all Workers', {
  importance: 9, tags: ['architecture', 'framework'],
});
const results = await memory.search('framework decision', { pillar: 'decisions' });
const entries = await memory.recall('patterns', { limit: 20 });
const entry = await memory.get('memory-id');
await memory.delete('old-memory-id');
const stats = await memory.stats();
```

**Pillars:** `decisions`, `errors`, `patterns`, `context`, `code`, `conversations`, `knowledge`, `tasks`, `metrics`

### Autonomous — 24/7 Daemon Oversight

Autonomous health monitoring, auto-tasks, pattern detection, fleet oversight.

```typescript
import { EchoAutonomous } from '@echo-omega-prime/sdk/autonomous';

const daemon = new EchoAutonomous({ apiKey: 'your-key' });

const status = await daemon.status();
const health = await daemon.healthReport();
const tasks = await daemon.tasks({ status: 'running' });
await daemon.createTask('Run security sweep', { priority: 9, type: 'security' });
const patterns = await daemon.patterns({ severity: 'critical' });
const sweep = await daemon.sweep();
const stats = await daemon.stats();
```

---

## Configuration

```typescript
import EchoPrime from '@echo-omega-prime/sdk';

const echo = new EchoPrime({
  // Required
  apiKey: 'your-api-key',

  // Optional
  gatewayUrl: 'https://echo-sdk-gateway.bmcii1976.workers.dev', // default
  timeout: 30_000,           // Request timeout in ms (default: 30s)
  retries: 2,                // Retry attempts (default: 2)
  cache: {                   // Response cache
    maxSize: 200,            // Max cached entries (default: 200)
    ttl: 300_000,            // Cache TTL in ms (default: 5min)
  },
  circuitBreaker: {          // Circuit breaker
    threshold: 5,            // Failures before opening (default: 5)
    resetTimeout: 60_000,    // Time before half-open (default: 60s)
  },
  logger: (entry) => console.log(entry), // Structured log handler
});
```

## Resilience

Built-in resilience with zero configuration:

- **Automatic retries** with exponential backoff and ±20% jitter
- **Circuit breaker** — opens after 5 failures, half-opens after 60s
- **Response cache** — LRU cache with TTL for GET requests
- **Timeout protection** — configurable per-request timeouts with abort signal support
- **Error hierarchy** — typed errors for precise catch handling

```typescript
import { AuthError, RateLimitError, CircuitOpenError, TimeoutError, NetworkError } from '@echo-omega-prime/sdk/errors';

try {
  await echo.engines.query('test', 'tax');
} catch (e) {
  if (e instanceof AuthError) console.log('Invalid API key');
  if (e instanceof RateLimitError) console.log(`Retry after ${e.retryAfter}ms`);
  if (e instanceof CircuitOpenError) console.log('Circuit open, backing off');
  if (e instanceof TimeoutError) console.log('Request timed out');
  if (e instanceof NetworkError) console.log('Network error');
}

// Circuit breaker state
echo.getCircuitState(); // { state: 'CLOSED' | 'OPEN' | 'HALF_OPEN', ... }
echo.resetCircuit();    // Force reset
echo.clearCache();      // Flush response cache
```

## Security Utilities

```typescript
import { redact, validateApiKey, maskKey, timingSafeEqual, sanitizeInput } from '@echo-omega-prime/sdk';

redact('my-secret');          // 'my-***ret'
validateApiKey('echo-...');   // true/false (8-256 chars)
maskKey('sk_live_abc123');    // 'sk_l****123'
sanitizeInput('<script>');    // Strips dangerous content
```

## Unified Search

Search across engines, knowledge, and brain simultaneously:

```typescript
const results = await echo.search('MACRS depreciation', ['engines', 'knowledge'], 10);
```

## Compatibility

| Runtime | Version |
|---------|---------|
| Node.js | 18+ |
| Deno | 1.40+ |
| Bun | 1.0+ |
| Cloudflare Workers | Yes |
| Browsers | Modern (with fetch) |

## Module Summary

| Module | Import Path | Description |
|--------|-------------|-------------|
| Engines | `@echo-omega-prime/sdk/engines` | 5,500+ AI reasoning engines, 880+ domains |
| Knowledge | `@echo-omega-prime/sdk/knowledge` | 26,000+ documents, 576+ categories |
| Brain | `@echo-omega-prime/sdk/brain` | Infinite cross-session semantic memory |
| Doctrine | `@echo-omega-prime/sdk/doctrine` | Domain expertise generation, 24 LLM providers |
| Voice | `@echo-omega-prime/sdk/voice` | TTS, STT, emotion, voice cloning |
| Chat | `@echo-omega-prime/sdk/chat` | 14 AI personalities, session management |
| Vault | `@echo-omega-prime/sdk/vault` | Credential storage, breach detection |
| Tools | `@echo-omega-prime/sdk/tools` | 37,000+ MCP tools |
| Monitoring | `@echo-omega-prime/sdk/monitoring` | Request telemetry (local, no API) |
| Agent | `@echo-omega-prime/sdk/agent` | Autonomous AI agents |
| Scraper | `@echo-omega-prime/sdk/scraper` | Web data extraction |
| Bot | `@echo-omega-prime/sdk/bot` | Social media bots, 9 platforms |
| MEGA Gateway | `@echo-omega-prime/sdk/mega-gateway` | 37,400+ tools, 1,873 servers |
| Graph RAG | `@echo-omega-prime/sdk/graph-rag` | 312K nodes, 3.3M edges knowledge graph |
| Swarm | `@echo-omega-prime/sdk/swarm` | Multi-agent coordination, MoltBook |
| Dark Web | `@echo-omega-prime/sdk/darkweb` | Threat monitoring, breach detection |
| Crypto | `@echo-omega-prime/sdk/crypto` | Trading strategies, portfolio management |
| News | `@echo-omega-prime/sdk/news` | Real-time news intel, sentiment |
| SEC EDGAR | `@echo-omega-prime/sdk/sec-edgar` | Financial filings monitoring |
| Reddit | `@echo-omega-prime/sdk/reddit` | Subreddit monitoring, social intel |
| Price Alerts | `@echo-omega-prime/sdk/price-alerts` | Asset price monitoring |
| Landman | `@echo-omega-prime/sdk/landman` | Title & deed intelligence, 80 TX counties |
| Model Host | `@echo-omega-prime/sdk/model-host` | Custom AI inference, 10 LoRA adapters |
| Harvester | `@echo-omega-prime/sdk/harvester` | Data collection, 80+ sources |
| Scanner | `@echo-omega-prime/sdk/scanner` | County document scanning & OCR |
| Workflows | `@echo-omega-prime/sdk/workflows` | Automation pipelines, cron scheduling |
| Notifications | `@echo-omega-prime/sdk/notifications` | Multi-channel alerts |
| Fleet | `@echo-omega-prime/sdk/fleet` | Worker & service management |
| Memory Prime | `@echo-omega-prime/sdk/memory-prime` | 9-pillar permanent memory archive |
| Autonomous | `@echo-omega-prime/sdk/autonomous` | 24/7 daemon, health monitoring |

## Zero Dependencies

This SDK has **zero runtime dependencies**. It uses native `fetch`, native `crypto.subtle`, and ships its own retry logic, circuit breaker, and cache. Dev dependencies (`tsup`, `typescript`, `vitest`) are build/test-only and never ship in `dist/`.

## Testing

```bash
npm test          # vitest run — security, circuit-breaker, errors, cache
npm run typecheck  # tsc --noEmit
npm run build      # tsup — dual CJS/ESM + .d.ts
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security issues: see [SECURITY.md](SECURITY.md) — do not open a public issue for a vulnerability.

## License

MIT — [Echo Prime Technologies](https://echo-ept.com)
