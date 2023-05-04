import {
  Box,
  Container,
  Grid,
  NativeSelect,
  Typography,
  Button,
  InputLabel,
  Pagination,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AdminFAQRows from '../../components/admin-faq/AdminFAQLists/AdminFAQRows';

const AdminFAQLists = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // URL 쿼리 스트링 가져오기
  const navigate = useNavigate(); // 페이지 이동
  const [faqList, setFaqList] = useState([]); // FAQ 목록
  const [totalPage, setTotalPage] = useState(); // 총 페이지 수
  const [currentPage, setCurrentPage] = useState(searchParams.get('pages')); // 현재 페이지
  const [currentFilter, setCurrentFilter] = useState(
    searchParams.get('filter')
  ); // 현재 필터
  const sortRef = useRef(); // 현재 정렬 기준
  const conditionRef = useRef(); // 현재 검색 조건
  const keywordRef = useRef(); // 현재 검색 키워드

  // 페이지 접근 시 FAQ 목록 가져오기
  useEffect(() => {
    // 검색 조건이 없을 때
    if (searchParams.get('keyword') === null) {
      // 다중 요청(페이지네이션을 위한 전체 FAQ 수 요청, FAQ 목록 요청)
      axios
        .all([
          axios.get(`/m/faqs/count?filter=${searchParams.get('filter')}`),
          axios.get(
            `/m/faqs?sort=${searchParams.get('sort')}&filter=${searchParams.get(
              'filter'
            )}&pages=${searchParams.get('pages')}`
          ),
        ])
        .then(
          axios.spread((count, list) => {
            setTotalPage(Math.ceil(count.data / 10)); // 전체 페이지 수 설정
            setFaqList(list.data); // FAQ 목록 설정
            setCurrentPage(searchParams.get('pages')); // 현재 페이지 설정
            setCurrentFilter(searchParams.get('filter')); // 현재 필터 설정
            sortRef.current.value = searchParams.get('sort'); // 현재 정렬 기준 설정
            conditionRef.current.value = 'faqTitle+faqContent'; // 현재 검색 조건 기본값 설정
            keywordRef.current.value = ''; // 현재 검색 키워드 기본값 설정
          })
        )
        .catch((err) => {
          console.error(err);
        });
    }
    // 검색 조건이 있을 때
    else {
      axios
        .all([
          axios.get(
            `/m/faqs/count?keyword=${searchParams.get(
              'keyword'
            )}&filter=${searchParams.get('filter')}`
          ),
          axios.get(
            `/m/faqs?keyword=${searchParams.get(
              'keyword'
            )}&sort=${searchParams.get('sort')}&filter=${searchParams.get(
              'filter'
            )}&pages=${searchParams.get('pages')}`
          ),
        ])
        .then(
          axios.spread((count, list) => {
            setTotalPage(Math.ceil(count.data / 10));
            setFaqList(list.data);
            setCurrentPage(searchParams.get('pages'));
            setCurrentFilter(searchParams.get('filter'));
            sortRef.current.value = searchParams.get('sort');
            conditionRef.current.value = 'faqTitle+faqContent';
            keywordRef.current.value = searchParams.get('keyword');
          })
        )
        .catch((err) => {
          console.error(err);
        });
    }
  }, [searchParams]);

  // 페이지네이션 클릭 시
  const pageChange = (e, value) => {
    searchParams.set('pages', value);
    setSearchParams(searchParams);
  };

  // 검색 버튼 클릭 시
  const search = () => {
    const sort = sortRef.current.value;
    const keyword = keywordRef.current.value;
    if (keyword === '') {
      navigate(`/m/faqs/lists?sort=${sort}&filter=${currentFilter}&pages=1`);
    } else {
      navigate(
        `/m/faqs/lists?keyword=${keyword}&sort=${sort}&filter=${currentFilter}&pages=1`
      );
    }
  };

  // 정렬 기준 변경 시
  const sortChange = () => {
    const sort = sortRef.current.value;
    searchParams.set('sort', sort);
    setSearchParams(searchParams);
  };

  // 필터 변경 시
  const filterChange = (e, value) => {
    if (value !== null) {
      searchParams.set('filter', value);
      setSearchParams(searchParams);
      setCurrentFilter(value);
    }
  };

  const filterBox = {
    height: '30px',
    backgroundColor: '#ffffff',
    color: '#828282',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    transition: 'all 0.25s',
    '&:hover': {
      backgroundColor: '#c3c36a',
      color: '#ffffff',
    },
    '&.Mui-selected': {
      backgroundColor: '#c3c36a',
      textDecoration: 'underline',
    },
    '&.Mui-selected:hover': {
      backgroundColor: '#c3c36a',
      textDecoration: 'underline',
      color: '#ffffff',
    },
  };

  const tableHead = {
    fontWeight: 'bold',
    textAlign: 'center',
    px: 1,
    py: 0.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <Container>
      {/* FAQ 목록 글씨 표기 시작 */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mt: 5,
          mb: 1,
          pl: 1,
          pr: 1,
          fontWeight: 'bold',
          userSelect: 'none',
        }}
      >
        FAQ 목록
      </Typography>
      {/* FAQ 목록 글씨 표기 끝 */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
      >
        {/* 필터 선택용 Toggle Button 표기 시작 */}
        <Box sx={{ float: 'right', pr: 3, mb: 1 }}>
          <ToggleButtonGroup
            value={String(currentFilter)}
            exclusive
            onChange={filterChange}
            aria-label="faq-filter"
          >
            <ToggleButton value="none" aria-label="all" sx={filterBox}>
              전체
            </ToggleButton>
            <ToggleButton value="product" aria-label="product" sx={filterBox}>
              상품 문의
            </ToggleButton>
            <ToggleButton
              value="login-about"
              aria-label="login-about"
              sx={filterBox}
            >
              로그인/정보
            </ToggleButton>
            <ToggleButton
              value="sell-consign"
              aria-label="sell-consign"
              sx={filterBox}
            >
              판매/위탁
            </ToggleButton>
            <ToggleButton value="payment" aria-label="payment" sx={filterBox}>
              결제
            </ToggleButton>
            <ToggleButton value="shipping" aria-label="shipping" sx={filterBox}>
              배송 문의
            </ToggleButton>
            <ToggleButton value="other" aria-label="other" sx={filterBox}>
              기타
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {/* 필터 선택용 Toggle Button 표기 끝 */}

        {/* 정렬 기준 선택용 Select Box 표기 시작 */}
        <Box sx={{ float: 'right', pr: 1, mb: 1 }}>
          <InputLabel
            sx={{
              fontSize: '0.8rem',
            }}
            variant="standard"
            htmlFor="adminFaqListSort"
          >
            정렬 기준
          </InputLabel>
          <NativeSelect
            inputRef={sortRef}
            onChange={sortChange}
            sx={{
              px: 1,
              hover: {
                backgroundColor: '#ffffff',
              },
              focus: {
                backgroundColor: '#fffffff',
              },
            }}
            defaultValue="-faqDate"
            inputProps={{
              name: 'sort',
              id: 'adminFaqListSort',
            }}
          >
            <option value="-faqDate">최근 작성 순</option>
            <option value="faqDate">오래된 작성 순</option>
          </NativeSelect>
        </Box>
        {/* 정렬 기준 선택용 Select Box 표기 끝 */}
      </Box>
      {/* FAQ 목록 테이블 표기 시작 */}
      <Box
        sx={{
          mt: 2,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {/* FAQ 목록 테이블 컬럼명 표기 시작 */}
        <Grid
          container
          sx={{
            px: 1,
            py: 0.5,
            borderTop: '2px solid #000000',
            borderBottom: '2px solid #000000',
          }}
        >
          <Grid item xs={2}>
            <Typography sx={tableHead}>번호</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={tableHead}>구분</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={tableHead}>FAQ 제목</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography sx={tableHead}>작성일</Typography>
          </Grid>
        </Grid>
        {/* FAQ 목록 테이블 컬럼명 표기 끝 */}

        {/* FAQ 목록 테이블 데이터 표기 시작 */}
        {faqList.length === 0 ? (
          // FAQ 데이터가 없을 경우
          <Typography
            sx={{
              mt: 4,
              mb: 2,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            FAQ 데이터가 존재하지 않습니다.
          </Typography>
        ) : (
          // FAQ 데이터가 있을 경우
          faqList.map((faq, index, row) => (
            <AdminFAQRows
              key={faq.faqCode}
              faqCode={faq.faqCode}
              faqCategory={faq.faqCategory}
              faqTitle={faq.faqTitle}
              faqDate={faq.faqDate}
              isLast={index + 1 === row.length} // 마지막 데이터인지 확인
            />
          ))
        )}
        {/* FAQ 목록 테이블 데이터 표기 끝 */}
      </Box>
      {/* FAQ 목록 테이블 표기 끝 */}

      <Button
        variant="contained"
        size="small"
        href="/m/faqs/create"
        sx={{
          mt: 1,
          mr: 1,
          height: '25px',
          float: 'right',
          backgroundColor: '#d9d9d9',
          color: '#000000',
          border: '1px solid #000000',
          '&:hover': {
            backgroundColor: '#c6c6c6',
            color: '#000000',
          },
        }}
      >
        FAQ 등록
      </Button>

      {/* 페이지네이션 표기 시작 */}
      <Box
        sx={{
          mt: 2,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Pagination
          count={Number(totalPage || 0)}
          page={Number(currentPage)}
          onChange={pageChange}
          showFirstButton
          showLastButton
        />
      </Box>
      {/* 페이지네이션 표기 끝 */}

      {/* 검색 바 표기 시작 */}
      <Box
        sx={{
          mt: 2,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <NativeSelect
          inputRef={conditionRef}
          size="normal"
          sx={{
            mx: 1,
            px: 1,
            outline: '1px solid #000000',
            hover: {
              backgroundColor: '#ffffff',
            },
            focus: {
              backgroundColor: '#fffffff',
            },
          }}
          defaultValue="faqTitle+faqContent"
          inputProps={{
            name: 'condition',
            id: 'adminFaqListCondition',
          }}
        >
          <option value="faqTitle+faqContent">제목 + 내용</option>
        </NativeSelect>
        <TextField
          inputRef={keywordRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              search();
            }
          }}
          id="adminFaqListKeyword"
          variant="outlined"
          size="small"
          sx={{
            mx: 1,
            width: '400px',
          }}
        />
        <Button
          variant="contained"
          onClick={search}
          sx={{
            mx: 1,
            width: '65px',
            backgroundColor: '#c3c36a',
            color: '#000000',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#c3c36a',
              color: '#ffffff',
            },
          }}
        >
          검색
        </Button>
      </Box>
      {/* 검색 바 표기 끝 */}
    </Container>
  );
};

export default AdminFAQLists;
