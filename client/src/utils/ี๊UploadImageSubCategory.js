import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const uploadImageSubCategory = async(image, oldImageUrl) => {
    try {
        const formData = new FormData();
        formData.append('image', image);  // แนบไฟล์ใหม่
        formData.append('oldImageUrl', oldImageUrl);  // แนบ URL ของไฟล์เก่าที่ต้องการลบ

        const response = await Axios({
            ...SummaryApi.uploadSubCtgImage,  // URL และการตั้งค่าของ Backend
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",  // ตั้งประเภท Content-Type
            },
        });

        return response;
    } catch (error) {
        return error;
    }
}

export default uploadImageSubCategory;
