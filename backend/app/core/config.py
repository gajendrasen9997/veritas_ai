from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    """
    Runtime configuration for VeritasAI.

    No database configuration is included because this backend
    is intentionally stateless.
    """

    app_name: str = os.getenv(
        "APP_NAME",
        "VeritasAI Backend",
    )

    app_version: str = os.getenv(
        "APP_VERSION",
        "1.0.0",
    )

    environment: str = os.getenv(
        "ENVIRONMENT",
        "development",
    )

    host: str = os.getenv(
        "HOST",
        "127.0.0.1",
    )

    port: int = int(
        os.getenv(
            "PORT",
            "8000",
        )
    )

    frontend_url: str = os.getenv(
        "FRONTEND_URL",
        "http://localhost:3000",
    )

    model_name: str = os.getenv(
        "MODEL_NAME",
        "distilgpt2",
    )

    max_model_tokens: int = int(
        os.getenv(
            "MAX_MODEL_TOKENS",
            "512",
        )
    )


settings = Settings()