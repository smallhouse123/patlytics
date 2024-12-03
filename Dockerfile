FROM python:3.10-slim

WORKDIR /app

COPY pyproject.toml pdm.lock ./

RUN pip install pdm
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
