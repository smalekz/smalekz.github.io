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
        'posts/post3.html', // Reusing for example posts to show varied heights
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
            window.open(postUrl, '_blank');
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

function h1 (){
    document.write(`    
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="/blog/style.css">
        
            <script type="text/javascript" >
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        
                ym(98515727, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true,
                    ecommerce:"dataLayer"
                });
            </script>
            <noscript><div><img src="https://mc.yandex.ru/watch/98515727" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-4X6CSC6XN9"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
        
                gtag('config', 'G-4X6CSC6XN9');
            </script>
            <title></title>
            <link rel="icon" type="image/x-icon" href="data:image/webp;base64,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">
        
        `);
}

function h2 (){
    document.write(`

        <header class="header">
            <div class="menu-left-wrapper">
                <button class="hamburger-icon nav-hamburger-toggle" id="navLeftHamburger" aria-label="Toggle navigation menu">☰</button>
                <nav class="nav-left" id="navLeftMenu">
                    <ul>
                        <li><a href="../" class="active-menu-item">وبلاگ</a></li>
                        <li><a href="/ctfa.html">درباره ما</a></li>
                    </ul>
                </nav>
            </div>
            <h1 class="site-title">وبلاگ</h1>
            <div class="menu-right-wrapper">
                <button class="hamburger-icon social-hamburger-toggle" id="socialHamburger" aria-label="Toggle social links">...</button>
                <div class="social-icons" id="socialMenu">
                    <a href="https://wa.me/message/UKIMKRK2KHXNP1" target="_blank" aria-label="واتس اپ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"></path>
                          </svg>
                      </a>
                      <a href="tel:+989142232172" target="_blank" aria-label="واتس اپ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"></path>
                          </svg>
                      </a>
                </div>
            </div>
        </header>
    
    `);
}