import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export default function PopupComfirm(props: any) {
    let { CloseConfirm, isConfirm, open } = props;
    const handleClose = () => {
        CloseConfirm(false)
    };
    const handleClickConfirm = (value: boolean) => {
        CloseConfirm(false)
        isConfirm(value)
    };
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Xác nhận
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Anh/chị có chắc chắn muốn xóa giấy tờ này không? Giấy tờ này chỉ bị xóa khi anh/chị cập nhật lại yêu cầu.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => handleClickConfirm(false)}>
                        Không chấp nhận
                    </Button>
                    <Button onClick={() => handleClickConfirm(true)} autoFocus>
                        Chấp nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}