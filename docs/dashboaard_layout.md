برومت لوحة تحكم (Dashboard) — Sidebar + Header + أدوات كاملة

صمّم لوحة تحكم عربية (RTL) عصرية، متجاوبة (mobile-first → desktop)، بخطوط عربية واضحة (Tajawal / Cairo)، ألوان حديثة (accent أزرق بنفسجي #6366F1)، زوايا ناعمة (12px)، ظلال خفيفة، ودعم Light/Dark mode.

🔹 الهيكل العام:

سايدبار (Sidebar):

عرض ثابت (250px desktop، 80px collapsed، overlay في الموبايل).

عناصر تنقل (Navigation Items) مع أيقونات (Home, Users, Reports, Settings…).

شعار أعلى القائمة + زر طي/فتح (collapse/expand).

دعم حالات: active (لون مميز)، hover (تظليل خفيف)، disabled.

إمكانية إضافة Submenus (عند الضغط تنفتح قائمة فرعية).

زر "تسجيل خروج" بأسفل القائمة.

الهيدر (Header / Topbar):

ارتفاع ~64px، ثابت أعلى الشاشة.

مكونات: أيقونة قائمة (لإظهار/إخفاء السايدبار في الموبايل)، اسم الصفحة الحالي، مربع بحث، إشعارات (bell icon + badge بعدد)، صندوق رسائل، قائمة المستخدم (صورة شخصية + اسم + dropdown).

دعم Dark/Light toggle بأيقونة قمر/شمس.

🔹 الأدوات المضمنة في اللوحة:

Cards إحصائيات (Analytics Cards):

4 كروت صغيرة بأيقونة + عنوان + رقم + نسبة تغير (↑↓).

لون أخضر للزيادة، أحمر للنقصان.

جداول (Tables):

جدول بيانات مستخدمين / طلبات مع: صورة مصغرة، اسم، بريد، حالة (badge ملون)، تاريخ، وأزرار (edit/delete).

دعم: بحث، فلترة، فرز، تحديد متعدد، ترقيم الصفحات (pagination).

Charts (رسوم بيانية):

شريط (Bar chart)، خطي (Line chart)، دائري (Pie/Donut chart).

لعرض الإحصاءات (مبيعات، زيارات، مستخدمين نشطين).

Forms (نماذج):

نموذج إضافة/تعديل (بداخل modal أو صفحة منفصلة).

الحقول: نص، بريد، select، رفع ملف، switch، textarea.

Notifications / Toasts:

إشعارات صغيرة تظهر أعلى يمين الشاشة عند الحفظ أو الخطأ.

Widgets إضافية:

Timeline (سجل النشاطات).

Kanban board (لوحة مهام).

Calendar (تقويم الأحداث).

🔹 أسلوب التصميم (UI/UX):

responsive grid layout (CSS Grid/Flex).

transitions ناعمة (150–200ms).

skeleton loaders عند تحميل البيانات.

empty states برسائل ودية + أيقونة توضيحية.

🔹 الوصولية (a11y):

أزرار السايدبار بعناوين واضحة + aria-label.

ألوان ذات contrast ≥ 4.5:1.

إمكانية التنقل بالكيبورد (Tab + Enter).

🔹 تسليمات التصميم:

ملف Figma مرتب (components + variants).

design tokens (colors, spacing, typography).

دليل استخدام (style guide).

نسخة Light و Dark.