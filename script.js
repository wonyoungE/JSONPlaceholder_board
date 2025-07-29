const API_BASE_URL = "https://jsonplaceholder.typicode.com";

const postListContainer = document.querySelector("#postListContainer");
const postDetailContainer = document.querySelector("#postDetailContainer");

const postList = document.querySelector("#postList");
const commentList = document.querySelector("#commentList");

const detailTitle = document.querySelector("#detailTitle");
const detailPostId = document.querySelector("#detailPostId");
const detailUserId = document.querySelector("#detailUserId");
const detailBody = document.querySelector("#detailBody");
const backBtn = document.querySelector("#backBtn");

const emojiList = ["🐱", "🐶", "🦊", "🐻", "🐸", "🐼", "🦁", "🐧", "🐵", "🐯"];

// 게시물 페이지 변환 함수
// 게시물 목록 페이지 <-> 게시물 상세 페이지 변환하는 함수
// 같이쓸 거기 때문에 둘 다 초기화한 후 매개변수로 받은 containerId의 요소에
// active 요소 추가
function changePage(containerId) {
  const containers = document.querySelectorAll(".page-container");
  containers.forEach((container) => {
    container.classList.remove("active");
  });
  document.querySelector(`#${containerId}`).classList.add("active");
}

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
                <span class="post-title" data-post-id="${post.id}">${post.title}</span>
                <button class="detail-btn" data-post-id="${post.id}">상세보기</button>
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

// 게시물 상세 페이지
async function getPostDetail(postId) {
  // 페이지 변환
  changePage("postDetailContainer");
  // 서버 요청 중에 보일 텍스트
  detailTitle.textContent = "제목 불러오는중...";
  detailPostId.textContent = "";
  detailUserId.textContent = "";
  detailBody.textContent = "내용 불러오는중...";

  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);

    if (!response.ok) {
      throw new Error("문제 발생!!");
    }

    const post = await response.json();
    detailTitle.textContent = post.title;
    detailPostId.textContent = post.id;
    detailUserId.textContent = post.userId;
    detailBody.textContent = post.body;

    // 댓글 요청 함수 호출
    getComments(postId);
  } catch (error) {
    alert("게시물 상세를 불러오는데 실패했습니다.");
    changePage("postListContainer"); // 목록 페이지로 변환
  }
}

// 게시물 댓글 요청 함수
async function getComments(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);

    if (!response.ok) {
      throw new Error("에러 발생!");
    }

    const comments = await response.json();
    commentList.innerHTML = "";

    // 댓글 개수도 하고 싶음!
    if (comments) {
      // comment 객체 -> postId, id, name, email, body
      commentList.innerHTML = `<p class="commentCnt">💬 댓글 <strong>${comments.length}</strong>개</p>`;
      comments.forEach((comment) => {
        const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        commentList.innerHTML += `<li>
                        <p class="commentUserId">댓글 작성자ID: <strong>${comment.id}</strong></p>
                        <p class="commentBody">${emoji} ${comment.body}</p>
                    </li>`;
      });
    } else {
      commentList.innerHTML = '<p class="commentCnt">💬 댓글 0개</p>';
    }
  } catch (error) {
    console.log("댓글 목록을 가져오는데 실패했습니다.");
  }
}

getPosts();

// ul(postList)에 이벤트가 발생하면
// 해당 event의 target의 id 가져와서 페이지 전환
postList.addEventListener("click", (event) => {
  // event: 브라우저가 자동으로 넘겨주는 이벤트 객체
  const target = event.target;
  // 만약 이벤트가 발생한 요소가 제목이거나 버튼이면
  if (
    target.classList.contains("post-title") ||
    target.classList.contains("detail-btn")
  ) {
    // 게시물 아이디 갖고 있음
    const postId = target.dataset.postId;
    // 그 아이디로 게시물 조회
    if (postId) {
      getPostDetail(postId);
    }
  }
});
