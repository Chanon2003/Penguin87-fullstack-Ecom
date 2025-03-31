import SummaryApi from '../common/SummaryApi';
import Axios from './Axios';

const uploadImageProduct = async (images, oldImageUrls) => {
  try {
    const formData = new FormData();
    console.log('มายัง')

    images.forEach((image, index) => {
      formData.append('image[]', image);
    });

    console.log('image',formData)

    if (oldImageUrls) {
      formData.append('oldImageUrls', JSON.stringify(oldImageUrls));
    } else {
      formData.append('oldImageUrls', JSON.stringify([]));
    }

    const response = await Axios({
      ...SummaryApi.uploadImages,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("🔍 Backend Response:", response);
    return response;
  } catch (error) {
    console.error("Error uploading images:", error.response ? error.response.data : error.message);
    throw error;  // เพิ่มการ throw error หากต้องการให้ฟังก์ชันนี้แจ้งข้อผิดพลาด
  }
};


export default uploadImageProduct;
