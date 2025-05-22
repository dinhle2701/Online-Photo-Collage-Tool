/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import API_PATHS from '../../constant/apiPath.js';
import axios from 'axios';

const Sidebar = ({ setCollageId }) => {
  const [images, setImages] = useState([]);
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
    e.target.value = "";
  };

  const handleRemove = (indexToRemove) => {
    setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const [layout, setLayout] = useState('');
  const [border_thickness, setBorderThickness] = useState('');
  const [border_color, setBorderColor] = useState('');

  function isValidColor(color) {
    const cssColorTest = new Option().style;
    cssColorTest.color = color;
    if (cssColorTest.color !== '') return true;

    // Kiểm tra định dạng rgb hoặc rgba
    const rgbRegex = /^rgba?\(\s*(\d{1,3}\s*,\s*){2}\d{1,3}(,\s*\d+(\.\d+)?)?\s*\)$/;
    return rgbRegex.test(color);
  }




  const handleSubmit = async () => {
    if (!layout || images.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ảnh và loại ảnh ghép.");
      return;
    }

    if (border_thickness === '' || isNaN(border_thickness)) {
      alert("📏 Độ dày viền không hợp lệ. Vui lòng nhập số trong khoảng 0 - 1000.");
      return;
    }

    if (!isValidColor(border_color)) {
      alert("🎨 Màu không hợp lệ. Vui lòng nhập màu như 'white', 'rgb(255,255,255)' hoặc 'rgba(255,255,255,0.5)'.\nKhông hỗ trợ định dạng '#ffffff'.");
      return;
    }

    const validThickness = Math.max(0, Math.min(1000, parseInt(border_thickness, 10) || 0));

    const formData = new FormData();
    images.forEach((file) => formData.append("images", file));
    formData.append("collage_type", layout);
    formData.append("border_thickness", validThickness);
    formData.append("border_color", border_color);

    try {
      const res = await axios.post(API_PATHS.CREATE_COLLAGE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;
      console.log("✅ Task tạo thành công:", data);
      localStorage.setItem("task_id", data.task_id);
      alert("Task tạo thành công!");
      setCollageId(data.task_id);

      setImages([]);
      setLayout('');
      setBorderThickness('');
      setBorderColor('');
    } catch (err) {
      console.error("❌ Lỗi tạo task:", err);
      alert("Có lỗi xảy ra khi gửi task.");
    }
  };


  return (
    <div className='sidebar bg-white rounded-lg py-4 px-4 sm:px-6 w-full max-w-md mx-auto'>
      <div className="mb-4 text-start text-blue-600 font-semibold">
        <div className="my-2 space-y-2">
          {images.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <span className="truncate w-40 text-black text-sm" title={file.name}>
                {file.name}
              </span>
              <button
                className="ml-2 text-red-600 text-sm hover:underline"
                onClick={() => handleRemove(index)}
              >
                Xoá
              </button>
            </div>
          ))}
        </div>

        <label className="cursor-pointer inline-block bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 mt-3">
          Chọn ảnh
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="border-t my-3"></div>

      {/* collage_type */}
      <div className="mb-4 leading-10">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="collage_type"
            value="horizontal"
            checked={layout === 'horizontal'}
            onChange={(e) => setLayout(e.target.value)}
          />
          <span>Horizontal collage</span>
        </label>
        <label className="flex items-center space-x-2 mt-1">
          <input
            type="radio"
            name="collage_type"
            value="vertical"
            checked={layout === 'vertical'}
            onChange={(e) => setLayout(e.target.value)}
          />
          <span>Vertical collage</span>
        </label>
      </div>

      <div className="border-b my-3"></div>

      {/* border_thickness & border_color */}
      <div className="grid grid-cols-1 md:grid-cols-[10%_1fr] gap-y-4 gap-x-4 mt-7">
        <label className="md:text-end">Border</label>
        <input
          type="number"
          value={border_thickness}
          onChange={(e) => {
            const val = Math.max(0, Math.min(1000, Number(e.target.value)));
            setBorderThickness(val);
          }}
          min="0"
          max="1000"
          placeholder="0 - 1000"
          className="w-full border px-2 py-1 rounded"
        />

        <label className="md:text-end">Color</label>
        <input
          type="text"
          value={border_color}
          onChange={(e) => setBorderColor(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          placeholder="e.g. #9c88ff, rgb(156,136,255), white"
        />
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Make Collage
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
