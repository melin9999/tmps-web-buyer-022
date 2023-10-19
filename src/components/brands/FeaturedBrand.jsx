import { CameraAlt } from "@mui/icons-material";
import Image from "next/image";

const FeaturedBrand = ({itemWidth, val, selectValue}) => {
  return (
    <div className='flex flex-col justify-center items-center px-2'>
      <div className='flex justify-center items-center relative mb-1' style={{width: (itemWidth), height: (itemWidth/2)}}>
        {val.image_url==="none"?<CameraAlt sx={{width: 90, height: 90, color: '#cbd5e1'}}/>:
        <Image src={val.image_url} alt="category image" fill sizes={(itemWidth)+'px'} priority={true} style={{objectFit: 'contain'}}/>}
      </div>
      <span className='flex flex-col text-zinc-600 text-xs sm:text-sm opacity-100 font-semibold break-words h-[50px] py-2 overflow-hidden px-2 cursor-pointer hover:underline' onClick={()=>selectValue(val)}>{val.description}</span>
    </div>
  )
}

export default FeaturedBrand;