// const API_BASE_URL = "http://98.81.206.22:5000"
const API_BASE_URL = "http://localhost:5000"

export const API_PATHS = {
    CREATE_COLLAGE: `${API_BASE_URL}/create-task`,  // Thêm đường dẫn API tạo ảnh ghép
    CHECK_STATUS: `${API_BASE_URL}/check-status`,
    GET_COLLAGE:  `${API_BASE_URL}`,
};

export default API_PATHS;