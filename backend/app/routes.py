from flask import Blueprint, request, jsonify, send_from_directory, current_app
from app.tasks import create_collage_task
from celery.result import AsyncResult
import os
import uuid

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

main = Blueprint('main', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@main.route('/create-task', methods=['POST'])
def create_task():
    images = request.files.getlist('images')
    collage_type = request.form.get('collage_type')
    border_thickness = int(request.form.get('border_thickness', 5))
    border_color = request.form.get('border_color', 'black')

    if not images:
        return jsonify({"error": "No images uploaded"}), 400

    image_paths = []
    for image in images:
        if not allowed_file(image.filename):
            return jsonify({"error": f"File {image.filename} is not a valid image."}), 400

        filename = f"{uuid.uuid4().hex}_{image.filename}"
        path = os.path.join(UPLOAD_FOLDER, filename)
        image.save(path)
        image_paths.append(path)

    task = create_collage_task.apply_async(args=[image_paths, collage_type, border_thickness, border_color])
    return jsonify({"task_id": task.id}), 202


@main.route('/check-status', methods=['GET'])
def check_status():
    task_id = request.args.get('task_id')
    if not task_id:
        return jsonify({'error': 'Missing task_id'}), 400

    task = AsyncResult(task_id)

    if task.state == 'SUCCESS':
        collage_id = task.result
        collage_url = f"/get-collage?id={collage_id}"
        return jsonify({
            'status': task.state,
            'collage_url': collage_url
        })
    elif task.state == 'FAILURE':
        return jsonify({'status': 'FAILURE', 'error': str(task.result)}), 500
    else:
        return jsonify({'status': task.state})


@main.route('/get-collage', methods=['GET'])
def get_collage():
    collage_id = request.args.get('id')  # Lấy `collage_id` từ query string
    if not collage_id:
        return jsonify({"error": "Missing collage_id"}), 400
    
    # Đặt tên file là `collage_id.jpg`
    filename = f"{collage_id}.jpg"
    static_dir = current_app.static_folder  # Tìm trong thư mục static của ứng dụng
    collage_path = os.path.join(static_dir, filename)

    print(f"Looking for collage at: {collage_path}")  # Log đường dẫn tệp ảnh

    if not os.path.exists(collage_path):
        print(f"Collage {filename} not found in static directory.")  # Log lỗi nếu không tìm thấy ảnh
        return jsonify({"error": "Collage not found " + static_dir + " " + filename}), 404
    
    # Trả ảnh về cho client
    return send_from_directory(static_dir, filename)