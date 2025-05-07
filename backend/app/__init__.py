from flask import Flask
from celery import Celery
from flask_cors import CORS  # Import CORS

# Khởi tạo biến celery ở ngoài
celery = Celery(__name__)

def make_celery(app):
    # Cập nhật cấu hình cho celery
    celery.conf.update(app.config)
    return celery

def create_app():
    app = Flask(__name__, static_folder='/app/static')
    app.config.from_object("app.config.Config")


    CORS(app)

    # Cấu hình celery
    make_celery(app)

    # Import và đăng ký blueprint (nếu có)
    from app.routes import main
    app.register_blueprint(main)

    return app
