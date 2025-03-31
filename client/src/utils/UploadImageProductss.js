import SummaryApi from '../common/SummaryApi';
import Axios from './Axios';

const uploadImageProducts = async (images, oldImageUrls) => {
  try {
    const formData = new FormData();
    console.log('มายัง')

    images.forEach((image) => {
      formData.append('image[]', image);
    });

    console.log("📤 Sending oldImageUrls:", oldImageUrls); // ✅ Debug

    if (oldImageUrls) {
      formData.append('oldImageUrls', JSON.stringify(oldImageUrls));
    } else {
      formData.append('oldImageUrls', JSON.stringify([]));
    }

    for (let [key, value] of formData.entries()) {
      console.log(`🔍 FormData Key: ${key}, Value:`, value);
    }

    const response = await Axios({
      ...SummaryApi.uploadImagess,
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





export default uploadImageProducts;
