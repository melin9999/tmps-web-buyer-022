import { CameraAlt } from "@mui/icons-material";
import Image from "next/image";

const SearchProductCompact = ({val, selectValue}) => {
  return (
    <div className='flex flex-col justify-center items-center mb-10' style={{width: 220}}>
      <div className="flex flex-row justify-center items-center w-[200px] h-[200px] relative mb-3">
        {val.image_url==="none"?<CameraAlt sx={{width: 120, height: 120, color: '#cbd5e1'}}/>:
        <Image src={val.image_url} alt="product image" fill sizes={'200px'} priority={true} style={{objectFit: 'contain'}}/>}
      </div>
      <div className="flex flex-col w-full justify-start items-start ml-3 mb-3">
        <span className='flex flex-col w-full h-[35px] overflow-hidden' style={{borderBottom: '1px solid #D1D5DB'}}><a className="text-xs font-semibold text-zinc-700 cursor-pointer no-underline hover:underline" href={'/products/'+encodeURIComponent(val.heading)} target="_blank">{val.heading}</a></span>
        <span className='flex flex-col w-full text-[11px] font-normal break-words h-[50px] overflow-hidden mt-1'>{val.short_description}</span>
        <div className='flex flex-row overflow-hidden gap-1 flex-wrap mt-1 w-full h-[22px]'>
          {val.featured==="yes"&&<span className='flex flex-col justify-center items-center h-[22px] py-1 px-1 bg-yellow-200 text-yellow-800 rounded text-[10px] font-bold'>Featured</span>}
          {val.free_shipping==="yes"&&<span className='flex flex-col justify-center items-center h-[22px] py-1 px-1 bg-purple-200 text-purple-800 rounded text-[10px] font-bold'>Free Shipping</span>}
          {val.quantity_discount_amount>0&&<span className='flex flex-col justify-center items-center h-[22px] py-1 px-1 bg-emerald-200 text-emerald-800 rounded text-[9px] font-bold'>{`Buy ${val.quantity_discount_amount} to get ${val.quantity_discount}% off!`}</span>}
          {val.quantity_free_issue_amount>0&&<span className='flex flex-col justify-center items-center h-[22px] py-1 px-1 bg-blue-200 text-blue-800 rounded text-[9px] font-bold'>{`Buy ${val.quantity_free_issue_amount} to get ${val.quantity_free_issue} free!`}</span>}
          {val.order_total_discount_amount>0&&<span className='flex flex-col justify-center items-center h-[22px] py-1 px-1 bg-pink-200 text-pink-800 rounded text-[9px] font-bold'>{`${val.order_total_discount}% off for orders more than Rs. ${parseFloat(val.order_total_discount_amount).toFixed(2)}!`}</span>}
        </div>
      </div>
      <div className='flex flex-row justify-end items-end w-full h-[32px]'>
        {parseFloat(val.discount)>0.0 ?
          <div className='flex flex-col justify-center items-end w-[100px] xs:w-[110px] mr-3'>
            <span className='text-[10px] font-bold text-red-400'>{val.discount+"% off"}</span>
            <span className='text-[11px] font-semibold text-zinc-600 line-through'>{"Rs. "+parseFloat(val.price).toFixed(2)}</span>
          </div>:<div></div>
        }
        <div className='flex flex-row justify-between items-center px-2 py-1 w-[100px] xs:w-[110px]' style={{border: '1px solid #10B981'}}>
          <span className='font-semibold text-[10px] xs:text-xs text-emerald-600'>{"Rs."}</span>
          <span className='text-[11px] xs:text-xs font-semibold text-emerald-600'>{parseFloat(val.discounted_price).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default SearchProductCompact;