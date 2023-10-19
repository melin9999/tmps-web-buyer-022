'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Button, CircularProgress } from '@mui/material';

function SampleNextArrow(props) {
  const { className, style, onClick, width } = props;
  return (
    <div
      className={className}
      style={{...style, position: 'absolute', top: width>=768?'50%':'25%', right: 7, zIndex: 50}}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick, width } = props;
  return (
    <div
      className={className}
      style={{...style, position: 'absolute', top: width>=768?'50%':'25%', left: 7, zIndex: 50}}
      onClick={onClick}
    />
  );
}

const HomeSlider = ({width}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [slides, setSlides] = useState([]);
  var settings = {
    dots: true,
    fade: true,
    autoplay: true,
    pauseOnFocus: true,
    pauseOnHover: true,
    adaptiveHeight: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    speed: 500,
    autoplaySpeed: 6000,
    nextArrow: <SampleNextArrow width={width} />,
    prevArrow: <SamplePrevArrow width={width} />,
    dots: false,
  };

  useEffect(() => {
    getSlides();
  }, []);

  async function getSlides(){
    try{
      setServerError(false);
      setIsLoading(true);
      var error = false;
      if(!error){
        const response = await axios.post("/api/slides/active/", {});
        const values = [];
        response.data.data.rows.map(val => {
          var imageUrl = "";
          if(val.image_url==="none"){
            imageUrl = "none";
          }
          else{
            imageUrl = "http://tm-web.effisoftsolutions.com/"+val.image_url;
          }
          var position = {};
          if(val.position=="top_start"){
            position = {
              position: 'absolute',
              top: val.v_position,
              left: val.h_position,
              zIndex: 50,
              backgroundColor: val.background_color,
              backgroundOpacity: val.background_opacity,
            };
          }
          if(val.position=="top_end"){
            position = {
              position: 'absolute',
              top: val.v_position,
              right: val.h_position,
              zIndex: 50,
              backgroundColor: val.background_color,
              backgroundOpacity: val.background_opacity,
            };
          }
          if(val.position=="bottom_start"){
            position = {
              position: 'absolute',
              bottom: val.v_position,
              left: val.h_position,
              zIndex: 50,
              backgroundColor: val.background_color,
              backgroundOpacity: val.background_opacity,
            };
          }
          if(val.position=="bottom_end"){
            position = {
              position: 'absolute',
              bottom: val.v_position,
              right: val.h_position,
              zIndex: 50,
              backgroundColor: val.background_color,
              backgroundOpacity: val.background_opacity,
            };
          }
          var styles = {
            headingColor: val.heading_color,
            subHeadingColor: val.sub_heading_color,
            contentColor: val.content_color,
          };
          values.push({
            id: val.id,
            description: val.description,
            heading: val.heading,
            sub_heading: val.sub_heading,
            content: val.content,
            position: position,
            styles: styles,
            image_url: imageUrl,
            show_caption: val.show_caption,
            status: val.status,
          });
        });
        setSlides(values);
      }
    }
    catch(error){
      setServerError(true);
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <div className='w-full max-w-7xl py-0 relative bg-slate-50'>
      {isLoading?
        <div className='flex flex-col items-center justify-center w-full h-[100px] xs:h-[200px] sm:h-[200px] lg:h-[400px]'>
          <CircularProgress size={30} style={{color:"#71717a"}} />
          <span className="text-sm mt-5 font-semibold text-gray-700">Loading...</span>
        </div>:
        <Slider {...settings}>
          {slides.map(val=>
            <div key={val.image_url} className='flex flex-col justify-center items-center relative my-0'>
              <img src={val.image_url} alt='slider image' style={{margin: 0, width: width>1280?(1280):(width)}}/>
              {val.show_caption==="yes" &&
                <div className='flex flex-col w-full lg:max-w-[600px] lg:opacity-70 px-2 py-2' style={width<1024?{backgroundColor: val.position.backgroundColor}:val.position}>
                  <span className='opacity-100 font-bold text-sm h-[20px] overflow-hidden' style={{color: val.styles.headingColor}}>{val.heading}</span>
                  {val.sub_heading===""?
                    <span className='mb-2 h-[20px]' style={{borderBottom: '1px solid #D1D5DB'}}></span>:
                    <span className='opacity-100 font-bold text-xs mb-2 h-[20px] overflow-hidden' style={{color: val.styles.subHeadingColor, borderBottom: '1px solid #D1D5DB'}}>{val.sub_heading}</span>
                  }
                  <span className='flex opacity-100 font-bold text-[12px] h-[57px] text-justify overflow-hidden' style={{color: val.styles.contentColor}}>{val.content}</span>
                  {val.link!=="" && 
                    <div className='flex flex-row justify-end items-center mt-3'>
                      <Button size='small' variant='outlined' onClick={()=>router.push(val.link)}>{"Learn More..."}</Button>
                    </div>
                  }
                </div>
              }
            </div>
          )}
        </Slider>
      }
    </div>
  )
}

export default HomeSlider;