FROM python:3.11-slim

WORKDIR /app

# 依存パッケージをインストール (PDFライブラリのシステム依存関係)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    pkg-config \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 必要なPythonパッケージのリストをコピー
COPY requirements.txt .

# Pythonパッケージのインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコードをコピー
COPY . .

# 環境変数の設定
ENV FLASK_APP=app/app.py

# ポート8080を公開 (Cloud Runの推奨ポート)
EXPOSE 8080

# サーバー起動コマンド
CMD exec gunicorn --bind :8080 --workers 1 --threads 8 --timeout 0 app.app:app