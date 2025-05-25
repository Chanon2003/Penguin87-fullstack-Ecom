import { useEffect, useState } from "react";
import UploadSubCategory from "../../components/admin/category/UploadSubCategory";
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import DisplayTable from "../../components/user/product/DisplayTable";
import { createColumnHelper } from '@tanstack/react-table';
import ViewImage from "../../components/user/product/ViewImage";
import { LuPencil } from 'react-icons/lu';
import { MdOutlineDelete } from 'react-icons/md';
import EditSubCategory from "../../components/admin/category/EditSubCategory";
import ConfirmBox from '../../components/common/ConfirmBox';
import toast from "react-hot-toast";
import Loading from "../../components/common/Loading";

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ImageUrl, setImageUrl] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ id: "" });
  const [deleteSubCategory, setDeleteSubCategory] = useState({ id: "" });
  const [openDeleteConfirmBox, setOpenDelteConfirmBox] = useState(false);

  // ฟังก์ชันดึงข้อมูล SubCategory
  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.getSubCategory,
      });
      const { data: responseData } = res;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // เรียก fetchSubCategory เมื่อ component โหลดหรือมี state เปลี่ยนแปลง
  useEffect(() => {
    fetchSubCategory();
  }, [openEdit, openAddSubCategory, openDeleteConfirmBox]);

  // กำหนดคอลัมน์สำหรับตาราง
  const columnHelper = createColumnHelper();
  const column = [
    columnHelper.accessor('name', {
      header: "Name",
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center items-center">
            <img
              src={row.original.subcatimage}
              alt={row.original.name}
              className="w-8 h-8 cursor-pointer"
              onClick={() => {
                setImageUrl(row.original.subcatimage);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor('Category', {
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.Category;
        return category?.name ? (
          <p className="shadow-md px-1 inline-block">{category.name}</p>
        ) : (
          <p>No category</p>
        );
      },
    }),
    columnHelper.accessor('id', {
      header: 'Action',
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-3">
            <button
              className="p-2 bg-green-100 rounded-full hover:text-green-600"
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original);
              }}
            >
              <LuPencil size={20} />
            </button>
            <button
              className="p-2 bg-red-100 text-red-400 rounded-full hover:text-red-600"
              onClick={() => {
                setOpenDelteConfirmBox(true);
                setDeleteSubCategory(row.original);
              }}
            >
              <MdOutlineDelete size={20} />
            </button>
          </div>
        );
      },
    }),
  ];

  // ฟังก์ชันลบ SubCategory
  const handleDeleteSubCategory = async () => {
    if(loading)return
    if (!deleteSubCategory || !deleteSubCategory.id) {
      toast.error("Invalid subcategory data");
      return;
    }
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });
      const { data: responseData } = res;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDelteConfirmBox(false);
        setDeleteSubCategory({ id: "" });
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเพิ่ม SubCategory
  const handleAddSubCategory = async (newSubCategoryData) => {
    try {
      const res = await Axios({
        ...SummaryApi.addSubCategory,
        data: newSubCategoryData,
      });
      const { data: responseData } = res;
      if (responseData.success) {
        toast.success(responseData.message);
        setOpenAddSubCategory(false);
        fetchSubCategory();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="mx-auto p-2 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl">
      {loading && (
        <div><Loading /></div>
      )}
      {/* Header Section */}
      <div className="p-3 bg-white shadow-md rounded-lg flex flex-col items-center gap-2">
        <h2 className="text-sm md:text-base font-semibold text-center">Sub Category</h2>
        <div className="flex flex-col sm:flex-row w-full gap-2">
          <button
            onClick={() => window.location.reload()}
            className="text-xs md:text-sm border border-gray-300 hover:bg-gray-100 px-3 py-2 rounded w-full sm:w-auto"
          >
            Refresh
          </button>
          <button
            onClick={() => setOpenAddSubCategory(true)}
            className="text-xs md:text-sm border border-gray-300 hover:bg-gray-100 px-3 py-2 rounded w-full sm:w-auto"
          >
            Add New
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="mt-3 overflow-auto w-full">
        {data && data.length > 0 ? (
          <div className="text-xs md:text-sm bg-white rounded-lg shadow-md p-2 min-w-[300px] sm:min-w-[400px] md:min-w-[600px]">
            <DisplayTable data={data} column={column} />
          </div>
        ) : (
          <div className="bg-white p-3 rounded-lg shadow-md text-center text-gray-500 text-xs md:text-sm">
            No subcategories found
          </div>
        )}
      </div>

      {/* Modals */}
      {openAddSubCategory && (
        <UploadSubCategory
          close={() => setOpenAddSubCategory(false)}
          onSubmit={handleAddSubCategory}
          fetchSubCategory={fetchSubCategory}
        />
      )}

      {ImageUrl && (
        <ViewImage
          url={ImageUrl}
          close={() => setImageUrl("")}
        />
      )}

      {openEdit && (
        <EditSubCategory
          data={editData || {}}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {openDeleteConfirmBox && (
        <ConfirmBox
          cancel={() => setOpenDelteConfirmBox(false)}
          close={() => setOpenDelteConfirmBox(false)}
          loading={loading}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>


  );
};

export default SubCategoryPage;