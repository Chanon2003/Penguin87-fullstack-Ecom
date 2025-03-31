import SummaryApi from '../common/SummaryApi';
import Axios from './Axios';

const deleteImageProducts = async (oldImageUrls) => {
  try {
    const formData = new FormData();
    console.log("🚀 Uploading only oldImageUrls...");

    if (oldImageUrls && oldImageUrls.length > 0) {
      formData.append("oldImageUrls", JSON.stringify(oldImageUrls));
    } else {
      formData.append("oldImageUrls", JSON.stringify([]));
    }

    console.log("📤 Sending FormData:", formData);

    const response = await Axios({
      ...SummaryApi.deleteImages,  // 🔹 ใช้ API เดิม
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("🔍 Backend Response:", response);
    return response;
  } catch (error) {
    console.error("❌ Error uploading old images:", error.response ? error.response.data : error.message);
    throw error; // 🔹 คงการ throw error ไว้เพื่อแจ้งข้อผิดพลาด
  }
};



export default deleteImageProducts;
