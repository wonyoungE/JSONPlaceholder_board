const API_BASE_URL = "https://jsonplaceholder.typicode.com";
let currentUserId = null;

// 내비게이션
const userNav = document.querySelector("#userNav");
const navProfile = document.querySelector("#nav-profile");
const navPost = document.querySelector("#nav-post");
const navComment = document.querySelector("#nav-comment");

// 페이지
const userProfile = document.querySelector("#userProfile");
const userPosts = document.querySelector("#userPosts");
const userComments = document.querySelector("#userComments");

// 사용자 프로필
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");
const userPhone = document.querySelector("#userPhone");
const userWebsite = document.querySelector("#userWebsite");
const userCompany = document.querySelector("#userCompany");

// 게시글 목록
const postsContainer = document.querySelector("#postsContainer");
const userPostCnt = document.querySelector("#userPostCnt");

// 댓글 목록
const commentsContainer = document.querySelector("#commentsContainer");
const userCommentCnt = document.querySelector("#userCommentCnt");

// 페이지 변환 함수, 네비게이션도 색 변경
function changePage(pageElement, navElement) {
  const pages = document.querySelectorAll(".user-page-container");
  const buttons = document.querySelectorAll("#userNav button");

  // 모든 페이지에서 active 클래스 제거
  pages.forEach((page) => {
    page.classList.remove("active");
  });
  // 매개변수로 받은 pageElement에 active 클래스 추가
  pageElement.classList.add("active");

  // 모든 버튼에서 selected 클래스 제거
  buttons.forEach((button) => {
    button.classList.remove("selected");
  });
  // 매개변수로 받은 navElement에 selected 클래스 추가
  navElement.classList.add("selected");
}

// 사용자 프로필 요청 함수
async function getUserProfile(userId) {
  try {
    console.log("불러오는중");
    // 초기화
    userName.textContent = "";
    userEmail.textContent = "";
    userPhone.textContent = "";
    userWebsite.textContent = "";
    userCompany.textContent = "";

    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error("사용자 프로필을 불러오는 중 문제가 발생했습니다.");
    }

    // 사용자 프로필을 화면에 렌더링하기
    const profile = await response.json();

    userName.innerHTML = `${profile.name}, ${profile.username}`;
    userEmail.innerHTML = `<i class="fi fi-rr-envelope"></i><span>${profile.email}</span>`;
    userPhone.innerHTML = `<i class="fi fi-rr-phone-call"></i><span>${profile.phone}</span>`;
    userWebsite.innerHTML = `<i class="fi fi-rs-home"></i><span>${profile.website}</span>`;
    userCompany.innerHTML = `<i class="fi fi-rs-building"></i><span>${profile.company.name}</span>`;
  } catch (error) {
    alert(error.message);
  }
}

// 작성 게시글 요청 함수
async function getUserPosts(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?userId=${userId}`);

    if (!response.ok) {
      throw new Error("사용자 게시글 목록을 불러오는 중 문제가 발생했습니다.");
    }

    const posts = await response.json();

    // 게시글이 존재하면
    if (posts) {
      // p태그 없애기
      postsContainer.innerHTML = "";
      userPostCnt.textContent = `${posts.length}개`;

      const ul = document.createElement("ul");
      ul.classList.add("user-list-ul", "user-post-list");
      postsContainer.appendChild(ul);

      posts.forEach((post) => {
        const li = document.createElement("li");
        li.innerHTML = `<h3 class="userPostTitle">${post.title}</h3>
                            <p class="userPostBody">${post.body}</p>`;
        ul.appendChild(li);
      });
    } else {
      postsContainer.innerHTML =
        '<p class="loading-message">작성한 게시글이 없습니다.</p>';
    }
  } catch (error) {
    alert(error.message);
  }
}

// 작성 댓글 요청 함수 => 데이터 연결 안돼있어서 실행 불가능 ㅠ
async function getUserComments(username) {
  let commentCnt = 0;
  try {
    // JSONPlaceholder에 comments?userId=${userId} 없음..
    // 그래서 내가 생각한 로직 **
    // 1. 모든 posts 요청
    // 2. posts 순회
    // 3. postId(id) 뽑아서 comments?postId=${id}로 해당 post 댓글 목록(comments) 요청
    // 4. comments 순회하면서 name이 매개변수로 받은 username과 일치하면 li dom 만들어서 ul태그에 추가
    // => 근데 JSONPlaceholder는 comment:name이랑 users:name이랑 일치하지 않음 ㅎ
    // 결론: 못함, 확인 못하는데 코드만 짜놓자..
    const postResp = await fetch(`${API_BASE_URL}/posts`);

    if (!postResp.ok) {
      throw new Error("사용자 댓글 목록을 불러오는 중 문제가 발생했습니다.");
    }

    const posts = await postResp.json();

    // foreach 내부에서 비동기 요청 가능하긴 한데.. 콜백 완료 안기다려줌
    // => for...of 반복문 사용
    for (const post of posts) {
      const commentResp = await fetch(
        `${API_BASE_URL}/comments?postId=${post.id}`
      );

      if (!commentResp.ok) {
        throw new Error("사용자 댓글 목록을 불러오는 중 문제가 발생했습니다.");
      }

      const comments = await commentResp.json();

      comments.forEach((comment) => {
        if (comment.name === username) {
          commentCnt++;
          if (commentCnt === 1) {
            // 댓글이 하나라도 존재하면
            // p태그 없애기
            commentsContainer.innerHTML = "";
            const ul = document.createElement("ul");
            ul.classList.add("user-list-ul", "user-comment-list");
            commentsContainer.appendChild(ul);
          }

          const li = document.createElement("li");
          li.innerHTML = `<h3 class="userCommentTitle">${post.title}</h3>
                         <p class="userCommentBody">${comment.body}</p>`;
          ul.appendChild(li);
        }
      });

      // 작성한 댓글이 없으면
      if (commentCnt === 0) {
        commentsContainer.innerHTML = `<p class="loading-message">작성한 댓글이 없습니다.</p>`;
      }
      userCommentCnt.innerText = `${commentCnt}개`;
    }
  } catch (error) {
    alert(error.message);
  }
}

// 사용자 프로필, 게시글, 댓글 버튼 클릭 시 요청 함수 호출
navProfile.addEventListener("click", () => {
  getUserProfile(1);
  changePage(userProfile, navProfile);
});

navPost.addEventListener("click", () => {
  getUserPosts(1);
  changePage(userPosts, navPost);
});

navComment.addEventListener("click", () => {
  getUserComments("이름없음..");
  changePage(userComments, navComment);
});
