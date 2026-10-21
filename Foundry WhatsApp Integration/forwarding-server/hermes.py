from flask import Flask, request, abort
import requests, os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

FOUNDRY_URL = os.getenv("FOUNDRY_URL")
FOUNDRY_TOKEN = os.getenv("FOUNDRY_TOKEN")
WEBHOOK_VERIFY_TOKEN = os.getenv("VER_TOKEN")

@app.route("/webhook", methods=["POST"])
def wa_hook():
    update = request.get_json(force=True)
    if not update:
        abort(400)

    # Wrap in Foundry’s “records” envelope:
    payload = {"records": [update]}

    # Forward to Foundry with Bearer auth:
    resp = requests.post(
        FOUNDRY_URL,
        json=payload,
        headers={
            "Authorization": f"Bearer {FOUNDRY_TOKEN}",
            "Content-Type": "application/json"
        },
        timeout=5
    )
    # You may choose to log resp.status_code / resp.text here.
    print(f"{resp.status_code}: {resp.text}")

    # Always return 200 to WhatsApp so it won’t retry
    return ("", 200)

@app.route("/webhook", methods=["GET"])
def verify_webhook():
    """
    Facebook sends a GET request here when you first add the webhook URL.
    If the token matches, echo the challenge back with HTTP 200.
    Otherwise respond with HTTP 403.
    """
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if mode == "subscribe" and token == WEBHOOK_VERIFY_TOKEN:
        print("Webhook verified successfully!")
        return challenge, 200
    else:
        abort(403)   # same as res.sendStatus(403) in Express


@app.route("/", methods=["GET"])
def get():
    return("OK", 400)

if __name__ == "__main__":
    app.run()
