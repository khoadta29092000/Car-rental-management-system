import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function Pagination1(props: any) {
  const { pagination, onPageChange, total } = props;
  const { page, pageSize } = pagination;
  const totalPages = Math.ceil(total / pageSize); // ví dụ 51 item chia 10 ra 6 trang
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  function handlePageChange(newPage: any) {
    if (onPageChange) {
      onPageChange(newPage);
    }
  }
  return (
    <Stack className="mx-auto mb-2 ">
      <Pagination
        color="primary"
        className="mx-auto "
        count={totalPages}
        onChange={(event, value) => handlePageChange(value)}
        page={page}
        variant="outlined"
        shape="rounded"
      ></Pagination>
    </Stack>
  );
}
