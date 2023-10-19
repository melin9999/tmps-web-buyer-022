import { Button } from '@mui/material';
import Image from 'next/image';
import React from 'react';

const HomeBannerSmall = ({width, banner}) => {
  return (
    <div className='flex flex-col justify-center items-center relative' style={{margin: 0, width: width>1280?(1000):('90%'), height:width>1280?(250):((((width*90)/100)/4))}}>
      <Image src={banner.image_url} alt="banner" fill priority={true} style={{objectFit: 'cover'}}/>
      {banner.show_caption==="yes" && banner.link_only==="no" && 
        <div className='flex flex-col w-full lg:max-w-[600px] lg:opacity-70 px-2 py-2' style={width<1024?{backgroundColor: banner.position.backgroundColor}:banner.position}>
          <span className='opacity-100 font-bold text-sm h-[20px] overflow-hidden' style={{color: banner.styles.headingColor}}>{banner.heading}</span>
          {banner.sub_heading===""?
            <span className='mb-2 h-[20px]' style={{borderBottom: '1px solid #D1D5DB'}}></span>:
            <span className='opacity-100 font-bold text-xs mb-2 h-[20px] overflow-hidden' style={{color: banner.styles.subHeadingColor, borderBottom: '1px solid #D1D5DB'}}>{banner.sub_heading}</span>
          }
          <span className='flex opacity-100 font-bold text-[12px] h-[57px] text-justify overflow-hidden' style={{color: banner.styles.contentColor}}>{banner.content}</span>
          {banner.link!=="" && 
            <div className='flex flex-row justify-end items-center mt-3'>
              <Button size='small' variant='outlined' onClick={()=>router.push(banner.link)}>{"Learn More..."}</Button>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default HomeBannerSmall;