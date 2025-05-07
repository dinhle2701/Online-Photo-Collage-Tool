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
            try {
                const statusRes = await axios.get(`${API_PATHS.CHECK_STATUS}?task_id=${taskId}`);
                const { status, collage_url } = statusRes.data;

                if (status === 'SUCCESS') {
                    const collageRes = await axios.get(`${API_PATHS.GET_COLLAGE}${collage_url}`, {
                        responseType: 'blob',
                    });

                    const imgUrl = URL.createObjectURL(collageRes.data);
                    setImageUrl(imgUrl);
                }
            } catch (err) {
                console.error('❌ Lỗi khi check status:', err);
            }
        };

        checkStatusAndFetchImage();
    }, [taskId]);


    return (
        <div className="content bg-white px-3 rounded-lg">
            <div className="content-image-container p-6">
                {/* Bên phải */}
                <div className=" bg-slate-200 h-96 flex justify-center items-center mt-20 p-5">
                    <div className="image-display">
                        {loading ? (
                            <p>Đang xử lý...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Collage"
                                className="max-w-full max-h-[400px] object-contain rounded-lg"
                            />
                        ) : (
                            <p>Chưa có ảnh ghép.</p>
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
