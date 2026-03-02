FROM python:3.13-slim

WORKDIR /app

# Install system deps + Microsoft ODBC Driver 18 for SQL Server (no apt-key)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates gnupg unixodbc-dev \
 && mkdir -p /etc/apt/keyrings \
 && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
    | gpg --dearmor -o /etc/apt/keyrings/microsoft.gpg \
 && chmod 644 /etc/apt/keyrings/microsoft.gpg \
 && curl -fsSL https://packages.microsoft.com/config/debian/12/prod.list \
    -o /etc/apt/sources.list.d/mssql-release.list \
 && sed -i 's|^deb |deb [signed-by=/etc/apt/keyrings/microsoft.gpg] |' \
    /etc/apt/sources.list.d/mssql-release.list \
 && apt-get update \
 && ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql18 \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--log-level", "debug", "--access-log"]