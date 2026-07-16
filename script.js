// مصفوفة حفظ العناصر، تقرأ تلقائياً من ذاكرة الهاتف الداخلية (LocalStorage)
let items = JSON.parse(localStorage.getItem('spotly_database')) || [];

// دالة لعرض وتحديث العناصر في الشاشة
function displayItems(filteredItems = items) {
    const listContainer = document.getElementById('itemList');
    listContainer.innerHTML = '';

    if (filteredItems.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; color: rgba(255,255,255,0.4); padding-top: 30px;">
                لا توجد عناصر محفوظة حالياً.
            </div>
        `;
        document.getElementById('totalCount').innerText = "0 عناصر";
        document.getElementById('favItem').innerText = "لا يوجد";
        return;
    }

    filteredItems.forEach((item, index) => {
        listContainer.innerHTML += `
            <div class="item-row">
                <div class="item-info">
                    <span class="item-title">${item.category || '📦'} ${item.name}</span>
                    <span class="item-loc">📍 ${item.location}</span>
                </div>
                <button class="delete-btn" onclick="deleteItem(${index})">وجدتُه</button>
            </div>
        `;
    });

    // تحديث بطاقة الإحصائيات
    document.getElementById('totalCount').innerText = `${items.length} عناصر`;
    
    // تحديث المفضلة بآخر عنصر تم إضافته تلقائياً
    if (items.length > 0) {
        document.getElementById('favItem').innerText = items[items.length - 1].name;
    } else {
        document.getElementById('favItem').innerText = "لا يوجد";
    }
}

// دالة لإضافة عنصر جديد للذاكرة
function addItem() {
    const nameInput = document.getElementById('itemName');
    const locationInput = document.getElementById('itemLocation');
    const categoryInput = document.querySelector('input[name="itemCategory"]:checked');

    const name = nameInput.value.trim();
    const location = locationInput.value.trim();
    const category = categoryInput ? categoryInput.value : "📦 أخرى";

    if (name && location) {
        // إضافة العنصر الجديد للمصفوفة مع التصنيف المختار
        items.push({ name, location, category });
        
        // الحفظ في ذاكرة الهاتف
        localStorage.setItem('spotly_database', JSON.stringify(items));
        
        // تحديث الشاشة وتفريغ الحقول
        displayItems();
        nameInput.value = '';
        locationInput.value = '';
        
        // تأثير اهتزاز خفيف للهواتف عند نجاح الإضافة (إذا كان مدعوماً)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    } else {
        alert('الرجاء إدخال اسم الشيء ومكانه أولاً لحفظه!');
    }
}

// دالة لحذف عنصر محدد
function deleteItem(index) {
    items.splice(index, 1);
    localStorage.setItem('spotly_database', JSON.stringify(items));
    displayItems();
}

// دالة لمسح كافة العناصر
function clearAll() {
    if (confirm("هل تريد بالتأكيد حذف جميع العناصر المحفوظة في التطبيق؟")) {
        items = [];
        localStorage.removeItem('spotly_database');
        displayItems();
    }
}

// دالة البحث الفوري أثناء الكتابة
function searchItems() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.location.toLowerCase().includes(query)
    );
    displayItems(filtered);
}

// دالة فتح وإغلاق النوافذ المنبثقة (Modals)
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('active');
    }
}

// دالة صعود القائمة للأعلى عند الضغط على زر الرئيسية
function scrollToTop() {
    const container = document.getElementById('itemList');
    container.scrollTo({ top: 0, behavior: 'smooth' });
}

// تشغيل العرض الأولي عند فتح التطبيق لأول مرة
displayItems();
