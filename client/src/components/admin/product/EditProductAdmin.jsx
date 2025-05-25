import { useEffect, useState } from "react";
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import ViewImage from "../../user/product/ViewImage";
import { useSelector } from 'react-redux';
import AddFieldComponent from "./AddFieldComponent";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import AxiosToastError from "../../../utils/AxiosToastError";
import successAlert from "../../../utils/SuccessAlert";
import toast from "react-hot-toast";
import { IoReload } from "react-icons/io5";

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {

  const getMoreDetails = () => {
    if (!propsData.more_details) return {};

    if (typeof propsData.more_details === 'object' &&
      !Array.isArray(propsData.more_details) &&
      propsData.more_details !== null) {
      return propsData.more_details;
    }

    if (typeof propsData.more_details === 'string') {
      try {
        if (propsData.more_details === '[object Object]') {
          return {};
        }
        return JSON.parse(propsData.more_details);
      } catch (e) {
        console.error("Failed to parse more_details:", e);
        return {};
      }
    }

    return {};
  };

  // Normalize subcategories data on initial load
  const normalizeSubCategories = (subcategories) => {
    if (!subcategories) return [];
    return subcategories.map((s) => ({
      id: s.subCategoryId
        || s.id,
      name: s.subCategory?.name || s.name,
    }));
  };

  const initialDiscountStart = propsData.discount_start
  ? formatDatetimeLocal(propsData.discount_start)
  : "";

const initialDiscountEnd = propsData.discount_end
  ? formatDatetimeLocal(propsData.discount_end)
  : "";

  const [data, setData] = useState({
    id: propsData.id,
    name: propsData.name || "",
    image: propsData.image.map((el) => el.productimage) || [],
    imagePublicId: propsData.image.map((el) => el.productimagePublicId) || [],
    category: propsData.Category
      ? [{ id: propsData.categoryId, ...propsData.Category }]
      : [],
    subCategory: normalizeSubCategories(propsData.subcategories
    ),
    unit: propsData.unit || "",
    stock: propsData.stock || 0,
    price: propsData.price || 0,
    discount: propsData.discount || 0,
    // discount_show: propsData.discount_show || 0,
    discountStartTime: initialDiscountStart,
    discountEndTime: initialDiscountEnd,
    description: propsData.description || "",
    more_details: getMoreDetails(),
  });

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [previewImage, setPreviewImage] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector(s => s.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector(s => s.product.allSubCategory);

  const [oldImageUrls, setOldImageUrls] = useState([]); // 👉 ประกาศ state ตรงนี้

  function formatDatetimeLocal(isoDate) {
    const date = new Date(isoDate);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000); // ปรับ timezone เป็น local
    return localDate.toISOString().slice(0, 16); // ตัดให้เหลือแค่ "YYYY-MM-DDTHH:mm"
  }

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

    const imageUrls = validFiles.map((file) => URL.createObjectURL(file));

    setPreviewImage((prev) => [...prev, ...imageUrls]);
    setSelectedFile((prev) => [...prev, ...validFiles]);

    setData((prev) => ({
      ...prev,
      image: [...prev.image, ...imageUrls],
    }));
  };

  const handleDeleteImage = (index, { img, publicId }) => {

    if (!publicId) {
      console.warn("⚠️ publicId ไม่พบสำหรับ index:", index);
      return;
    }

    setOldImageUrls((prev) => [...prev, publicId]);

    // ลบรูปจาก array image
    const newImageArray = [...data.image];
    newImageArray.splice(index, 1);
    setData((prev) => ({
      ...prev,
      image: newImageArray,
    }));

    // ลบรูปจาก preview image
    setPreviewImage((prev) => {
      const newPreviewImages = [...prev];
      newPreviewImages.splice(index, 1);
      return newPreviewImages;
    });
  };

  const handleRemoveCategory = (index) => {
    const newCategories = [...data.category];
    newCategories.splice(index, 1);
    setData(prev => ({
      ...prev,
      category: newCategories
    }));
  };

  const handleRemoveSubCategory = (index) => {
    const newSubCategories = [...data.subCategory];
    newSubCategories.splice(index, 1);
    setData(prev => ({
      ...prev,
      subCategory: newSubCategories
    }));
  };

  const handleSubmit = async (e) => {
    if(loading)return;
    e.preventDefault();

    const isInvalidDate = (val) =>
      !val || val.startsWith("1970") || val === "0000-00-00T00:00";
    
    const isDiscountEmpty = !data.discount || data.discount == 0;
    const hasStartTime = !isInvalidDate(data.discountStartTime);
    const hasEndTime = !isInvalidDate(data.discountEndTime);
    
    // ❌ Discount เป็น 0 แต่มีเวลาอยู่ → ไม่ได้
    if (isDiscountEmpty && (hasStartTime || hasEndTime)) {
      alert("Please clear Discount Start Time and End Time before SUBMIT or add a Discount value");
      return;
    }
    
    // ✅ Discount มีค่า แต่ไม่มี startTime → ไม่ได้
    if (!isDiscountEmpty && !hasStartTime) {
      alert("Discount start time is required when discount is not zero!");
      return;
    }
    
    // ✅ มี startTime แต่ไม่มี endTime → ไม่ได้
    if (hasStartTime && !hasEndTime) {
      alert("Discount end time is required when discount start time is provided!");
      return;
    }
    
    // ✅ Convert เป็น ISO format
    let startISO = hasStartTime ? new Date(data.discountStartTime).toISOString() : "";
    let endISO = hasEndTime ? new Date(data.discountEndTime).toISOString() : "";


    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("id", data.id)
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("unit", data.unit);
      formData.append("stock", data.stock);
      formData.append("price", data.price);
      formData.append("discount", data.discount);

      if (startISO) formData.append("discountStartTime", startISO);
      if (endISO) formData.append("discountEndTime", endISO);

      formData.append("categoryId", data.category[0]?.id || "");


      const subCategoryId = data.subCategory.map((c) => c.id);
      formData.append("subCategoryId", JSON.stringify(subCategoryId));
      formData.append("more_details", JSON.stringify(data.more_details));

      formData.append("oldImagePublicIds", JSON.stringify(oldImageUrls));


      // Add image files
      selectedFile.forEach((file) => {
        formData.append("product", file, endISO);
      });

      const res = await Axios({
        ...SummaryApi.updateProductDetails,
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      });

      if (res.data?.success) {
        successAlert(res.data.message);
       
      setSelectedFile(null);
        if (close) close();
        fetchProductData();
      } else {
        AxiosToastError("Update product failed.");
      }
    } catch (error) {
      console.error("❌ handleSubmit Error:", error);
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    if (!fieldName.trim()) return;

    setData((p) => ({
      ...p,
      more_details: {
        ...p.more_details,
        [fieldName.trim()]: ""
      }
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
    <section className="fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4">
      <div className="bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]">

        <section>
          <div className="p-2 bg-white shadow-md flex items-center justify-between">
            <h2 className="font-semibold">Upload Product</h2>
            <button onClick={close}>
              <IoClose size={20} />
            </button>
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
                  <div className="flex flex-wrap gap-4">

                    {data.image.map((img, index) => {
                      const publicId = data.imagePublicId[index]; // ดึง publicId ที่ตรงกันจาก imagePublicId
                      return (
                        <div key={img + index} className="h-20 mt-1 w-20 min-w-20 bg-blue-50 relative group">
                          <img
                            src={img}
                            alt={img}
                            className="w-full h-full object-scale-down cursor-pointer"
                            onClick={() => setViewImageURL(img)}
                          />
                          <div
                            onClick={() => handleDeleteImage(index, { img, publicId })}
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
                          category: [category] // Only allow one category
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
                    {data.category.map((c, index) => (
                      <div key={c.id + index + "productses"} className="text-sm flex items-center gap-1 bg-blue-50 mt-1">
                        <p>{c.name}</p>
                        <div className="hover:text-red-500 cursor-pointer" onClick={() => handleRemoveCategory(index)}>
                          <IoClose size={20} />
                        </div>
                      </div>
                    ))}
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
                    value={selectSubCategory}
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
                    <option value="">Select Sub Category</option>

                    {allSubCategory &&
                      allSubCategory.map((c) => (
                        <option value={c.id} key={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>

                  <div className="flex flex-wrap gap-3">

                    {data.subCategory.map((c, index) => (

                      <div
                        key={c.id + index + "productses"}
                        className="text-sm flex items-center gap-1 bg-blue-50 mt-1 px-2 py-1 rounded"
                      >
                        <p>{c.name}</p>
                        <div
                          className="hover:text-red-500 cursor-pointer"
                          onClick={() => handleRemoveSubCategory(index)}
                        >
                          <IoClose size={20} />
                        </div>
                      </div>
                    ))}
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
                <label htmlFor="discount">Discount %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  id="discount"
                  placeholder="Enter product discount"
                  name="discount"
                  value={data.discount}
                  onChange={handleChange}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
              <div className="grid gap-1">
                <label htmlFor="discount_show">Discount Show</label>
                <input
                  type="number"
                  min={0}
                  id="discount_show"
                  placeholder="Enter product discount"
                  name="discount_show"
                  value={propsData.discount_show}
                  disabled  // ป้องกันการแก้ไขและไม่ส่งค่าผ่านฟอร์ม
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
                  value={data.discountStartTime|| ""}
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
                  value={data.discountEndTime || ""}
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
              <button disabled={loading}
                className="bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    {loadingText} <IoReload className="animate-spin ml-2" />
                  </div>
                ) : (
                  "Edit Submit"
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
      </div>
    </section>
  )

};

export default EditProductAdmin;