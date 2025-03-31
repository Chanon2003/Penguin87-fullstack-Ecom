import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError';
import uploadImageCategory from '../utils/UploadImageCategory';

const EditCategory = ({ close, fetchData, data: CategoryData }) => {
    const [data, setData] = useState({
        id: CategoryData.id,
        name: CategoryData.name,
        image: CategoryData.image,
    });
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(CategoryData.image);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadCategoryImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file); // เก็บไฟล์ที่เลือกไว้
        setPreviewImage(URL.createObjectURL(file)); // แสดง preview
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let imageUrl = data.image; // เก็บ URL รูปเก่าก่อน
            let oldImageUrl = data.image; // ส่งไปให้ backend เพื่อลบรูปเก่า
            console.log('oldImageUrl',oldImageUrl)
    
            // ถ้ามีไฟล์ใหม่ที่ถูกเลือก ให้อัปโหลดก่อน
            if (selectedFile) {
                console.log("🚀 Uploading new image...");
                const response = await uploadImageCategory(selectedFile, oldImageUrl); // ส่ง oldImageUrl ไปให้ backend
                imageUrl = response.data.data.url; // รูปใหม่
                console.log("✅ New image uploaded:", imageUrl);
            }
    
            // ส่งค่าไปอัปเดตข้อมูล
            console.log("🗑️ Sending oldImageUrl for deletion:", oldImageUrl);
            const response = await Axios({
                ...SummaryApi.updateCategory,
                data: { ...data, image: imageUrl, oldImageUrl }, // ส่ง oldImageUrl ไปให้ Backend
            });
    
            const { data: responseData } = response;
            if (responseData.success) {
                toast.success(responseData.message);
                close();
                fetchData();
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };
    

  

    return (
        <section className='z-50 fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 flex items-center justify-center '>
            <div className='bg-white max-w-4xl w-full p-4 rounded'>
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold'>Update Category</h1>
                    <button onClick={close} className='w-fit block ml-auto'>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label id='categoryName'>Name</label>
                        <input
                            type='text'
                            id='categoryName'
                            placeholder='Enter category name'
                            value={data.name}
                            name='name'
                            onChange={handleOnChange}
                            className='bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p>Image</p>
                        <div className='flex gap-4 flex-col lg:flex-row items-center'>
                            <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded'>
                                {previewImage ? (
                                    <img
                                        alt='category'
                                        src={previewImage}
                                        className='w-full h-full object-scale-down'
                                    />
                                ) : (
                                    <p className='text-sm text-neutral-500'>No Image</p>
                                )}
                            </div>
                            <label htmlFor='uploadCategoryImage'>
                                <div className={`
                                    ${!data.name ? "bg-gray-300" : "border-primary-200 hover:bg-primary-100"}
                                    px-4 py-2 rounded cursor-pointer border font-medium
                                `}>
                                    <p>Upload Image</p>
                                </div>
                                <input disabled={!data.name} onChange={handleUploadCategoryImage} type='file' id='uploadCategoryImage' className='hidden' />
                            </label>
                        </div>
                    </div>
                    <button className={`${data.name && previewImage ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-300 "} py-2 font-semibold `}>
                     {loading ? "Loading..." : "Update Category"}
                     
                    </button>
                </form>
            </div>
        </section>
    );
};

export default EditCategory;
