const auth = "563492ad6f917000010000010197b45002eb42f4b2db924a016a391d";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
const zoomImage = document.querySelector(".zoom-image");
const closeZoom = document.querySelector(".close-zoom");
const prevImageBtn = document.querySelector(".prevImageBtn");
const nextImageBtn = document.querySelector(".nextImageBtn");
let imageShow;
let images;
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

searchInput.addEventListener("input", updateInput);
more.addEventListener("click", loadMore);
closeZoom.addEventListener("click", closeShow);
// prevImageBtn.addEventListener("click", prevImage);
// zoomImage.addEventListener("click", closeShow);

let index = 0;
document.body.addEventListener("click", (e) => {
    let imgSrc;
    hideImageBtn(index);
    let imagesList = gallery.querySelectorAll(".gallery-image");
    if (e.target.matches(".nextImageBtn")) {
        imgSrc = zoomImage.querySelector("img").getAttribute("src");
        // console.log(imgSrc);
        console.log(imagesList);
        index = [...imagesList].findIndex((image) => image.src === imgSrc);
        index++;
        let newImage = [...imagesList][index].getAttribute("src");
        imgShow.setAttribute("src", newImage);
        hideImageBtn(index);
    }

    if (e.target.matches(".prevImageBtn")) {
        imgSrc = zoomImage.querySelector("img").getAttribute("src");
        console.log(imagesList);
        index = [...imagesList].findIndex((image) => image.src === imgSrc);
        index--;
        let newImage = [...imagesList][index].getAttribute("src");
        imgShow.setAttribute("src", newImage);
        hideImageBtn(index);
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    currentSearch = searchValue;
    searchPhotos(searchValue);
});

async function fetchAPI(url) {
    const dataFetch = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: auth,
        },
    });
    const data = await dataFetch.json();
    return data;
}

async function curatedPhotos() {
    fetchLink = "https://api.pexels.com/v1/curated?per_page=15";
    const data = await fetchAPI(fetchLink);
    gallery.innerHTML = "";
    // console.log(data);
    generatePicture(data);
}

async function searchPhotos(query) {
    // loading();
    fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15`;
    const data = await fetchAPI(fetchLink);
    clear();
    generatePicture(data);
}

async function generatePicture(data) {
    try {
        data.photos.forEach((photo) => {
            console.log(photo);
            const galleryImg = document.createElement("div");
            galleryImg.classList.add("gallery-img");
            galleryImg.innerHTML = `
                <div class="gallery-info">
                <p>${photo.photographer}</p>
                <a href="${photo.src.original}" download>Download
                </a>
                </div>
                <img src="${photo.src.large}" class="gallery-image"></img>`;
            gallery.appendChild(galleryImg);
        });
        images = document.querySelectorAll(".gallery-image");
        images.forEach((image, ind) => {
            image.addEventListener("click", (e) => {
                // console.log(e.target.getAttribute('src'));
                index = ind;
                document.body.classList.add("lock-scroll");
                zoomImage.style.display = "flex";
                zoomImage.style.alignItem = "center";
                zoomImage.style.justifyContent = "center";
                let path = e.target.getAttribute("src");
                zoomImage.classList.add("active");
                gallery.classList.add("blur");
                imgShow = document.createElement("img");
                imgShow.setAttribute("src", path);
                imgShow.style.display = "block";
                imgShow.style.marginInline = "auto";
                zoomImage.appendChild(imgShow);
            });
        });
    } catch (error) {
        gallery.parentElement.innerHTML = `
            <h2 style="text-align: center">
                Số lượt truy cập đã hết.</br> Vui lòng quay lại sau 1 tiếng... 
            </h2>
        `;
        more.style.display = "none";
    }
}

console.log(index);
function hideImageBtn(index) {
    let imagesList = gallery.querySelectorAll(".gallery-image");
    prevImageBtn.style.display = index === 0 ? "none" : "block";
    nextImageBtn.style.display =
        index === imagesList.length - 1 ? "none" : "block";
}

function loading() {
    gallery.parentElement.innerHTML = `
    <div class="lds-ring">
        <div>
        </div>
        <div>
        </div>
        <div>
        </div>
        <div>
        </div>
    </div>
    `;
    setTimeout(() => {
        const loadingCircle = document.querySelector(".lds-ring");
        loadingCircle.parentElement.remove(loadingCircle);
    }, 500);
}

function updateInput(e) {
    searchValue = e.target.value;
}

function clear() {
    gallery.innerHTML = "";
    searchInput.value = "";
}

function closeShow() {
    if (imgShow) {
        imgShow.parentElement.removeChild(imgShow);
        zoomImage.style.display = "none";
        zoomImage.classList.remove("active");
        gallery.classList.remove("blur");
        document.body.classList.remove("lock-scroll");
    }
}

async function loadMore() {
    page++;
    if (currentSearch) {
        fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15`;
    } else {
        fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    }
    const data = await fetchAPI(fetchLink);
    generatePicture(data);
    index = gallery.querySelectorAll('gallery-image').length;
    console.log(index);;
}

curatedPhotos();
