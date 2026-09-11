"""MusicKit JWT developer token generator for Apple Music API.

Generates a signed ES256 JWT using the Apple Developer Team ID, Key ID,
and private key (.p8 file) required to authenticate against the Apple
Music API.

Required environment variables:
    APPLE_TEAM_ID   — 10-character Apple Developer Team ID
    APPLE_KEY_ID    — 10-character MusicKit Key ID (matches .p8 filename)
    APPLE_KEY_PATH  — Absolute path to the .p8 private key file
                      (defaults to ./connector/auth/AuthKey_<KEY_ID>.p8)
"""

from __future__ import annotations

import os
import time
from pathlib import Path

import jwt  # PyJWT[cryptography]


# MusicKit developer tokens expire after at most 6 months (15,777,000 s).
# We default to 12 hours for security hygiene; override via env var.
_DEFAULT_EXPIRY_SECONDS: int = 43_200  # 12 hours
_MAX_EXPIRY_SECONDS: int = 15_777_000  # ~6 months (Apple hard limit)

# Resolved once at import time so callers don't have to pass credentials.
_AUTH_DIR = Path(__file__).parent


def _resolve_key_path(key_id: str) -> Path:
    """Return the .p8 key path from env var or the default convention.

    Args:
        key_id: The MusicKit Key ID used to build the default filename.

    Returns:
        Resolved Path to the .p8 private key file.

    Raises:
        FileNotFoundError: If the resolved path does not exist.
    """
    env_path = os.environ.get("APPLE_KEY_PATH") or os.environ.get("APPLE_PRIVATE_KEY_PATH")
    path = Path(env_path) if env_path else _AUTH_DIR / f"AuthKey_{key_id}.p8"
    if not path.exists():
        raise FileNotFoundError(
            f"MusicKit private key not found at '{path}'. "
            "Set APPLE_KEY_PATH to the correct location."
        )
    return path


def generate_developer_token(
    team_id: str | None = None,
    key_id: str | None = None,
    key_path: str | Path | None = None,
    expiry_seconds: int = _DEFAULT_EXPIRY_SECONDS,
) -> str:
    """Generate a signed MusicKit developer (server-to-server) JWT.

    The token is signed with ES256 using the Apple-issued .p8 private key.
    Pass it in the ``Authorization: Bearer <token>`` header for every
    request to https://api.music.apple.com/v1.

    Args:
        team_id: Apple Developer Team ID (10 chars). Falls back to the
            ``APPLE_TEAM_ID`` environment variable if omitted.
        key_id: MusicKit Key ID (10 chars). Falls back to ``APPLE_KEY_ID``.
        key_path: Path to the .p8 private key file. Falls back to
            ``APPLE_KEY_PATH`` env var, then the default naming convention
            ``AuthKey_<KEY_ID>.p8`` in the same directory as this file.
        expiry_seconds: Token lifetime in seconds. Must be ≤ 15,777,000
            (~6 months). Defaults to 43,200 (12 hours).

    Returns:
        A signed JWT string ready for use as a Bearer token.

    Raises:
        ValueError: If required credentials are missing or expiry exceeds
            the Apple-imposed maximum.
        FileNotFoundError: If the .p8 key file cannot be located.
    """
    team_id = team_id or os.environ.get("APPLE_TEAM_ID")
    key_id = key_id or os.environ.get("APPLE_KEY_ID")

    if not team_id:
        raise ValueError(
            "Apple Team ID is required. Pass team_id= or set APPLE_TEAM_ID."
        )
    if not key_id:
        raise ValueError(
            "Apple Key ID is required. Pass key_id= or set APPLE_KEY_ID."
        )
    if expiry_seconds > _MAX_EXPIRY_SECONDS:
        raise ValueError(
            f"expiry_seconds ({expiry_seconds}) exceeds Apple's maximum of "
            f"{_MAX_EXPIRY_SECONDS} seconds (~6 months)."
        )

    resolved_key_path = Path(key_path) if key_path else _resolve_key_path(key_id)
    private_key_pem = resolved_key_path.read_text()

    now = int(time.time())
    payload = {
        "iss": team_id,
        "iat": now,
        "exp": now + expiry_seconds,
    }
    headers = {
        "alg": "ES256",
        "kid": key_id,
    }

    token: str = jwt.encode(
        payload,
        private_key_pem,
        algorithm="ES256",
        headers=headers,
    )
    return token


def get_auth_headers(
    team_id: str | None = None,
    key_id: str | None = None,
    key_path: str | Path | None = None,
    expiry_seconds: int = _DEFAULT_EXPIRY_SECONDS,
) -> dict[str, str]:
    """Return an Authorization header dict ready to pass to requests/httpx.

    Args:
        team_id: Apple Developer Team ID. Falls back to ``APPLE_TEAM_ID``.
        key_id: MusicKit Key ID. Falls back to ``APPLE_KEY_ID``.
        key_path: Path to the .p8 file. Falls back to env / default naming.
        expiry_seconds: Token lifetime in seconds (default 12 hours).

    Returns:
        Dict with a single ``Authorization`` key, e.g.
        ``{"Authorization": "Bearer eyJ..."}``.
    """
    token = generate_developer_token(
        team_id=team_id,
        key_id=key_id,
        key_path=key_path,
        expiry_seconds=expiry_seconds,
    )
    return {"Authorization": f"Bearer {token}"}
