<h1>BACKEND</h1> <br>
<h3>** Đây là phiên bản Laravel 9 **</h3> <br>
<b>Đối với Laravel thì cần thực hiện những việc sau trước khi chạy dự án:</b><br>
<b>CHÚ Ý: Nếu đã cài đặt composer cho PHP 8.1.10 thì bỏ qua 2 bước đầu tiên</b><br>
      - Tải PHP 8.1.10 phiên bản non threaded và composer <br>
      - Cài đặt composer và chọn PHP phiên bản vừa tải về và tiến hành cài đặt <br>
      <b> (Khuyến khích nên sử dụng laragon để thuận tiện trong việc cài đặt và sử dụng Laravel) </b> <br>
      - Mở <b>cmd</b> hoặc <b>git bash</b> tại thư mục clone repository và chạy: <b>cd api\SunnyFlowerShop</b> để chuyển hướng sang thư mục api <br>
      - Chạy: <b>composer install</b> để cài đặt các phần còn thiếu của framework <br>
      - Tạo: file <b>.env</b> bằng cách copy file <b>.env.example</b> và sửa tên lại <br>
      - Chạy: <b>php artisan key:generate</b> để tạo APP_KEY trong file <b>.env</b> <br>
      - Thay đổi <b>DB_DATABASE</b> thành <b>SunnyFlowerShop</b> <br>
      - Chạy: <b>php artisan migrate</b> hoặc <b>php artisan migrate --seed</b> để tạo dữ liệu seed kèm theo database <br>
      - Nếu trong quá trình chạy migrate gặp vấn đề mà muốn refresh lại thì chỉ cần thêm <b>:refresh</b> hoặc <b>:fresh</b> ở phía sau <b>....migrate...</b> là được.<br>
      - Về phần ảnh ở local (được lưu trong storage) thì cần phải chạy thêm lệnh <b>php artisan storage:link</b> để tạo <b>shortcut</b> trong thư mục public.<br>
      (Sẽ xóa trong tương lai) Hiện tại chưa có hỉnh mẫu để làm avatar mặc định (Admin/ Customer/ Product) nên cần phải tự tạo riêng file default mỗi khi pull code về local: <br>
      + Product: tạo hình default với tên và đuôi file là <b>"product_default.png"</b> và lưu trong đường dẫn <b>"storage/app/public/products"</b><br>
      + Customer: tạo hình default với tên và đuôi file là <b>"customer_default.jpg"</b> và lưu trong đường dẫn <b>"storage/app/public/avatars"</b><br>
      + Admin: tạo hình default với tên và đuôi file là <b>"admin_default.png"</b> và lưu trong đường dẫn <b>"storage/app/public/avatars"</b><br>
      - Về vấn đề đuôi file ảnh sẽ thay đổi trong tương lai, hiện tại vẫn còn đang trong quá trình thử nghiệm
