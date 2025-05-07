import React, { useState } from 'react';

const Sidebar = () => {
  const [images, setImages] = useState([]);
  const [layout, setLayout] = useState('horizontal');
  const [border, setBorder] = useState('12');
  const [color, setColor] = useState('#ffffff');

  const removeImage = (name) => {
    setImages(images.filter(img => img.name !== name));
  };

  const handleMakeCollage = () => {
    console.log({ images, layout, border, color });
    // TODO: Gọi API hoặc xử lý tạo ảnh collage
  };
  return (
    <div className='sidebar bg-white rounded-lg py-8 px-6'>
      <div className="mb-3 text-start text-blue-600 font-semibold cursor-pointer">
        <input type="file" name="" id="" />

      </div>

      <div className="space-y-2 mb-3 ">
        {images.map((img) => (
          <div key={img.name} className="flex items-center justify-between px-2 py-1 bg-gray-100 rounded leading-10">
            <span className="text-gray-800">{img.name}</span>
            <button onClick={() => removeImage(img.name)} className="text-red-500 font-bold text-lg">×</button>
          </div>
        ))}
      </div>

      <div className="border-t my-3"></div>

      <div className="mb-3 leading-10">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="layout"
            value="horizontal"
            checked={layout === 'horizontal'}
            onChange={(e) => setLayout(e.target.value)}
          />
          <span>Horizontal collage</span>
        </label>
        <label className="flex items-center space-x-2 mt-1">
          <input
            type="radio"
            name="layout"
            value="vertical"
            checked={layout === 'vertical'}
            onChange={(e) => setLayout(e.target.value)}
          />
          <span>Vertical collage</span>
        </label>
      </div>

      <div className="border-b my-3"></div>

      <div class="grid grid-cols-[10%_1fr] grid-rows-[repeat(2,1fr)] gap-y-[25px] gap-x-[30px]  mt-7">
        <label className="">Border</label>
        <input
          type="text"
          value={border}
          onChange={(e) => setBorder(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
        <label className="">Color</label>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div className="mb-3 leading-10 flex">

      </div>

      <div className="mb-3 leading-10 flex">

      </div>

      <button
        onClick={handleMakeCollage}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Make Collage
      </button>
    </div>
  )
}

export default Sidebar
