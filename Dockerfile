FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# Set work directory
WORKDIR /code

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
        pkg-config \
        default-libmysqlclient-dev \
        curl \
        git \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip to latest version
RUN pip install --upgrade pip setuptools wheel

# Install Python dependencies
COPY requirements/ /code/requirements/
RUN pip install --no-cache-dir -r requirements/base.txt

# Copy project
COPY . /code/

# Create logs directory
RUN mkdir -p /code/logs

# Create media directory
RUN mkdir -p /code/media

# Create static directory
RUN mkdir -p /code/static

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /code
USER appuser

# Expose port
EXPOSE 8000

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120", "prm_backend.wsgi:application"]
