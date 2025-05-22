/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import API_PATHS from '../../constant/apiPath';
import axios from 'axios';

const Content = () => {
    const [taskId, setTaskId] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [prevTaskId, setPrevTaskId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const storedTaskId = localStorage.getItem('task_id');

            if (storedTaskId && storedTaskId !== prevTaskId) {
                console.log('📦 Phát hiện thay đổi localStorage:', storedTaskId);
                setPrevTaskId(storedTaskId);
                setTaskId(storedTaskId);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [prevTaskId]);

    useEffect(() => {
        if (!taskId) return;

        const checkStatusAndFetchImage = async () => {
            setLoading(true);
            setError(null);

            try {
                const statusRes = await axios.get(`${API_PATHS.CHECK_STATUS}?task_id=${taskId}`);
                const { status, collage_url } = statusRes.data;

                if (status === 'SUCCESS') {
                    const collageRes = await axios.get(`${API_PATHS.GET_COLLAGE}${collage_url}`, {
                        responseType: 'blob',
                    });

                    const imgUrl = URL.createObjectURL(collageRes.data);
                    setImageUrl(imgUrl);
                    setLoading(false);
                } else if (status === 'FAILURE') {
                    setError('Xử lý ảnh thất bại.');
                    setLoading(false);
                } else {
                    // Nếu status vẫn đang xử lý (e.g. PENDING), thì đợi tiếp
                    setTimeout(checkStatusAndFetchImage, 2000); // tiếp tục check lại sau 2 giây
                }
            } catch (err) {
                console.error('❌ Lỗi khi check status:', err);
                setError('Lỗi khi kiểm tra trạng thái task.');
                setLoading(false);
            }
        };

        checkStatusAndFetchImage();
    }, [taskId]);



    return (
        <div className="content bg-white px-3 rounded-lg">
            <div className="content-image-container p-6">
                {/* Bên phải */}
                <div className=" bg-slate-200 h-96 flex justify-center items-center mt-20 p-5">
                    <div className="image-display text-center">
                        {loading ? (
                            <div className="text-gray-700 animate-pulse">
                                <p className="text-lg font-medium">⏳ Đang xử lý ảnh...</p>
                            </div>
                        ) : error ? (
                            <p className="text-red-600">{error}</p>
                        ) : imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Collage"
                                className="max-w-full max-h-[400px] object-contain rounded-lg"
                            />
                        ) : (
                            <p className="text-gray-500">Chưa có ảnh ghép.</p>
                        )}
                    </div>
                </div>

            </div>

            {imageUrl && !loading && (
                <a
                    href={imageUrl}
                    download="collage.jpg"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow"
                >
                    Download
                </a>
            )}
            {/* <button
                //onClick={handleSubmit}
                className="w-48 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                download="collage.jpg"
            >
                Download
            </button> */}
        </div>
    );
};

export default Content;
