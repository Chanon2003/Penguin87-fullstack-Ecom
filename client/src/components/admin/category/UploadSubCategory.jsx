import { useEffect, useState } from 'react';
import { IoClose, IoReload } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import Axios from '../../../utils/Axios';
import SummaryApi from '../../../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../../../utils/AxiosToastError';

const UploadSubCategory = ({ close, fetchSubCategory }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    categoryId: ""
  });

  const allCategory = useSelector(s => s.product.allCategory);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading.");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({ ...prev, [name]: value }));
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
  };

  const handleSubmitCategory = async (e) => {
    if(loading)return
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", subCategoryData.name);
      formData.append("categoryId", subCategoryData.categoryId);
      if (selectedFile instanceof File) {
        formData.append("subcategory", selectedFile);
      }

      const res = await Axios({
        ...SummaryApi.createSubCategory,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { data: responseData } = res;
      if (responseData.success) {
        toast.success(responseData.message);
        close?.();
        fetchSubCategory?.();
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText(prev =>
          prev === "Loading." ? "Loading.." :
          prev === "Loading.." ? "Loading..." : "Loading."
        );
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <section className="fixed inset-0 bg-neutral-800 z-50 bg-opacity-70 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white p-4 rounded">
        <div className='flex items-center justify-between gap-3'>
          <h1 className='font-semibold'>Add subcategory</h1>
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
            <select
              className='w-full p-2 bg-transparent outline-none border rounded'
              onChange={(e) => setSubCategoryData(prev => ({ ...prev, categoryId: e.target.value }))}
              value={subCategoryData.categoryId}
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

          <button
            className={`px-4 py-1 border font-semibold ${subCategoryData.name && selectedFile && subCategoryData.categoryId
              ? 'bg-primary-200 hover:bg-primary-100'
              : 'bg-gray-200 cursor-not-allowed'}
            `}
            type="submit"
            disabled={!subCategoryData.name || !selectedFile || !subCategoryData.categoryId}
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

export default UploadSubCategory;
