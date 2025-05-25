import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import Axios from '../../../utils/Axios';
import SummaryApi from '../../../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../../../utils/AxiosToastError';
import { IoReload } from "react-icons/io5";

const EditSubCategory = ({ close, data, fetchData }) => {

  const [subCategoryData, setSubCategoryData] = useState({
    id: data.id,
    name: data.name,
    subcatimage: data.subcatimage,
    subcatimagePublicId: data.subcatimagePublicId,
    category: data.Category
      ? {
        id: data.Category.id,
        name: data.Category.name,
        image: data.Category.catimage,
      }
      : null,
  });


  // ตรวจสอบ allCategory จาก Redux store
  const allCategory = useSelector(s => s.product.allCategory);

  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadSubCategoryImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setSelectedFile(file);

    setSubCategoryData(prev => ({
      ...prev,
      subcatimage: imageUrl,
    }));

  };

  const handleSubmitCategory = async (e) => {
    if(loading)return;
    e.preventDefault();

    // ตรวจสอบข้อมูลก่อนส่ง API
    if (!subCategoryData.name || !subCategoryData.subcatimage || subCategoryData.category.length === 0) {
      return toast.error("Please fill all required fields.");;
    }

    try {
      setLoading(true);
        const formData = new FormData();
        formData.append("id", subCategoryData.id);
        formData.append("categoryId", subCategoryData.category.id);
        formData.append("name", subCategoryData.name);
        // ✅ เช็คให้แน่ใจว่า selectedFile เป็น File

        if (selectedFile instanceof File) {
          formData.append("imagePublicId", subCategoryData.subcatimagePublicId);
          formData.append("subcategory", selectedFile);
        }

        const res = await Axios({
          ...SummaryApi.updateSubCategory,
          data: formData,
          headers: {
              "Content-Type": "multipart/form-data",
          },
        });

        if (res.data.success) {
          toast.success(res.data.message);
          close && close();
          fetchData && fetchData();
        }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const [loadingText, setLoadingText] = useState("Loading.");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((prev) => {
          if (prev === "Loading.") return "Loading..";
          if (prev === "Loading..") return "Loading...";
          return "Loading.";
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <section className="fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 z-50 bg-opacity-70 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white p-4 rounded">
        <div className='flex items-center justify-between gap-3'>
          <h1 className='font-semibold'>Edit subcategory</h1>
          <button onClick={close} aria-label="Close">
            <IoClose size={25} />
          </button>
        </div>
        <form onSubmit={handleSubmitCategory} className='my-3 grid gap-3'>
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
                {!previewImage && !subCategoryData.subcatimage ? (
                  <p className='text-sm text-neutral-400'>No image</p>
                ) : (
                  <img src={previewImage || subCategoryData.subcatimage} alt='Subcategory' className='w-full h-full object-scale-down' />
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


              <select
                className='w-full p-2 bg-transparent outline-none border'
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetails = allCategory.find(cat => cat.id === value);
                  if (categoryDetails) {
                    setSubCategoryData(prev => ({
                      ...prev,
                      category: {
                        id: categoryDetails.id,
                        name: categoryDetails.name,
                        image: categoryDetails.catimage,
                      },
                    }));
                  }
                }}
                value={subCategoryData.category?.id || ""}
              >
                <option value="">Select Category</option>
                {allCategory.map(category => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

            </div>
          </div>
          <button
            type="submit"
            className={`px-4 py-1 border ${subCategoryData.name && subCategoryData.subcatimage && subCategoryData.category
              ? 'bg-primary-200 hover:bg-primary-100'
              : 'bg-gray-200'
              } font-semibold`}
            disabled={!subCategoryData.name || !subCategoryData.subcatimage || !subCategoryData.category || loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                {loadingText} <IoReload className="animate-spin ml-2" />
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditSubCategory;