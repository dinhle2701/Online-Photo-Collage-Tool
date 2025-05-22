from app import celery
from app.utils import create_collage
from PIL import Image
import os
import uuid
from datetime import datetime, timedelta

@celery.task
def delete_file_later(path):
    try:
        if os.path.exists(path):
            os.remove(path)
            print(f"[INFO] Deleted file: {path}")
        else:
            print(f"[WARN] File already deleted or not found: {path}")
    except Exception as e:
        print(f"[ERROR] Error deleting file {path}: {e}")

@celery.task(bind=True, max_retries=3)
def create_collage_task(self, image_paths, layout, outer_border_size, border_color):
    try:
        collage_id = str(uuid.uuid4())
        collage_path = os.path.abspath(os.path.join('static', f"{collage_id}.jpg"))

        images = []
        for path in image_paths:
            try:
                if os.path.exists(path):
                    img = Image.open(path)
                    print(f"[DEBUG] Opened image: {path}, size: {img.size}")
                    images.append(img)
                else:
                    print(f"[ERROR] File does not exist: {path}")
            except Exception as e:
                print(f"[ERROR] Failed to open image {path}: {e}")

        if not images:
            raise ValueError("Không có ảnh hợp lệ để ghép.")

        collage = create_collage(images, layout, border_size, border_color)
        collage.save(collage_path)
        print(f"[INFO] Saved collage to {collage_path}")

        # Optional: Remove input images after use
        for path in image_paths:
            try:
                if os.path.exists(path):
                    os.remove(path)
                    print(f"[DEBUG] Deleted input image: {path}")
            except Exception as e:
                print(f"[ERROR] Failed to delete image {path}: {e}")

        # Schedule deletion after 5 minutes
        delete_file_later.apply_async(args=[collage_path], eta=datetime.utcnow() + timedelta(minutes=5))

        return collage_id

    except Exception as e:
        print(f"[ERROR] Error in create_collage_task: {e}")
        raise self.retry(exc=e, countdown=5)
