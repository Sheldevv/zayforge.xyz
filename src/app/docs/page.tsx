import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'ZayForge API reference for the Launcher (Electron/JS) and game (Love2D/Lua).',
};

export default function DocsPage() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-4">API Documentation</h1>
        <p className="text-iron-400 text-lg mb-12">
          Reference for integrating the ZayForge API into your Launcher (Electron/JS)
          and game (Love2D/Lua).
        </p>

        {/* ── Table of Contents ──────────────────────── */}
        <div className="bg-iron-900/50 border border-iron-800 rounded-2xl p-6 mb-12">
          <h2 className="text-white font-bold mb-3">Endpoints</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              ['GET    /api/ping', '#ping'],
              ['POST   /api/auth/register', '#register'],
              ['POST   /api/auth/login', '#login'],
              ['GET    /api/auth/me', '#me'],
              ['PATCH  /api/auth/me', '#me-update'],
              ['DELETE /api/auth/me', '#me-delete'],
              ['POST   /api/auth/logout', '#logout'],
              ['POST   /api/auth/me/avatar', '#avatar-upload'],
              ['DELETE /api/auth/me/avatar', '#avatar-delete'],
              ['POST   /api/game/save', '#game-save'],
              ['GET    /api/game/load', '#game-load'],
              ['DELETE /api/game/saves', '#game-delete'],
              ['GET    /api/downloads', '#downloads'],
            ].map(([ep, id]) => (
              <a key={id} href={id} className="text-iron-400 hover:text-forge-400 transition-colors font-mono">
                {ep}
              </a>
            ))}
          </div>
        </div>

        {/* ── Auth overview ──────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication</h2>
          <p className="text-iron-400 mb-4">
            All auth-protected endpoints accept the JWT token in <strong>two ways</strong>:
          </p>
          <ul className="list-disc list-inside text-iron-400 space-y-1 mb-6">
            <li><strong>Bearer header</strong> — <code className="text-forge-400">Authorization: Bearer &lt;token&gt;</code> (use this in the launcher/game)</li>
            <li><strong>Cookie</strong> — <code className="text-forge-400">zayforge_token</code> httpOnly cookie (set automatically by web login)</li>
          </ul>

          <h3 className="text-white font-semibold mb-2">Electron/JS example</h3>
          <CodeBlock lang="javascript">{`// 1. Login
const { token } = await fetch('https://zayforge.xyz/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@email.com', password: 'mypass' })
}).then(r => r.json());

// 2. Store token
localStorage.setItem('zayforge_token', token);

// 3. All subsequent requests
const headers = { 'Authorization': \`Bearer \${token}\` };
const me = await fetch('https://zayforge.xyz/api/auth/me', { headers }).then(r => r.json());`}</CodeBlock>

          <h3 className="text-white font-semibold mb-2 mt-6">Love2D / Lua example</h3>
          <CodeBlock lang="lua">{`-- ZayForge API client for Love2D
-- Requires: luasocket (https://github.com/lunarmodules/luasocket)
--           dkjson    (https://github.com/LuaDist/dkjson)

local http = require("socket.http")
local ltn12 = require("ltn12")
local json = require("dkjson")

local API = "https://zayforge.xyz/api"

-- Login and get a token
local function login(email, password)
  local body = json.encode({ email = email, password = password })
  local resp = {}
  local _, status = http.request({
    url = API .. "/auth/login",
    method = "POST",
    headers = {
      ["Content-Type"] = "application/json",
      ["Content-Length"] = #body
    },
    source = ltn12.source.string(body),
    sink = ltn12.sink.table(resp)
  })
  if status ~= 200 then return nil, "Login failed" end
  local result = json.decode(table.concat(resp))
  return result.token, result.user
end

-- Make an authenticated request
local function authRequest(method, path, token, data)
  local headers = {
    ["Authorization"] = "Bearer " .. token,
    ["Content-Type"] = "application/json"
  }
  local body = data and json.encode(data) or nil
  if body then headers["Content-Length"] = #body end

  local resp = {}
  local _, status = http.request({
    url = API .. path,
    method = method,
    headers = headers,
    source = body and ltn12.source.string(body) or nil,
    sink = ltn12.sink.table(resp)
  })
  return json.decode(table.concat(resp)), status
end

-- Usage in love.load()
function love.load()
  local token, user = login("player@email.com", "password123")
  if token then
    -- Get profile
    local me = authRequest("GET", "/auth/me", token)
    print("Logged in as: " .. me.user.username)
  end
end`}</CodeBlock>
        </section>

        {/* ── Endpoints ─────────────────────────────── */}
        <Endpoint id="ping" method="GET" path="/api/ping" auth="none">
          Health check. Call this on launcher startup to verify the API is reachable.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response</h4>
          <CodeBlock lang="json">{`{
  "ok": true,
  "ping": "pong",
  "name": "ZayForge API",
  "version": "1.0.0",
  "time": "2026-06-07T00:00:00.000Z"
}`}</CodeBlock>
        </Endpoint>

        <Endpoint id="register" method="POST" path="/api/auth/register" auth="none">
          Create a new account. <strong>Auto-logs you in</strong> (returns token + sets cookie).
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Body</h4>
          <CodeBlock lang="json">{`{
  "username": "PlayerName",   // 3-20 chars, letters/numbers/underscores
  "email":    "a@b.com",      // valid email
  "password": "secret123"     // min 6 chars
}`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{
  "ok": true,
  "user": { "id": "...", "username": "PlayerName", "email": "a@b.com", "avatar": null, "createdAt": "..." },
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Errors</h4>
          <CodeBlock lang="text">{`400 - "Username must be at least 3 characters"
400 - "Invalid email address"
409 - "A user with that email already exists"`}</CodeBlock>
        </Endpoint>

        <Endpoint id="login" method="POST" path="/api/auth/login" auth="none">
          Log in with email and password. Returns a JWT token.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Body</h4>
          <CodeBlock lang="json">{`{ "email": "a@b.com", "password": "secret123" }`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{
  "ok": true,
  "user": { "id": "...", "username": "PlayerName", "email": "a@b.com", "avatar": null, "createdAt": "..." },
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}`}</CodeBlock>
        </Endpoint>

        <Endpoint id="me" method="GET" path="/api/auth/me" auth="Bearer or Cookie">
          Get the current user&apos;s profile.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{
  "ok": true,
  "user": { "id": "...", "username": "PlayerName", "email": "a@b.com", "avatar": "data:image/png;base64,...", "createdAt": "..." }
}`}</CodeBlock>
        </Endpoint>

        <Endpoint id="me-update" method="PATCH" path="/api/auth/me" auth="Bearer or Cookie">
          Change your username.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Body</h4>
          <CodeBlock lang="json">{`{ "username": "NewName" }`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{
  "ok": true,
  "user": { "id": "...", "username": "NewName", "email": "...", "avatar": "...", "createdAt": "..." }
}`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Errors</h4>
          <CodeBlock lang="text">{`400 - "Username must be at least 3 characters"
400 - "Username must be at most 20 characters"
400 - "Username can only contain letters, numbers, and underscores"
409 - "Username already taken"`}</CodeBlock>
        </Endpoint>

        <Endpoint id="me-delete" method="DELETE" path="/api/auth/me" auth="Bearer or Cookie">
          <span className="text-ember-400">Permanently delete</span> your account and all game saves.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{ "ok": true, "deleted": true }`}</CodeBlock>
        </Endpoint>

        <Endpoint id="logout" method="POST" path="/api/auth/logout" auth="Cookie">
          Clears the session cookie (web only). For launcher/game, just discard the token.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{ "ok": true, "success": true }`}</CodeBlock>
        </Endpoint>

        <Endpoint id="avatar-upload" method="POST" path="/api/auth/me/avatar" auth="Bearer or Cookie">
          Upload a <strong>16×16 PNG</strong> profile picture. Send raw PNG bytes with <code>Content-Type: image/png</code>.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Constraints</h4>
          <ul className="list-disc list-inside text-iron-400 text-sm space-y-1">
            <li>Must be a valid PNG file</li>
            <li>Exactly 16×16 pixels</li>
            <li>Max 4 KB</li>
          </ul>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Electron/JS</h4>
          <CodeBlock lang="javascript">{`const file = document.querySelector('input[type=file]').files[0];
const res = await fetch('https://zayforge.xyz/api/auth/me/avatar', {
  method: 'POST',
  headers: { 'Content-Type': 'image/png', 'Authorization': \`Bearer \${token}\` },
  body: file
});
const { user } = await res.json();`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Love2D / Lua</h4>
          <CodeBlock lang="lua">{`-- Read PNG from save directory and upload as avatar
local function uploadAvatar(token, filepath)
  local file = io.open(filepath, "rb")
  if not file then return nil, "Cannot open file" end
  local data = file:read("*a")
  file:close()

  local resp = {}
  local _, status = http.request({
    url = API .. "/auth/me/avatar",
    method = "POST",
    headers = {
      ["Authorization"] = "Bearer " .. token,
      ["Content-Type"] = "image/png",
      ["Content-Length"] = #data
    },
    source = ltn12.source.string(data),
    sink = ltn12.sink.table(resp)
  })
  return json.decode(table.concat(resp)), status
end`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{
  "ok": true,
  "user": { "id": "...", "username": "...", "email": "...",
            "avatar": "data:image/png;base64,iVBORw0KG...", "createdAt": "..." }
}`}</CodeBlock>
        </Endpoint>

        <Endpoint id="avatar-delete" method="DELETE" path="/api/auth/me/avatar" auth="Bearer or Cookie">
          Remove your profile picture.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{ "ok": true, "user": { ..., "avatar": null, ... } }`}</CodeBlock>
        </Endpoint>

        <Endpoint id="game-save" method="POST" path="/api/game/save" auth="Bearer or Cookie">
          Save game state to a slot (0-9). Upserts — creates if new, updates if exists.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Body</h4>
          <CodeBlock lang="json">{`{
  "slot":     0,              // 0-9
  "name":     "World 1",      // display name
  "data":     "{...}",        // JSON-encoded game state (required)
  "playTime": 3600,           // seconds (optional)
  "version":  "1.0"           // game version (optional)
}`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Love2D / Lua example</h4>
          <CodeBlock lang="lua">{`function saveGame(token, gameState, playTime)
  local body = json.encode({
    slot = 0,
    name = "My World",
    data = json.encode(gameState),
    playTime = playTime
  })
  local result, status = authRequest("POST", "/game/save", token, {
    slot = 0,
    name = "My World",
    data = json.encode(gameState),
    playTime = playTime
  })
  -- Actually use the helper correctly:
  local resp = {}
  local _, status = http.request({
    url = API .. "/game/save",
    method = "POST",
    headers = {
      ["Authorization"] = "Bearer " .. token,
      ["Content-Type"] = "application/json",
      ["Content-Length"] = #body
    },
    source = ltn12.source.string(body),
    sink = ltn12.sink.table(resp)
  })
  return json.decode(table.concat(resp)), status
end`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{
  "ok": true,
  "save": { "id": "...", "slot": 0, "name": "World 1", "version": "1.0",
            "playTime": 3600, "updatedAt": "..." }
}`}</CodeBlock>
        </Endpoint>

        <Endpoint id="game-load" method="GET" path="/api/game/load" auth="Bearer or Cookie">
          Load game saves. Pass <code>?slot=N</code> for a specific slot, or omit for all saves.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Examples</h4>
          <CodeBlock lang="text">{`GET /api/game/load          → all saves
GET /api/game/load?slot=0   → just slot 0`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Love2D / Lua example</h4>
          <CodeBlock lang="lua">{`function loadGame(token, slot)
  local resp = {}
  local url = API .. "/game/load"
  if slot then url = url .. "?slot=" .. slot end
  local _, status = http.request({
    url = url,
    headers = { ["Authorization"] = "Bearer " .. token },
    sink = ltn12.sink.table(resp)
  })
  local result = json.decode(table.concat(resp))
  if result.ok and #result.saves > 0 then
    local gameState = json.decode(result.saves[1].data)
    return gameState
  end
  return nil
end`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{
  "ok": true,
  "saves": [
    { "id": "...", "slot": 0, "name": "World 1",
      "data": "{\\"playerX\\":100}", "version": "1.0",
      "playTime": 3600, "updatedAt": "..." }
  ]
}`}</CodeBlock>
        </Endpoint>

        <Endpoint id="game-delete" method="DELETE" path="/api/game/saves" auth="Bearer or Cookie">
          Delete a specific save slot.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Query</h4>
          <CodeBlock lang="text">{`DELETE /api/game/saves?slot=0`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{ "ok": true, "deleted": true, "slot": 0 }`}</CodeBlock>
        </Endpoint>

        <Endpoint id="downloads" method="GET" path="/api/downloads" auth="none">
          Fetch the latest releases from GitHub.
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Query</h4>
          <CodeBlock lang="text">{`GET /api/downloads                    → launcher + game
GET /api/downloads?type=launcher      → launcher only
GET /api/downloads?type=game          → game only`}</CodeBlock>
          <h4 className="text-white text-sm font-semibold mt-3 mb-1">Response <span className="text-forge-400">200</span></h4>
          <CodeBlock lang="json">{`{
  "ok": true,
  "launcher": {
    "tag": "release", "name": "v1", "publishedAt": "...",
    "htmlUrl": "https://github.com/.../releases/tag/release",
    "assets": [
      { "name": "ZayForge.Launcher.1.0.0.exe", "size": 104319553,
        "browser_download_url": "https://...",
        "platform": "windows", "type": "portable" }
    ]
  }
}`}</CodeBlock>
        </Endpoint>

        {/* ── Footer note ───────────────────────────── */}
        <div className="mt-16 bg-iron-900/50 border border-iron-800 rounded-2xl p-6 text-center text-iron-400 text-sm">
          Base URL: <code className="text-forge-400">https://zayforge.xyz</code> &nbsp;|&nbsp;
          All responses include CORS headers. &nbsp;|&nbsp;
          Tokens expire after 30 days.
        </div>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────

function Endpoint({
  id, method, path, auth, children,
}: {
  id: string;
  method: string;
  path: string;
  auth: string;
  children: React.ReactNode;
}) {
  const methodColors: Record<string, string> = {
    GET: 'bg-forge-700 text-forge-200',
    POST: 'bg-blue-700 text-blue-200',
    PATCH: 'bg-amber-700 text-amber-200',
    DELETE: 'bg-ember-700 text-ember-200',
  };

  const authColors: Record<string, string> = {
    none: 'bg-iron-700 text-iron-300',
    'Bearer or Cookie': 'bg-amber-800 text-amber-200',
    'Cookie': 'bg-iron-700 text-iron-300',
    'Bearer': 'bg-amber-800 text-amber-200',
  };

  return (
    <section id={id} className="mb-10 scroll-mt-20">
      <div className="bg-iron-900/50 border border-iron-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${methodColors[method] || 'bg-iron-700 text-iron-300'}`}>
            {method}
          </span>
          <code className="text-white font-mono text-sm">{path}</code>
          <span className={`px-2 py-0.5 rounded text-xs ${authColors[auth.includes('Bearer') ? 'Bearer or Cookie' : auth] || 'bg-iron-700 text-iron-300'}`}>
            {auth}
          </span>
        </div>
        <div className="text-iron-400 text-sm leading-relaxed">{children}</div>
      </div>
    </section>
  );
}

function CodeBlock({ lang, children }: { lang: string; children: string }) {
  return (
    <div className="bg-iron-950 border border-iron-800 rounded-lg overflow-hidden my-2">
      <div className="flex items-center justify-between px-4 py-1.5 bg-iron-900/50 border-b border-iron-800">
        <span className="text-xs text-iron-500 uppercase">{lang}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-iron-200 font-mono leading-relaxed whitespace-pre">{children}</code>
      </pre>
    </div>
  );
}
