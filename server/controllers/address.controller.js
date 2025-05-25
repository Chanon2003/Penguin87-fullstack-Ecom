import { prisma } from '../lib/prisma.js'

export const addAddressController = async(req,res)=>{
  try {
    const userId = req.user.id
    const {address_line,city,state,pincode,country,mobile} = req.body

    const saveAddress = await prisma.address.create({
      data:{
        address_line:address_line,
        city:city,
        state:state,
        pincode:pincode,
        mobile:mobile,
        country:country,
        userId:userId
      }
    })

    const addUserAddressId = await prisma.user.update({
      where:{id:userId},
      data:{
        address_details: {
          connect: { id: saveAddress.id }  // ถ้าเป็น relation (1-to-many หรือ 1-to-1)
        }
      }
    })

    return res.json({
      message:'Address Created Successfully',
      error:false,
      success:true,
      data:saveAddress
    })

  } catch (error) {
    console.error("❌ Error in addAddressController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const getAddressController = async(req,res)=>{
  try {
    const userId = req.user.id

    const data = await prisma.address.findMany({
      where:{userId:userId},
      orderBy: { createdAt: "desc" }
    })

    return res.json({
      data:data,
      message:'List of Address',
      error:false,
      success:true
    })

  } catch (error) {
    console.error("❌ Error in getAddressController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const updateAddressController = async(req,res)=>{
  try {
    const userId = req.user.id
    const {id,address_line,city,state,country,pincode,mobile}=req.body

    const updateAddress = await prisma.address.update({
      where:{id:id,userId:userId},
      data:{
        address_line:address_line,
        city:city,
        state:state,
        country:country,
        mobile:mobile,
        pincode:pincode
      }
    })

    return res.json({
      message:'Address Update',
      error:false,
      success:true,
      data:updateAddress
    })

  } catch (error) {
    console.error("❌ Error in updateAddressController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const delelteAddressController = async(req,res)=>{
  try {
    const userId = req.user.id
    const {id} = req.body

    //ลบที่อยู่
    const disableAddress = await prisma.address.update({
      where:{id:id,userId:userId},
      data:{
        status:false
      }
    })

    return res.json({
      message:'Address Remove',
      error:false,
      success:true,
      data:disableAddress
    })
  } catch (error) {
    console.error("❌ Error in delelteAddressController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}