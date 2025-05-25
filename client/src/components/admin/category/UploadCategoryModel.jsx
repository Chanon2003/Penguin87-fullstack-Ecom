import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../../../utils/AxiosToastError";

const UploadCategoryModel = ({ close, fetchData }) => {
  const [data, setData] = useState({ name: "" });
const [previewImage, setPreviewImage] = useState(""); // blob สำหรับ preview
const [selectedFile, setSelectedFile] = useState(null); // set เป็น null ดีกว่า ""
const [loading, setIsLoading] = useState(false);

const handleOnChange = (e) => {
  const { name, value } = e.target;
  setData((prev) => ({ ...prev, [name]: value }));
};

const handleUploadCategoryImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ✅ เคลียร์ preview image เก่าก่อนสร้างใหม่
  if (previewImage && previewImage.startsWith("blob:")) {
    URL.revokeObjectURL(previewImage);
  }

  setSelectedFile(file);
  setPreviewImage(URL.createObjectURL(file));
};

const handleSubmit = async (e) => {
  if(loading)return;
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    
    // ✅ เช็คว่า selectedFile เป็น File จริง ๆ
    if (selectedFile instanceof File) {
      formData.append("category", selectedFile);
    }
    
    const res = await Axios({
      ...SummaryApi.addCategory,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { data: responseData } = res;
    if (responseData.success) {
      toast.success(responseData.message);
      close();
      fetchData();

      // ✅ เคลียร์ blob และไฟล์หลังอัปโหลดเสร็จ
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage("");
      setSelectedFile(null);
      setData({ name: "" }); // reset form
    }
  } catch (error) {
    console.error(error);
    AxiosToastError(error);
  } finally {
    setIsLoading(false);
  }
};

// ✅ cleanup blob memory เมื่อ component ถูกถอด
useEffect(() => {
  return () => {
    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
  };
}, [previewImage]);

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-60 p-4 flex items-center justify-center">
      <div className="bg-white max-w-4xl w-full p-4 rounded">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">Category</h1>
          <button onClick={close} className="w-fit block ml-auto">
            <IoClose size={25} />
          </button>
        </div>
        <form className="my-3 grid gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="categoryName">Name</label>
            <input
              type="text"
              id="categoryName"
              placeholder="Enter Category name"
              value={data.name}
              name="name"
              onChange={handleOnChange}
              className="bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded"
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                {previewImage ? (
                  <img
                    alt="category"
                    src={previewImage}
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No image</p>
                )}
              </div>
              <label htmlFor="uploadCategoryImage">
                <div
                  className={`${!data.name
                    ? "bg-gray-400"
                    : "border border-primary-200 hover:bg-primary-100"
                    } px-4 py-2 rounded cursor-pointer font-medium`}
                >
                  Upload Image
                </div>
                <input
                  disabled={!data.name}
                  onChange={handleUploadCategoryImage}
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <button
            className={`${data.name && (previewImage || data.image)
              ? "bg-primary-200 hover:bg-primary-100"
              : "bg-gray-300"
              } py-2 font-semibold`}
          >
            {loading ? "Uploading..." : "Add Category"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
