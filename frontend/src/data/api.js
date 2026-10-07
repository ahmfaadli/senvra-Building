const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.warn(
        '⚠️ VITE_API_URL belum diatur di file .env'
    );
}

export const api = async (endpoint, options = {}) => {
    try {
        const response = await fetch(
            `${API_URL}${endpoint}`,
            {
                ...options,

                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                }
            }
        );

        const contentType =
            response.headers.get('content-type');

        let data;

        if (
            contentType &&
            contentType.includes('application/json')
        ) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new Error(
                typeof data === 'object' &&
                data?.message
                    ? data.message
                    : 'Terjadi kesalahan pada API'
            );
        }

        return data;
    } catch (error) {
        console.error(
            'API Error:',
            error
        );

        throw error;
    }
};

export default api;