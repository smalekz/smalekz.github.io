// script.js
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Script has started. Attempting to load blog posts dynamically and apply Masonry layout.");

    const postsGrid = document.querySelector('.posts-grid');
    const loadMoreButton = document.getElementById('loadMorePosts');
    const postsPerPage = 6; // تعداد پست‌هایی که با هر بار بارگذاری نمایش داده می‌شوند
    let currentPostIndex = 0; // نگه داشتن وضعیت ایندکس پست فعلی

    if (!postsGrid) {
        console.error("Error: '.posts-grid' element not found in the DOM. Ensure index.html has <div class=\"posts-grid\">.");
        return;
    }

    // Define the list of all available post HTML files
    const allPostFiles = [
        'posts/post1.html',
        'posts/post2.html',
        'posts/post1.html', // Reusing for example posts to show varied heights
        'posts/post2.html', // Reusing for example posts
        'posts/post1.html',
        'posts/post2.html',
        'posts/post1.html',
        'posts/post2.html',
        'posts/post1.html',
        'posts/post2.html',
        'posts/post1.html',
        'posts/post2.html',
        'posts/post1.html',
        'posts/post2.html',
        // می توانید اینجا فایل‌های HTML پست‌های بیشتری اضافه کنید تا دکمه load more کار کند.
    ];

    /**
     * Fetches an HTML file, parses it, and extracts specific elements.
     * @param {string} url The URL of the HTML file to fetch.
     * @returns {Promise<Object|null>} An object containing extracted data (title, excerpt, imageUrl) or null on error.
     */
    async function fetchAndParsePost(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to fetch post from ${url}. Status: ${response.status} ${response.statusText}. This might be a CORS issue if running locally without a server.`);
                return null;
            }
            const htmlText = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            const titleElement = doc.querySelector('.full-post-title');
            const excerptElement = doc.querySelector('.full-post-excerpt');
            const imageElement = doc.querySelector('.full-post-image'); // اضافه شدن: انتخابگر تصویر

            const title = titleElement ? titleElement.textContent : 'عنوان نامشخص (یافت نشد)';
            const excerpt = excerptElement ? excerptElement.textContent : 'خلاصه محتوا در دسترس نیست (یافت نشد).';
            const imageUrl = imageElement ? imageElement.src : 'https://placehold.co/300x200/cccccc/000000?text=تصویر+پست'; // اضافه شدن: آدرس تصویر یا تصویر پیش‌فرض

            if (!titleElement) console.warn(`Warning: '.full-post-title' not found in ${url}`);
            if (!excerptElement) console.warn(`Warning: '.full-post-excerpt' not found in ${url}`);
            if (!imageElement) console.warn(`Warning: '.full-post-image' not found in ${url}, using placeholder.`);

            return { title, excerpt, imageUrl }; // اضافه شدن: imageUrl

        } catch (error) {
            console.error(`Error processing post ${url}:`, error);
            return null;
        }
    }

    /**
     * Creates a post card HTML element.
     * @param {Object} postData The data for the post (title, excerpt, imageUrl).
     * @param {string} postUrl The URL to the full post HTML file.
     * @returns {HTMLElement} The created article element.
     */
    function createPostCard(postData, postUrl) {
        const article = document.createElement('article');
        article.classList.add('post-card');

        // حذف دکمه "ادامه مطلب" و افزودن event listener به کل کارت
        article.innerHTML = `
            <div class="post-header-content">
                <h2 class="post-title">${postData.title}</h2>
            </div>
            <img src="${postData.imageUrl}" alt="تصویر پست" class="post-card-image">
            <div class="post-body-content">
                <p class="post-excerpt">${postData.excerpt}</p>
            </div>
        `;

        // افزودن event listener به کل کارت پست برای ناوبری به صفحه کامل پست
        article.addEventListener('click', () => {
            window.location.href = postUrl;
        });

        return article;
    }

    // Function to calculate columns based on screen width
    function getColumnCount() {
        if (window.innerWidth < 768) {
            return 1; // Mobile
        } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
            return 2; // Tablet
        } else {
            return 3; // Laptop (3 columns)
        }
    }

    // Masonry layout function
    let isLayoutScheduled = false;
    function applyMasonryLayout() {
        if (isLayoutScheduled) return;
        isLayoutScheduled = true;

        requestAnimationFrame(() => {
            const cards = Array.from(postsGrid.children);
            if (cards.length === 0) {
                isLayoutScheduled = false;
                return;
            }

            const columnCount = getColumnCount();
            const gridWidth = postsGrid.clientWidth;
            const columnGap = 24; // 1.5rem = 24px (assuming 1rem = 16px)
            const cardWidth = (gridWidth - (columnCount - 1) * columnGap) / columnCount;

            // Initialize column heights array
            const columnHeights = Array(columnCount).fill(0);
            const columnLefts = [];
            for (let i = 0; i < columnCount; i++) {
                columnLefts[i] = i * (cardWidth + columnGap);
            }

            // Apply positions to each card
            cards.forEach((card, index) => {
                // Set initial width for calculation
                card.style.width = `${cardWidth}px`;
                // Get the index of the shortest column
                const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

                card.style.position = 'absolute';
                card.style.left = `${columnLefts[shortestColumnIndex]}px`;
                card.style.top = `${columnHeights[shortestColumnIndex]}px`;

                // Update the height of the shortest column
                columnHeights[shortestColumnIndex] += card.offsetHeight + columnGap;
            });

            // Set the overall height of the grid container
            postsGrid.style.height = `${Math.max(...columnHeights) - columnGap}px`; // Subtract last gap

            console.log(`Masonry layout applied for ${columnCount} columns. Grid height: ${postsGrid.style.height}`);
            isLayoutScheduled = false;
        });
    }

    /**
     * Loads a batch of posts and appends them to the grid.
     * @param {number} startIndex The starting index in the allPostFiles array.
     * @param {number} count The number of posts to load.
     */
    async function loadPosts(startIndex, count) {
        const endIndex = Math.min(startIndex + count, allPostFiles.length);
        const postsToLoad = allPostFiles.slice(startIndex, endIndex);

        for (const postUrl of postsToLoad) {
            const postData = await fetchAndParsePost(postUrl);
            if (postData) {
                const postCard = createPostCard(postData, postUrl);
                postsGrid.appendChild(postCard);
            } else {
                console.warn(`Skipping post card creation for ${postUrl} due to fetching/parsing error.`);
            }
        }

        currentPostIndex = endIndex;

        // اگر پستی برای بارگذاری بیشتر وجود ندارد، دکمه را مخفی کنید
        if (currentPostIndex >= allPostFiles.length) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block'; // مطمئن شوید دکمه نمایش داده می‌شود
        }
        setTimeout(applyMasonryLayout, 100); // اعمال Masonry پس از افزودن پست‌ها
    }

    // بارگذاری اولیه ۶ پست
    await loadPosts(0, postsPerPage);

    // اضافه کردن event listener به دکمه "بارگذاری بیشتر"
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', async () => {
            loadMoreButton.disabled = true; // دکمه را غیرفعال کنید تا از کلیک‌های متعدد جلوگیری شود
            loadMoreButton.textContent = 'در حال بارگذاری...'; // تغییر متن دکمه
            await loadPosts(currentPostIndex, postsPerPage); // بارگذاری ۶ پست بعدی
            loadMoreButton.textContent = 'بارگذاری پست‌های بیشتر'; // بازگرداندن متن دکمه
            loadMoreButton.disabled = false; // دکمه را فعال کنید
        });
    }


    // Re-apply layout on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(applyMasonryLayout, 200); // Debounce resize for performance
    });


    // --- Mobile menu toggle logic ---
    const navLeftHamburger = document.getElementById('navLeftHamburger');
    const navLeftMenu = document.getElementById('navLeftMenu');
    const socialHamburger = document.getElementById('socialHamburger');
    const socialMenu = document.getElementById('socialMenu');

    if (navLeftHamburger && navLeftMenu) {
        navLeftHamburger.addEventListener('click', () => {
            navLeftMenu.classList.toggle('menu-active');
            // بستن منوی دیگر در صورت باز بودن
            if (socialMenu && socialMenu.classList.contains('menu-active')) {
                socialMenu.classList.remove('menu-active');
            }
        });
    }

    if (socialHamburger && socialMenu) {
        socialHamburger.addEventListener('click', () => {
            socialMenu.classList.toggle('menu-active');
            // بستن منوی دیگر در صورت باز بودن
            if (navLeftMenu && navLeftMenu.classList.contains('menu-active')) {
                navLeftMenu.classList.remove('menu-active');
            }
        });
    }

    // بستن منوها هنگام تغییر اندازه صفحه به حالت دسکتاپ/تبلت
    let currentColumnCount = getColumnCount(); // ستون‌های فعلی برای تشخیص تغییر breakpoint
    window.addEventListener('resize', () => {
        const newColumnCount = getColumnCount();
        if (newColumnCount !== currentColumnCount) {
            // اگر از موبایل به تبلت/دسکتاپ تغییر کردیم و منوها باز هستند، آن‌ها را ببندیم
            if (newColumnCount >= 2) { // 2 ستون به بالا یعنی تبلت یا دسکتاپ
                if (navLeftMenu && navLeftMenu.classList.contains('menu-active')) {
                    navLeftMenu.classList.remove('menu-active');
                }
                if (socialMenu && socialMenu.classList.contains('menu-active')) {
                    socialMenu.classList.remove('menu-active');
                }
            }
            currentColumnCount = newColumnCount;
        }
    });

    console.log("Mobile menu toggle logic attached.");
});