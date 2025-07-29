const API_BASE_URL = "https://jsonplaceholder.typicode.com";

const postListContainer = document.querySelector("#postListContainer");
const postDetailContainer = document.querySelector("#postDetailContainer");

const postList = document.querySelector("#postList");

const detailTitle = document.querySelector("#detailTitle");
const postId = document.querySelector("#postId");
const userId = document.querySelector("#userId");
const detailContent = document.querySelector("#detailContent");
const backBtn = document.querySelector("#backBtn");

// 게시물 페이지 변환 함수

// 게시물 요청 함수(비동기)
async function getPosts() {
  // async - await, try-catch
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);

    // 응답이 ok가 아닐 경우
    if (!response.ok) {
      throw new Error("문제 발생");
    }

    // 요청 성공, 마찬가지로 요청이 와야 실행되어야 하므로 await
    const posts = await response.json();

    // 화면 렌더링 위해서 postList안을 초기화
    // posts를 순회해서 li태그 생성해서 postList 안에 넣어주기
    postList.innerHTML = "";

    if (posts) {
      // 게시물이 존재할 경우
      posts.forEach((post) => {
        // post 객체 -> userId, id, title, body
        // 상세 게시물 페이지 위해서 postId 넣어주기, 제목을 클릭하든, 버튼을 클릭하든 ㄱㄱ
        postList.innerHTML += `<li>
                <span class="post-title data-post-id=${post.id}">${post.title}</span>
                <button class="detail-btn data-post-id=${post.id}">상세보기</button>
            </li>`;

        // const li = document.createElement("li");
        // li.dataset.postId = post.id;
        // li.innerHTML = `<span class="post-title">${post.title}</span>
        //                     <button class="detail-btn">상세보기</button>`;
        // postList.appendChild(li);
      });
    } else {
      // 게시물이 존재하지 않을 경우
      postList.innerHTML = '<p class="loading-message>게시물이 없습니다.</p>';
    }
  } catch (error) {
    postList.innerHTML =
      '<p class="loading-message>게시물 목록을 불러오는데 실패했습니다.</p>';
  }
}

getPosts();
