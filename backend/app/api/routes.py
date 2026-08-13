from fastapi import APIRouter, HTTPException

from app.models import AnalyzeRequest, AnalysisResult
from app.analysis.pipeline import analyze_essay


router = APIRouter(
    prefix="/api",
    tags=["Analysis"],
)


@router.post(
    "/analyze",
    response_model=AnalysisResult,
)
async def analyze_essay_endpoint(
    request: AnalyzeRequest,
) -> AnalysisResult:
    """
    Analyze an admissions essay.

    Request:
        POST /api/analyze

    Body:
        {
            "essay": "...",
            "model_id": "custom"
        }

    The route only handles HTTP concerns.
    Detection logic lives inside app.analysis.pipeline.
    """

    try:
        result = analyze_essay(
            raw_text=request.essay,
            model_id=request.model_id,
        )

        return result

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        print(f"Analysis error: {exc}")

        raise HTTPException(
            status_code=500,
            detail="Essay analysis failed.",
        ) from exc
        