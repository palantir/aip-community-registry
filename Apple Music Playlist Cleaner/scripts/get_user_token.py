"""Serve a local MusicKit JS page to obtain a Music User Token.

Run from the project root:
    python3 scripts/get_user_token.py

What happens:
  1. Generates a fresh developer JWT from your .env credentials.
  2. Spins up a local HTTP server on http://localhost:8477.
  3. Opens the auth page in your default browser.
  4. You click "Connect Apple Music" and sign in with your Apple ID.
  5. The page displays your Music User Token — copy it to .env as
     APPLE_MUSIC_USER_TOKEN=<token>
"""

from __future__ import annotations

import os
import sys
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

try:
    from dotenv import load_dotenv
    load_dotenv(PROJECT_ROOT / ".env")
    raw_key_path = os.environ.get("APPLE_PRIVATE_KEY_PATH", "")
    if raw_key_path and not Path(raw_key_path).is_absolute():
        os.environ["APPLE_PRIVATE_KEY_PATH"] = str(PROJECT_ROOT / raw_key_path)
except ModuleNotFoundError:
    pass

from connector.auth.musickit_auth import generate_developer_token

_PORT = 8477
_APP_NAME = "MusicFoundry"


def _build_html(developer_token: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MusicFoundry — Connect Apple Music</title>
  <script src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"
          data-web-components async></script>
  <style>
    *, *::before, *::after {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
      color: #f5f5f7;
    }}
    .card {{
      background: #1c1c1e;
      border: 1px solid #2c2c2e;
      border-radius: 18px;
      padding: 40px 48px;
      max-width: 520px;
      width: 100%;
      text-align: center;
    }}
    .logo {{ font-size: 40px; margin-bottom: 12px; }}
    h1 {{ font-size: 22px; font-weight: 600; margin: 0 0 8px; }}
    p  {{ font-size: 14px; color: #8e8e93; margin: 0 0 32px; line-height: 1.5; }}
    button {{
      background: #fc3c44;
      color: #fff;
      border: none;
      border-radius: 980px;
      padding: 14px 32px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity .15s;
    }}
    button:hover {{ opacity: .85; }}
    button:disabled {{ opacity: .4; cursor: default; }}
    .token-box {{
      display: none;
      margin-top: 32px;
      text-align: left;
    }}
    .token-label {{
      font-size: 12px;
      font-weight: 600;
      color: #8e8e93;
      text-transform: uppercase;
      letter-spacing: .06em;
      margin-bottom: 8px;
    }}
    .token-value {{
      background: #2c2c2e;
      border-radius: 10px;
      padding: 14px;
      font-size: 11px;
      font-family: "SF Mono", Menlo, monospace;
      color: #30d158;
      word-break: break-all;
      line-height: 1.6;
    }}
    .copy-btn {{
      margin-top: 12px;
      background: #2c2c2e;
      color: #f5f5f7;
      font-size: 13px;
      padding: 10px 20px;
    }}
    .instructions {{
      margin-top: 20px;
      background: #2c2c2e;
      border-radius: 10px;
      padding: 14px;
      font-size: 12px;
      color: #8e8e93;
      text-align: left;
      line-height: 1.7;
    }}
    .instructions code {{
      color: #30d158;
      font-family: "SF Mono", Menlo, monospace;
    }}
    .status {{
      font-size: 13px;
      color: #8e8e93;
      margin-top: 16px;
      min-height: 20px;
    }}
    .error {{ color: #ff453a; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🎵</div>
    <h1>MusicFoundry</h1>
    <p>Connect your Apple Music account to authorise the Foundry connector.<br>
       You'll be prompted to sign in with your Apple&nbsp;ID.</p>

    <button id="auth-btn" onclick="authorize()">Connect Apple Music</button>
    <div class="status" id="status"></div>

    <div class="token-box" id="token-box">
      <div class="token-label">Music User Token</div>
      <div class="token-value" id="token-value"></div>
      <button class="copy-btn" onclick="copyToken()">Copy token</button>
      <div class="instructions">
        Add this line to your <code>.env</code> file:<br><br>
        <code>APPLE_MUSIC_USER_TOKEN=&lt;paste token here&gt;</code>
      </div>
    </div>
  </div>

  <script>
    const DEV_TOKEN = "{developer_token}";

    document.addEventListener("musickitloaded", async () => {{
      try {{
        await MusicKit.configure({{
          developerToken: DEV_TOKEN,
          app: {{ name: "{_APP_NAME}", build: "1.0.0" }},
        }});
      }} catch (e) {{
        setStatus("MusicKit configure failed: " + e.message, true);
      }}
    }});

    async function authorize() {{
      const btn = document.getElementById("auth-btn");
      btn.disabled = true;
      setStatus("Opening Apple Music authorization…");
      try {{
        const music = MusicKit.getInstance();
        const userToken = await music.authorize();
        showToken(userToken);
      }} catch (e) {{
        setStatus("Authorization failed: " + e.message, true);
        btn.disabled = false;
      }}
    }}

    function showToken(token) {{
      document.getElementById("token-value").textContent = token;
      document.getElementById("token-box").style.display = "block";
      document.getElementById("auth-btn").style.display = "none";
      setStatus("");
    }}

    function copyToken() {{
      const token = document.getElementById("token-value").textContent;
      navigator.clipboard.writeText(token).then(() => {{
        const btn = event.target;
        btn.textContent = "Copied!";
        setTimeout(() => btn.textContent = "Copy token", 2000);
      }});
    }}

    function setStatus(msg, isError = false) {{
      const el = document.getElementById("status");
      el.textContent = msg;
      el.className = "status" + (isError ? " error" : "");
    }}
  </script>
</body>
</html>"""


class _Handler(BaseHTTPRequestHandler):
    html: str = ""

    def do_GET(self) -> None:  # noqa: N802
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(_Handler.html.encode())

    def log_message(self, *_) -> None:  # suppress request logs
        pass


def main() -> None:
    print("Generating developer token…")
    token = generate_developer_token()
    print("Token generated.")

    _Handler.html = _build_html(token)
    server = HTTPServer(("localhost", _PORT), _Handler)

    url = f"http://localhost:{_PORT}"
    print(f"\nServing auth page at {url}")
    print("Opening browser…\n")

    threading.Timer(0.5, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")


if __name__ == "__main__":
    main()
