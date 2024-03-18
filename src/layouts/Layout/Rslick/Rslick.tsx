import "./Rslick.css"
import Slider from "react-slick";
export default function Rslick(props: any) {

  let { carMake, isAdmin } = props 
  var settings = {
    infinite: false,
    speed: 500,
    slidesToShow: isAdmin == true ? 2 : 4,
    slidesToScroll: 4,
    initialSlide: 0,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return isAdmin == false ?
    (
      <div>
        <Slider {...settings} className="text-center  justify-self-center items-center flex">
          {carMake.map((model: any) => (
            <div className='px-5' key={model.id}>
              <img src={model.carMakeImg} alt="img" className="rounded-t-lg w-full h-[200px] object-cover" />
              <h3 className="text-center py-2 text-[1rem] font-bold bg-main text-white rounded-b-md bg-blue-400  w-full">
                {model.name}
              </h3>
            </div>
          )
          )}
        </Slider>
      </div>) :
    (
      <div>
     
          {carMake.map((model: any) => (
 

<Slider {...settings} className="text-center  justify-self-center items-center flex" key={model.id}>
              <div className='px-5' >
                <img src={model.backImg} alt="img" className=" w-[250px] h-[150px] object-cover" />
                  
              </div>
              <div className='px-5' >
                <img src={model.frontImg} alt="img" className="w-[250px] h-[150px] object-cover" />
                
              </div>
              <div className='px-5' >
                <img src={model.leftImg} alt="img" className=" w-[250px] h-[150px] object-cover" />
               
              </div>
              <div className='px-5' >
                <img src={model.rightImg} alt="img" className="w-[250px] h-[150px] object-cover" />
               
              </div>
              </Slider>

          )
          )}
      
      </div>
    )

}