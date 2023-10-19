import { useEffect, useState } from 'react';
import axios from "axios";
import { CircularProgress } from '@mui/material';
import Slider from 'react-slick';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import FeaturedBrand from './FeaturedBrand';
import FeaturedCategory from '../categories/FeaturedCategory';

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div className='flex flex-col justify-center items-center w-[24px] h-[24px] rounded-[12px] bg-gray-300 opacity-50 cursor-pointer' onClick={onClick} style={{position: 'absolute', top: '50%', right: 12, zIndex: 20}}>
      <KeyboardArrowRight/>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div className='flex flex-col justify-center items-center w-[24px] h-[24px] rounded-[12px] bg-gray-300 opacity-50 cursor-pointer' onClick={onClick} style={{position: 'absolute', top: '50%', left: 12, zIndex: 20}}>
      <KeyboardArrowLeft/>
    </div>
  );
}

const FeaturedBrands = ({width, limit, selectValue}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  const [featured, setFeatured] = useState([]);
  const [itemWidth, setItemWidth] = useState(250);
  const [numberOfSlides, setNumberOfSlides] = useState(5);
  const [slidesToScroll, setSlidesToScroll] = useState(5);

  var settings = {
    autoplay: false,
    pauseOnFocus: true,
    pauseOnHover: true,
    dots: false,
    slidesToShow: numberOfSlides,
    slidesToScroll: slidesToScroll,
    infinite: true,
    speed: 1000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  useEffect(() => {
    setIsLoading(false);
    getFeatured();
  }, []);

  useEffect(() => {
    if(width>=1152){
      setItemWidth((1100/6)-20);
      setNumberOfSlides(featured.length>=6?6:featured.length);
      setSlidesToScroll(5);
    }
    else if(width>=1024 && width<1152){
      setItemWidth((width/5)-20);
      setNumberOfSlides(featured.length>=5?5:featured.length);
      setSlidesToScroll(featured.length>=4?4:featured.length);
    }
    else if(width>=640 && width<1024){
      setItemWidth((width/4)-20);
      setNumberOfSlides(featured.length>=4?4:featured.length);
      setSlidesToScroll(featured.length>=3?3:featured.length);
    }
    else if(width>=440 && width<640){
      setItemWidth((width/3)-20);
      setNumberOfSlides(featured.length>=3?3:featured.length);
      setSlidesToScroll(featured.length>=2?2:featured.length);
    }
    else if(width>=340 && width<440){
      setItemWidth((width/2)-20);
      setNumberOfSlides(featured.length>=2?2:featured.length);
      setSlidesToScroll(featured.length>=1?1:featured.length);
    }
    else{
      setItemWidth((200));
      setNumberOfSlides(featured.length>=1?1:featured.length);
      setSlidesToScroll(featured.length>=1?1:featured.length);
    }
  }, [width, featured]);

  async function getFeatured(){
    setServerError(false);
    setIsLoading(true);
    try{
      var error = false;
      if(!error){
        const response = await axios.post("/api/brands/featured", {
          limit: limit,
        });
        const values = [];
        var index = 0;
        var data = response.data.data;
        data.map(val => {
          ++index;
          var imageUrl = "";
          if(val.image_url==="none"){
            imageUrl = "none";
          }
          else{
            imageUrl = "http://tm-web.effisoftsolutions.com/"+val.image_url;
          }
          values.push({
            index: index,
            id: val.id,
            description: val.description,
            image_url: imageUrl
          });
        });
        setFeatured(values);
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
    <>
    {isLoading?
      <div className='flex flex-col items-center justify-center w-full h-[300px] lg:h-[225px] sm:h-[225px] xs:h-[225px] mb-10 bg-zinc-100'>
        <CircularProgress size={30} style={{color:"#71717a"}} />
      </div>:
      <div className='bg-white w-full mb-10'>
        <div className='flex flex-row justify-between items-center w-full py-2 px-1 xs:px-2'>
          <span className='text-sm xs:text-md md:text-md font-semibold text-zinc-600'>Brands</span>
          <span></span>
        </div>
        <div className='relative pt-3 w-full'>
          <Slider {...settings}>
            {featured.map((val)=>
              <FeaturedBrand key={val.id+val.description} val={val} itemWidth={itemWidth} selectValue={selectValue}/>
            )}
          </Slider>
        </div>
      </div>
    }
    </>
  )
}

export default FeaturedBrands;