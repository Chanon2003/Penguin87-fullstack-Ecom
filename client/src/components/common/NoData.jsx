import noDataImage from '../../assets/rem.jpg'

const NoData = () => {
  return (
    <div className='flex flex-col items-center justify-center py-4 gap-2'>
      <img src={noDataImage} alt="no data" className='w-24 bg-transparent' />
      <p className='text-neutral-50-500'>No data</p>
    </div>
  )
}
export default NoData