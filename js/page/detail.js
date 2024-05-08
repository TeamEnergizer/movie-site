import {getMovieDetail} from '../api.js';
import getUrlParamValue from "../utils/getUrlParamValue.js";

const movieId = getUrlParamValue('movieId');

getMovieDetail(movieId).then((response) => {
  // 영화 제목 설정
  const titleElement = document.querySelector('.logo-box');
  const tabName = document.querySelector('title');
  titleElement.textContent = response.title;
  tabName.textContent = `${response.title} : ${tabName.textContent}`;

  // 장르 정보 설정
  const genreContainer = document.querySelector('.dot-item');
  response.genres.forEach((genre, index) => {
    const genreElement = document.createElement('span');
    genreElement.textContent = genre.name;
    genreContainer.appendChild(genreElement);
    if (index < response.genres.length - 1) {
      const space = document.createTextNode(' ');
      genreContainer.appendChild(space);
    }
  });

  // 이미지 설정
  const imageBox = document.querySelector('.video-detail .image-box img');
  const thumbImg = document.querySelector('.thumb-img');
  if (response.poster_path) {
    imageBox.src = `https://image.tmdb.org/t/p/original${response.backdrop_path}`;
    thumbImg.src = `https://image.tmdb.org/t/p/original${response.poster_path}`;
  }

  // 개요 설정
  const TaglineElement = document.querySelector('.detail-info-box .content-clamp .text');
  TaglineElement.textContent = response.overview;

  // preview-title 설정
  const previewTitleElement = document.querySelector('.preview-title');
  previewTitleElement.textContent = response.title;

  // preview-dsc 설정
  const previewDscElement = document.querySelector('.preview-dsc');
  previewDscElement.textContent = response.overview;

  // detail-dsc 설정
  const detailDscElement = document.querySelector('.detail-dsc');
  detailDscElement.textContent = response.overview;

  // Production Companies 설정
  const productionCompaniesElement = document.querySelector('.detail-info-table tbody tr:nth-child(1) td');
  productionCompaniesElement.textContent = response.production_companies.map(company => company.name).join(', ');

  // 장르 정보 설정
  const genres = response.genres.map(genre => genre.name).join(' ');
  const genreRow = document.querySelector('.detail-info-table tbody tr:nth-child(2) td');
  genreRow.innerHTML = `<a class="genre">${genres}</a>`;
});
//////////영화 인물 감독 ////////////
//1.인물 api. 상단4명만 출력할것

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNDQ1MzFmMGRkOGY3NmY2NDE2NWEwNzU4MDQ1M2QzOSIsInN1YiI6IjY2MmIyMzQ5NzY0ODQxMDExZDJjMzFkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.bNR43UvxNhyv-aUuh3xtx44tXz-IjayN-QrgO-ATUMA'
  }
};

fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, options)
  .then(response => response.json())
  .then(response => {
    // API에서 가져온 출연진 정보
    const actors = response.cast.slice(0, 4); // 배열의 처음 4개 요소만 선택

    // preview-dsc에 있는 요소를 찾아서 출연진 정보를 추가합니다.
    const actorListElement = document.querySelector('.content-actor-list');
    const actorElement = document.createElement('span');
    actorElement.classList.add('content-actor-list');
    actorElement.textContent = actors.map((actor) => actor.name).join(', ');
    actorListElement.appendChild(actorElement);

    // 출연진 정보를 detail-info-table에 추가합니다.
    const genreRow = document.querySelector('.detail-info-table tbody tr:nth-child(3) td');
    const genreRowElement = document.createElement('span');
    genreRowElement.classList.add('genre');
    genreRowElement.textContent = actors.map((actor) => actor.name).join(', ');
    genreRow.appendChild(genreRowElement);
  })
  .catch(err => console.error(err))
  .finally(() => removeLoadingOverlay());


//더보기 스크롤 밑으로 내리기 함수

const moreLink = document.querySelector('.more');

moreLink.addEventListener('click', function() {
  // 스크롤을 제일 아래로 내립니다.
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth' // 스무스한 스크롤 효과 적용
  });
});

// 클립보드
const shareButton = document.querySelector('.icon-item button');
shareButton.addEventListener('click', function() {
  // 현재 페이지의 URL을 가져옵니다.
  const url = window.location.href;
  // 클립보드에 URL을 복사합니다.
  navigator.clipboard.writeText(url)
    .then(() => {
      // 복사가 성공했을 때 알림을 표시합니다.
      alert('주소가 복사되었어요');
    })
    .catch(err => {
      // 복사가 실패했을 때 에러를 콘솔에 출력합니다.
      console.error('주소 복사 실패:', err);
    });
});


const removeLoadingOverlay = () => {
  const loadingOverlay = document.querySelector('#loaderWrap');

  const hideOverlay = setTimeout(() => {
    loadingOverlay.style.display = 'none';

    clearTimeout(hideOverlay);
  }, 1000);
}