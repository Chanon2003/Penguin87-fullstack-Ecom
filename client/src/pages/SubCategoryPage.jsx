import { useEffect, useState } from "react";
import UploadSubCategory from "../components/UploadSubCategory";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from '@tanstack/react-table';
import ViewImage from "../components/ViewImage";
import { LuPencil } from 'react-icons/lu';
import { MdOutlineDelete } from 'react-icons/md';
import EditSubCategory from "../components/EditSubCategory";
import ConfirmBox from '../components/ConfirmBox';
import toast from "react-hot-toast";

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
      // console.log("API Response:", responseData); // ตรวจสอบโครงสร้างข้อมูล
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
      console.log(error);
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
              src={row.original.image}
              alt={row.original.name}
              className="w-8 h-8 cursor-pointer"
              onClick={() => {
                setImageUrl(row.original.image);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor('categoryRelations', {
      header: "Category",
      cell: ({ row }) => {
        // ตรวจสอบว่า row.original.categoryRelations มีค่าหรือไม่
        if (!row.original.categoryRelations || !Array.isArray(row.original.categoryRelations)) {
          return <p>No categories found</p>;
        }
    
        return (
          <>
            {row.original.categoryRelations.map((relation, index) => {
              // ตรวจสอบว่า relation และ relation.category มีค่าหรือไม่
              if (!relation || !relation.category) {
                return null;
              }
    
              return (
                <p key={relation.category.id + "table"} className="shadow-md px-1 inline-block">
                  {relation.category.name}
                </p>
              );
            })}
          </>
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
      console.log(error);
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