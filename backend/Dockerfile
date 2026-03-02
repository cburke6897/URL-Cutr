FROM python:3.12-slim-bookworm

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
ENV ACCEPT_EULA=Y

RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends curl ca-certificates gnupg apt-transport-https unixodbc unixodbc-dev; \
  \
  # Clean up any broken/old Microsoft list files that can cause "Malformed entry" / exit 100
  rm -f /etc/apt/sources.list.d/mssql-release.list /etc/apt/sources.list.d/microsoft-prod.list /etc/apt/sources.list.d/packages-microsoft-prod.list; \
  \
  # Install Microsoft repo config the supported way
  curl -sSL -o /tmp/packages-microsoft-prod.deb https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb; \
  dpkg -i /tmp/packages-microsoft-prod.deb; \
  rm -f /tmp/packages-microsoft-prod.deb; \
  \
  apt-get update; \
  apt-get install -y --no-install-recommends msodbcsql18; \
  rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--log-level", "debug", "--access-log"]