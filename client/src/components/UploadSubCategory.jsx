import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import uploadImage from '../utils/UploadImage';
import { IoReload } from "react-icons/io5";

const UploadSubCategory = ({ close, fetchSubCategory }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: []
  });

  const allCategory = useSelector(s => s.product.allCategory);

  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadSubCategoryImage = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    // ตรวจสอบขนาดไฟล์ (ตัวอย่าง: ไม่เกิน 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setSelectedFile(file);

    // อัปเดต subCategoryData.image ด้วย URL ของรูปภาพ
    setSubCategoryData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  const handleRemoveCategorySelected = (categoryId) => {
    const updatedCategories = subCategoryData.category.filter(cat => cat.id !== categoryId);
    setSubCategoryData((prev) => ({
      ...prev,
      category: updatedCategories
    }));
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      let uploadedImageUrl = subCategoryData.image; // ถ้ามีรูปอยู่แล้ว ไม่ต้องอัปโหลดใหม่

      if (selectedFile) {
        // อัปโหลดรูปไปที่ Cloud ก่อน แล้วค่อยบันทึกลงฐานข้อมูล
        const res = await uploadImage(selectedFile);
        const { data: ImageResponse } = res;
        uploadedImageUrl = ImageResponse.data.url;
      }

      const res = await Axios({
        ...SummaryApi.createSubCategory,
        data: { ...subCategoryData, image: uploadedImageUrl },
      });

      const { data: responseData } = res;
      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
        }
        if (fetchSubCategory) {
          fetchSubCategory();  // รีเฟรชข้อมูลหลังจากเพิ่มเสร็จ
        }
      }
    } catch (error) {
      console.log(error)
      AxiosToastError(error);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchSubCategory()
  }, [])

  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("Loading.");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((prev) => {
          if (prev === "Loading.") return "Loading..";
          if (prev === "Loading..") return "Loading...";
          return "Loading.";
        });
      }, 500); // Adjust the delay (in milliseconds) as needed
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [loading]);

  return (
    <section className="fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 z-50 bg-opacity-70 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white p-4 rounded">
        <div className='flex items-center justify-between gap-3'>
          <h1 className='font-semibold'>Add subcategory</h1>
          <button onClick={close} aria-label="Close">
            <IoClose size={25} />
          </button>
        </div>
        <form action="" className='my-3 grid gap-3' onSubmit={handleSubmitCategory}>
          <div className='grid gap-1'>
            <label htmlFor="name">Name : </label>
            <input
              type="text"
              id='name'
              name='name'
              value={subCategoryData.name}
              onChange={handleChange}
              className='p-3 bg-blue-50 border outline-none focus-within:border-primary-200 rounded'
              required
            />
          </div>
          <div className='grid gap-1'>
            <p>Image</p>
            <div className='flex flex-col lg:flex-row items-center gap-3'>
              <div className='border h-36 w-full lg:w-36 bg-blue-50 flex items-center justify-center'>
                {!previewImage ? (
                  <p className='text-sm text-neutral-400'>No image</p>
                ) : (
                  <img
                    alt='Subcategory'
                    src={previewImage}
                    className='w-full h-full object-scale-down'
                  />
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage">
                <div className='px-4 py-1 border border-primary-100 text-primary-200 rounded hover:bg-primary-200 hover:text-neutral-900 cursor-pointer'>
                  Upload Image
                </div>
                <input
                  type="file"
                  id='uploadSubCategoryImage'
                  className='hidden'
                  onChange={handleUploadSubCategoryImage}
                  accept="image/*"
                />
              </label>
            </div>
          </div>
          <div className='grid gap-1'>
            <label htmlFor="category">Select Category</label>
            <div className='border focus-within:border-primary-200 rounded'>
              <div className='flex flex-wrap gap-2'>
                {subCategoryData.category.map((cat) => (
                  <p
                    key={cat.id + "selectedValue"}
                    className='bg-white shadow-md px-1 m-1 flex items-center gap-2'
                  >
                    {cat.name}
                    <div
                      className='cursor-pointer hover:text-red-600'
                      onClick={() => handleRemoveCategorySelected(cat.id)}
                      aria-label="Remove category"
                    >
                      <IoClose size={20} />
                    </div>
                  </p>
                ))}
              </div>
              <select
                className='w-full p-2 bg-transparent outline-none border'
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetails = allCategory.find(cat => cat.id === value);
                  if (categoryDetails) {
                    setSubCategoryData((prev) => ({
                      ...prev,
                      category: [...prev.category, categoryDetails]
                    }));
                  }
                }}
                required
              >
                <option value="">Select Category</option>
                {allCategory.map((category) => (
                  <option value={category.id} key={category.id + "subcategory"}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className={`px-4 py-1 border ${subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0]
                ? 'bg-primary-200 hover:bg-primary-100'
                : 'bg-gray-200'
              } font-semibold`}
            type="submit"
            disabled={!subCategoryData?.name || !subCategoryData?.image || !subCategoryData?.category[0]}
          >
            <button disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  {loadingText} <IoReload className="animate-spin ml-2" />
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadSubCategory;