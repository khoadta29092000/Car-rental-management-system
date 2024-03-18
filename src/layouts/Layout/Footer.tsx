import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default function Footer() {
  return (
    <div className=" text-center mb-2 grid md:grid-cols-3  2xl:grid-cols-5 space-x-10 space-y-5   max-w-[1500px] mx-auto mt-8  font-bold text-lg">
      <div className="text-sm mb-3 xl:text-left text-center  ">
        <img
          className=" mt-1 xl:mx-0 mx-auto text-left  "
          src="https://amazingtech.vn/Content/amazingtech/assets/img/logo-color.png"
          alt="Workflow"
        />
        Power by Amazingtech @
      </div>
      <div className="text-left mb-3">
        <h2 className="uppercase">Liên hệ</h2>
        <ul className="text-base font-medium">
          <li>
            {" "}
            Địa chỉ:{" "}
            <a className="font-normal">
              Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Thành
              phố Hồ Chí Minh{" "}
            </a>
          </li>
          <li>
            {" "}
            Điện thoại: <a className="font-normal">0938565770</a>
          </li>
          <li>
            {" "}
            Email: <a className="font-normal">Vshare@gmail.com</a>
          </li>
        </ul>
        <div className="flex gap-4  justify-center lg:justify-start">
          <div className="text-blue-400">
            <FacebookIcon />
          </div>
          <div className="text-pink-400">
            <InstagramIcon />
          </div>
          <div className="text-blue-400">
            <TwitterIcon />
          </div>
          <div className="text-red-400">
            <YouTubeIcon />
          </div>
        </div>
      </div>
      <div className="text-left mb-3">
        <h2 className="uppercase">Giới thiệu</h2>
        <ul className="text-base font-medium">
          <li className="font-normal cursor-pointer">Về chúng tôi</li>
        </ul>
      </div>
      <div className="text-left mb-3">
        <h2 className="uppercase">Chính sách</h2>
        <ul className="text-base font-medium">
          <li className="font-normal cursor-pointer">
            Chính sách bảo mật thông tin
          </li>
          <li className="font-normal cursor-pointer">Cách thức hoạt động</li>
          <li className="font-normal cursor-pointer">Sự cố và khiếu nại</li>
        </ul>
      </div>
      <div className="text-left mb-3">
        <h2 className="uppercase">Chính sách</h2>
        <ul className="text-base font-medium">
          <li className="font-normal cursor-pointer">Hợp đồng thuê xe</li>
          <li className="font-normal cursor-pointer">Các câu hỏi thường gặp</li>
        </ul>
      </div>
    </div>
  );
}
