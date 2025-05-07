import os

class Config:
    # Cấu hình Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'mysecretkey')
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    
    # Cấu hình Celery
    CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')  # Redis
    CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
