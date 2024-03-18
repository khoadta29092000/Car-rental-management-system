import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import Dialog from '@mui/material/Dialog';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}


export default function PopupImage(props: any) {
    let { src, CloseImg, openImg } = props;

    const handleClose = (value: string) => {
        CloseImg(false);
        setItem(1);
    };

    const [item, setItem] = React.useState(1);

    const handleRotate = () => {
        setItem(prevItem => prevItem === 4 ? 1 : prevItem + 1);
    };

    return (
        <Dialog onClose={handleClose} open={openImg}  >
            <img src={src} className={item == 1 ? " object-cover transform  " : item == 2 ? " object-cover transform  rotate-90" : item == 3 ? "h-[600px] object-cover w-[600px]  transform  rotate-180" : " object-cover transform  rotate-[270deg]"} />
            <div className=' w-10 h-10 bg-white  absolute right-2 top-2 border-[1px] border-gray-500 rounded-full' onClick={handleRotate}>
                <Tooltip title="Xoay chiều tấm ảnh" className='border-gray-400 border-[1px] '>
                    <IconButton>
                        <RotateLeftIcon className="text-gray-900 " />
                    </IconButton>
                </Tooltip>
            </div>

        </Dialog>
    );
}