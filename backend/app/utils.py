from PIL import Image, ImageOps
import re

def parse_color(color_str):
    """
    Chuyển chuỗi màu CSS (rgb/rgba/hex/tên màu) thành tuple RGB.
    """
    if isinstance(color_str, tuple):
        return color_str  # Đã là tuple sẵn
    if color_str.startswith("rgb"):
        nums = list(map(float, re.findall(r"[\d.]+", color_str)))
        if len(nums) >= 3:
            return tuple(map(int, nums[:3]))  # Lấy R, G, B
    return color_str  # Giữ nguyên nếu là tên màu hợp lệ như 'white'

def create_collage(images, layout, outer_border_size, border_color='white'):
    if layout not in ('horizontal', 'vertical'):
        raise NotImplementedError("Chỉ hỗ trợ layout 'horizontal' hoặc 'vertical'.")

    resized_images = []

    if layout == 'horizontal':
        target_height = 300
        for img in images:
            if img.height == 0:
                print("[WARN] Ảnh có chiều cao bằng 0, bỏ qua.")
                continue
            aspect_ratio = img.width / img.height
            new_width = max(1, int(target_height * aspect_ratio))
            resized = img.resize((new_width, target_height), Image.Resampling.LANCZOS)
            resized_images.append(resized)
            print(f"[DEBUG] Resized image to: {resized.size}")

        if not resized_images:
            raise ValueError("Không có ảnh nào được resize hợp lệ.")

        total_width = sum(img.width for img in resized_images)
        collage = Image.new("RGB", (total_width, target_height))
        x_offset = 0
        for img in resized_images:
            collage.paste(img, (x_offset, 0))
            x_offset += img.width

    else:  # vertical layout
        target_width = 300
        for img in images:
            if img.width == 0:
                print("[WARN] Ảnh có chiều rộng bằng 0, bỏ qua.")
                continue
            aspect_ratio = img.height / img.width
            new_height = max(1, int(target_width * aspect_ratio))
            resized = img.resize((target_width, new_height), Image.Resampling.LANCZOS)
            resized_images.append(resized)
            print(f"[DEBUG] Resized image to: {resized.size}")

        if not resized_images:
            raise ValueError("Không có ảnh nào được resize hợp lệ.")

        total_height = sum(img.height for img in resized_images)
        collage = Image.new("RGB", (target_width, total_height))
        y_offset = 0
        for img in resized_images:
            collage.paste(img, (0, y_offset))
            y_offset += img.height

    # Add outer border
    if outer_border_size > 0:
        parsed_color = parse_color(border_color)
        collage = ImageOps.expand(collage, border=outer_border_size, fill=parsed_color)
        print(f"[DEBUG] Added outer border of size {outer_border_size}, color: {parsed_color}")

    return collage
