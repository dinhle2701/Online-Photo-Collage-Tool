# Dockerfile
FROM python:3.10

WORKDIR /app

COPY . .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Tạo thư mục static để lưu ảnh kết quả
RUN mkdir -p static

ENV FLASK_APP=app:create_app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development

CMD ["flask", "run"]
