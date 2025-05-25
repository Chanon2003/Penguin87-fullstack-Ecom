import { useEffect, useState } from "react";
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import ViewImage from "../../components/user/product/ViewImage";
import { useSelector } from 'react-redux';
import AddFieldComponent from "../../components/admin/product/AddFieldComponent";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import successAlert from "../../utils/SuccessAlert";
import toast from "react-hot-toast";
import { IoReload } from "react-icons/io5";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    discountStartTime: "",
    discountEndTime: "",
    description: "",
    more_details: {},
  });

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const [previewImage, setPreviewImage] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector(s => s.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCaategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector(s => s.product.allSubCategory);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((p) => ({
      ...p, [name]: value
    }));
  };

  const handleUploadImage = (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      toast.error("Please upload only image files.");
      return;
    }

    // สร้าง URL ตัวอย่างสำหรับทุกไฟล์
    const imageUrls = validFiles.map((file) => URL.createObjectURL(file));

    setPreviewImage((prev) => [...prev, ...imageUrls]); // เพิ่มตัวอย่างภาพใหม่
    setSelectedFile((prev) => [...prev, ...validFiles]); // เพิ่มไฟล์ใหม่ลงใน state

    setData((prev) => ({
      ...prev,
      image: [...prev.image, ...imageUrls], // อัปเดต image array
    }));
  };

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);
    setData((p) => ({
      ...p
    }));
  };

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);
    setData((p) => ({
      ...p
    }));
  };

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);
    setData((p) => ({
      ...p
    }));
  };

  const handleSubmit = async (e) => {
    if(loading)return;
    e.preventDefault();
  
    // ตรวจสอบเงื่อนไขกรอกข้อมูล
    if ((data.discountStartTime || data.discountEndTime) && (data.discount == 0 || !data.discount)) {
      return alert('Please clear discountStartTime And discountEndTime before SUBMIT or +discount value');
    }
    if (data.discount != 0 && !data.discountStartTime) {
      return alert('Discount start time is required when discount is not zero!');
    }
    if (data.discountStartTime && !data.discountEndTime) {
      return alert('Discount end time is required when discount start time is provided!');
    }
    
    let startISO = "";
    let endISO = "";

    if (data.discountStartTime && !isNaN(new Date(data.discountStartTime))) {
      startISO = new Date(data.discountStartTime).toISOString();
    }
    if (data.discountEndTime && !isNaN(new Date(data.discountEndTime))) {
      endISO = new Date(data.discountEndTime).toISOString();
    }
  
    setIsLoading(true);
    try {
      // สร้าง FormData
      const formData = new FormData();
  
      const formDataFields = {
        name: data.name,
        description: data.description,
        unit: data.unit,
        stock: data.stock,
        price: data.price,
        discount: data.discount,
      };

      formData.append("more_details", JSON.stringify(data.more_details));
      
      formData.append("category", data.category[0]?.id || "");
  
      Object.entries(formDataFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      // จัดการกับ subCategory
      data.subCategory.forEach((c) => formData.append("subCategory", c.id));
  
      // เพิ่มไฟล์ภาพ
      selectedFile.forEach((file) => formData.append("product", file));
  
      if (startISO) formData.append("discountStartTime", startISO);
      if (endISO) formData.append("discountEndTime", endISO);
  
      // ส่งข้อมูลไปยัง API
      const res = await Axios({
        ...SummaryApi.createProduct,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      });
  
      const { data: responseData } = res;
      if (responseData?.success) {
        successAlert(responseData.message);
        // reset state
        setData({
          name: "", image: [], category: [], subCategory: [], unit: "", stock: "", price: "",
          discount: "", description: "",  discount: "",
          discountStartTime: "",
          discountEndTime: "",more_details: {}
        });
        setPreviewImage([]);
        setSelectedFile([]);
      } else {
        return AxiosToastError("Create product failed.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      AxiosToastError(error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleAddField = () => {
    setData((p) => ({
      ...p, more_details: { ...p.more_details, [fieldName]: "" }
    }));
    setFieldName("");
    setOpenAddField(false);
  };

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
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between">
        <h2 className="font-semibold">Upload Product</h2>
      </div>
      <div className="grid p-3 ">
        <form action="" className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name" className="font-medium">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter product Name"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              id="description"
              placeholder="Enter product description"
              name="description"
              value={data.description}
              onChange={handleChange}
              required
              multiple
              rows={3}
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>
          <div>
            <p>Image</p>
            <div>
              <label htmlFor="productImage" className="bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer">
                <div className="text-center flex justify-center items-center flex-col">
                  <FaCloudUploadAlt size={35} />
                  <p>Upload Image</p>
                </div>
                <input
                  type="file"
                  name=""
                  id="productImage"
                  className="hidden"
                  onChange={handleUploadImage}
                  accept="image/*"
                />
              </label>
              {/* display upload image */}
              <div className="flex flex-wrap gap-4">
                {data.image.map((img, index) => {
                  return (
                    <div key={img + index} className="h-20 mt-1 w-20 min-w-20 bg-blue-50 relative group">
                      <img
                        src={img}
                        alt={img}
                        className="w-full h-full object-scale-down cursor-pointer"
                        onClick={() => setViewImageURL(img)}
                      />
                      <div
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-0 right-0 p-1 bg-red-500 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer"
                      >
                        <MdDelete />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Category</label>
            <div>
              <select
                name=""
                id=""
                className="bg-blue-50 border w-full p-2 rounded"
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find(el => el.id === value);
                  if (category) {
                    setData((p) => ({
                      ...p,
                      category: [category]
                    }));
                    setSelectCategory("");
                  }
                }}
              >
                <option value="">Select Category</option>
                {allCategory && allCategory.map((c, index) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-3">
                {data.category.map((c, index) => {
                  return (
                    <div key={c.id + index + "productses"} className="text-sm flex items-center gap-1 bg-blue-50 mt-1">
                      <p>{c.name}</p>
                      <div className="hover:text-red-500 cursor-pointer" onClick={() => handleRemoveCategory(index)}>
                        <IoClose size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Sub Category</label>
            <div>
              <select
                name=""
                id=""
                className="bg-blue-50 border w-full p-2 rounded"
                value={selectSubCaategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const subCategory = allSubCategory.find(el => el.id === value);
                  if (subCategory) {
                    setData((prev) => {
                      const alreadyExists = prev.subCategory.some(
                        (c) => c.id === subCategory.id
                      );
                      if (alreadyExists) return prev; // don't add if already exists

                      return {
                        ...prev,
                        subCategory: [...prev.subCategory, subCategory],
                      };
                    });
                    setSelectSubCategory("");
                  }
                }}
              >
                <option value="" className="text-neutral-600">Select Sub Category</option>
                {allSubCategory && allSubCategory.map((c, index) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-3">
                {data.subCategory.map((c, index) => {
                  return (
                    <div key={c.id + index + "productses"} className="text-sm flex items-center gap-1 bg-blue-50 mt-1">
                      <p>{c.name}</p>
                      <div className="hover:text-red-500 cursor-pointer" onClick={() => handleRemoveSubCategory(index)}>
                        <IoClose size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="stock">Number of Stock</label>
            <input
              type="number"
              min={0}
              id="stock"
              placeholder="Enter product stock"
              name="stock"
              value={data.stock}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              min={0}
              id="price"
              placeholder="Enter product price"
              name="price"
              value={data.price}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="discount">Discount % "Fill Percent"</label>
            <input
            required
              type="number"
              min={0}
              max={100}
              id="discount"
              placeholder="Enter product discount"
              name="discount"
              value={data.discount}
              onChange={handleChange}
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>

          <div className="grid gap-1 w-full max-w-full overflow-hidden">
            <label htmlFor="discountStartTime">Discount Start Time</label>
            <input
              type="datetime-local"
              id="discountStartTime"
              placeholder="Enter product discount start time"
              name="discountStartTime"
              value={data.discountStartTime}
              onChange={handleChange}
              className="w-full bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>

          <div className="grid gap-1 w-full max-w-full overflow-hidden">
            <label htmlFor="discountEndTime">Discount End Time</label>
            <input
              type="datetime-local"
              id="discountEndTime"
              placeholder="Enter product discount end time"
              name="discountEndTime"
              value={data.discountEndTime}
              onChange={handleChange}
              className="w-full bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="unit">Unit</label>
            <input
              type="text"
              id="unit"
              placeholder="Enter product unit"
              name="unit"
              value={data.unit}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>


          {/* add more field */}
          {Object?.keys(data?.more_details)?.map((k, index) => {
            return (
              <div className="grid gap-1" key={index}>
                <label htmlFor={k}>{k}</label>
                <input
                  type="text"
                  id={k}
                  value={data?.more_details[k]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setData((p) => ({
                      ...p, more_details: { ...p.more_details, [k]: value }
                    }));
                  }}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
            );
          })}

          <div
            onClick={() => setOpenAddField(true)}
            className="inline-block bg-white hover:bg-primary-200 py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded"
          >
            Add Fields
          </div>
          <button
            disabled={loading}
            className="bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold"
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
      {ViewImageURL && (
        <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />
      )}
      {openAddField && (
        <AddFieldComponent
          value={fieldName}
          onChange={(e) => {
            setFieldName(e.target.value);
          }}
          submit={handleAddField}
          close={() => setOpenAddField(false)}
        />
      )}
    </section>
  );
};

export default UploadProduct;