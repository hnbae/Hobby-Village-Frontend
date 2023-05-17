import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleImageSlider from 'react-simple-image-slider';
import {
  Container,
  Box,
  Typography,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  InputLabel,
  TextField,
  MenuItem,
  Button,
  Input,
  InputAdornment,
  Grid,
} from '@mui/material';
import axios from 'axios';

const AdminProductsCreate = () => {
  const prodCodeRef = useRef();
  const prodBrandRef = useRef();
  const prodPriceRef = useRef();
  const prodCategoryRef = useRef();
  const prodShippingRef = useRef(); // 배송비
  const prodNameRef = useRef();
  const prodContentRef = useRef();
  const prodHostRef = useRef();

  const prodPictureRef = useRef();
  const prodTagRef = useRef();

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const getBrandList = () => {
    axios
      .get(`/m/products/getBrandList`)
      .then((res) => {
        const { data } = res;
        setBrands(data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getCategoryList = () => {
    axios
      .get(`/m/products/getCategoryList`)
      .then((res) => {
        const { data } = res;
        setCategories(data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    getBrandList();
    getCategoryList();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    axios
      .post('/m/products/addProduct', {
        prodCode: prodCodeRef.current.value,
        prodBrand: prodBrandRef.current.value,
        prodPrice: prodPriceRef.current.value,
        prodCategory: prodCategoryRef.current.value,
        prodShipping: prodShippingRef.current.value,
        prodName: prodNameRef.current.value,
        prodContent: prodContentRef.current.value,
        prodHost: prodHostRef.current.value,
      })
      .catch((e) => {
        console.log(prodCodeRef.current.value);
        console.error(e);
      });
    // 연관검색어 쉼표와 공백 제거
    let str = prodTagRef.current.value;
    const arr = str
      .replace(/[,\s]+/g, ' ')
      .trim()
      .split(' ');
    console.log(arr); // test
    axios
      .post('/m/products/addProdTags', {
        prodCode: prodCodeRef.current.value,
        prodTag: arr,
      })
      .then((res) => {
        navigate(`/m/products/details/${prodCodeRef.current.value}`);
      })
      .catch((e) => {
        console.log(prodCodeRef.current.value);
        console.error(e);
      });
  };

  const tableHeadStyle = {
    width: 170,
    fontSize: 18,
    border: '1px solid #E0E0E0',
  };

  const tableBodyStyle = { width: 400, border: '1px solid #E0E0E0' };

  const inputStyle = {
    '& .MuiOutlinedInput-root.Mui-focused': {
      '& > fieldset': {
        borderColor: '#c3c36a',
      },
    },
  };

  const btnUploadImageStyle = {
    display: 'block',
    width: '60px',
    height: '20px',
    bgcolor: '#ECECEC',
    fontSize: '12px',
    color: '#4E4E4E',
    border: 'none',
    borderRadius: '5px',
    textAlign: 'center',
    lineHeight: '190%',
    boxShadow: '2px 2px 2px 1px #b0b0b0',
    '&:hover': {
      cursor: 'pointer',
    },
  };

  const btnSubmitStyle = {
    width: '65px',
    height: '35px',
    bgcolor: '#c3c36a',
    borderRadius: '20px',
    border: '1px solid #626262',
    color: '#323232',
    fontWeight: 'bold',
    '&:hover': {
      bgcolor: '#A9A951',
      border: '1px solid #626262',
      color: '#323232',
    },
  };

  const btnCancelStyle = {
    width: '65px',
    height: '35px',
    bgcolor: '#ffffff',
    borderRadius: '20px',
    border: '1px solid #626262',
    color: '#323232',
    fontWeight: 'bold',
    '&:hover': {
      bgcolor: '#ffffff',
      border: '1px solid #626262',
      color: '#000000',
    },
  };

  const images = [
    {
      url: "process.env.PUBLIC_URL + '/arena.png'",
    },
    {
      url: "process.env.PUBLIC_URL + '/brandyarn.png'",
    },
    {
      url: "process.env.PUBLIC_URL + '/excider.png'",
    },
  ];

  return (
    <Container>
      {/* 타이틀 */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mt: 5,
          mb: 5,
          pl: 1,
          pr: 1,
          fontWeight: 'bold',
        }}
      >
        상품 목록 &#62; 상품 등록
      </Typography>

      {/* form 시작 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <TableContainer>
          <Table sx={{ maxWidth: 1140 }}>
            <TableRow>
              <TableCell sx={tableHeadStyle}>
                <InputLabel for="prodCode">상품 코드</InputLabel>
              </TableCell>
              <TableCell sx={tableBodyStyle}>
                <TextField
                  id="prodCode"
                  fullWidth
                  size="small"
                  inputRef={prodCodeRef}
                  sx={inputStyle}
                ></TextField>
              </TableCell>
              <TableCell sx={tableHeadStyle}>
                <InputLabel for="prodBrand">브랜드</InputLabel>
              </TableCell>
              <TableCell sx={tableBodyStyle}>
                <TextField
                  id="prodBrand"
                  select
                  label="브랜드 선택"
                  fullWidth
                  size="small"
                  inputRef={prodBrandRef}
                  sx={inputStyle}
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={tableHeadStyle}>
                <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
                  <InputLabel for="prodPrice">대여료</InputLabel>
                  <Typography sx={{ fontSize: '12px', color: '#646464' }}>
                    &nbsp;(7일 기준)
                  </Typography>
                </Grid>
              </TableCell>
              <TableCell sx={tableBodyStyle}>
                <TextField
                  id="prodPrice"
                  fullWidth
                  size="small"
                  inputRef={prodPriceRef}
                  sx={inputStyle}
                  label="숫자만 입력"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">&#8361;</InputAdornment>
                    ),
                  }}
                ></TextField>
              </TableCell>
              <TableCell sx={tableHeadStyle}>
                <InputLabel for="prodCategory">카테고리</InputLabel>
              </TableCell>
              <TableCell sx={tableBodyStyle}>
                <TextField
                  id="prodCategory"
                  select
                  label="카테고리 선택"
                  fullWidth
                  size="small"
                  inputRef={prodCategoryRef}
                  sx={inputStyle}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={tableHeadStyle}>
                <InputLabel for="prodShipping">배송비</InputLabel>
              </TableCell>
              <TableCell sx={tableBodyStyle}>
                <TextField
                  id="prodShipping"
                  fullWidth
                  size="small"
                  inputRef={prodShippingRef}
                  sx={inputStyle}
                  label="숫자만 입력"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">&#8361;</InputAdornment>
                    ),
                  }}
                ></TextField>
              </TableCell>
              <TableCell sx={tableHeadStyle}>
                <InputLabel for="prodName">상품명</InputLabel>
              </TableCell>
              <TableCell sx={tableBodyStyle}>
                <TextField
                  id="prodName"
                  fullWidth
                  size="small"
                  inputRef={prodNameRef}
                  sx={inputStyle}
                ></TextField>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={tableHeadStyle}>
                <InputLabel>상품 사진</InputLabel>
                {/* 파일선택 버튼: label로 연결, 실제 input은 숨김 */}
                <InputLabel
                  id="btnUploadImage"
                  for="prodPicture"
                  sx={btnUploadImageStyle}
                >
                  파일선택
                </InputLabel>
                <Input
                  id="prodPicture"
                  inputRef={prodPictureRef}
                  type="file"
                  accept="image/*"
                  inputProps={{ multiple: true }}
                  sx={{ display: 'none' }}
                ></Input>
              </TableCell>
              <TableCell sx={tableBodyStyle}>
                <SimpleImageSlider
                  width={220}
                  height={220}
                  images={images}
                  showBullets={true}
                  showNavs={true}
                  navSize={15}
                  navMargin={10}
                />
              </TableCell>
              <TableCell sx={tableHeadStyle}>
                <InputLabel for="prodContent">상품 설명</InputLabel>
              </TableCell>
              <TableCell sx={tableBodyStyle}>
                <TextField
                  id="prodContent"
                  fullWidth
                  size="small"
                  inputRef={prodContentRef}
                  sx={inputStyle}
                  multiline
                  inputProps={{ style: { height: '200px' } }}
                ></TextField>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={tableHeadStyle}>
                <InputLabel for="prodHost">대여자(닉네임)</InputLabel>
              </TableCell>
              <TableCell sx={tableBodyStyle}>
                <TextField
                  id="prodHost"
                  fullWidth
                  size="small"
                  inputRef={prodHostRef}
                  sx={inputStyle}
                ></TextField>
              </TableCell>
              <TableCell sx={tableHeadStyle}>
                <InputLabel for="prodTag">연관검색어</InputLabel>
              </TableCell>
              <TableCell sx={tableBodyStyle}>
                <TextField
                  id="prodTag"
                  fullWidth
                  size="small"
                  inputRef={prodTagRef}
                  sx={inputStyle}
                  multiline
                ></TextField>
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>

        {/* 하단 버튼 */}
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          mt={5}
        >
          <Button
            type="submit"
            onClick={handleSubmit}
            variant="outlined"
            mr={3}
            sx={btnSubmitStyle}
          >
            등록
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button variant="outlined" onClick={handleGoBack} sx={btnCancelStyle}>
            취소
          </Button>
        </Box>
      </Box>
      {/* form 끝 */}
    </Container>
  );
};

export default AdminProductsCreate;
