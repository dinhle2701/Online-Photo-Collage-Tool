import React, { useState } from 'react';
import API_PATHS from '../../constant/apiPath.js';  // Giả sử bạn đã tạo API_PATHS như trước đó
import axios from 'axios';  // Import Axios

const Sidebar = ({ setCollageId }) => {
  const [images, setImages] = useState([]);
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
    e.target.value = ""; // Cho phép chọn lại file giống nhau
  };
  const handleRemove = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const [layout, setLayout] = useState('horizontal');
  const [border_thickness, setBorderThickness] = useState('12');
  const [border_color, setBorderColor] = useState('#ffffff');

  const handleSubmit = async () => {
    if (!layout || images.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ảnh và loại ảnh ghép.");
      return;
    }

    const formData = new FormData();
    images.forEach((file) => formData.append("images", file));
    formData.append("collage_type", layout);
    formData.append("border_thickness", border_thickness);
    formData.append("border_color", border_color);

    try {
      const res = await axios.post(API_PATHS.CREATE_COLLAGE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data; // Không cần res.json() với axios
      console.log("✅ Task tạo thành công:", data);
      console.log(data.task_id)
      localStorage.setItem("task_id", data.task_id)
      alert("Task tạo thành công!");

      setCollageId(data.task_id);

      // setImages([]);
      // setLayout("");
      // setBorderThickness("");
      // setBorderColor("");
      
    } catch (err) {
      console.error("❌ Lỗi tạo task:", err);
      alert("Có lỗi xảy ra khi gửi task.");
    }

  };



  return (
    <div className='sidebar bg-white rounded-lg py-8 px-6'>
      <div className="mb-3 text-start text-blue-600 font-semibold cursor-pointer">
        <div className="my-2 space-y-2">
          {images.map((file, index) => (
            <div key={index} className="flex items-center justify-between max-w-xs p-2 bg-gray-100 rounded">
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
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="border-t my-3"></div>

      {/* collage_type */}
      <div className="mb-3 leading-10">
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
      <div class="grid grid-cols-[10%_1fr] grid-rows-[repeat(2,1fr)] gap-y-[25px] gap-x-[30px]  mt-7">
        <label className="">Border</label>
        <input
          type="text"
          value={border_thickness}
          onChange={(e) => setBorderThickness(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <label className="">Color</label>
        <input
          type="text"
          value={border_color}
          onChange={(e) => setBorderColor(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div className="mb-3 leading-10 flex">

      </div>

      <div className="mb-3 leading-10 flex">

      </div>

      <button
        onClick={handleSubmit}
        className="w-48 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Make Collage
      </button>
    </div>
  )
}

export default Sidebar
