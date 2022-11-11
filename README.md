<h1>BACKEND</h1> <br>
<h3>** Đây là phiên bản Laravel 9 **</h3> <br>
<b>Đối với Laravel thì cần thực hiện những việc sau trước khi chạy dự án:</b><br>
<b>CHÚ Ý: Nếu đã cài đặt composer cho PHP 8.1.10 thì bỏ qua 2 bước đầu tiên</b><br>
      - Tải PHP 8.1.10 phiên bản non threaded và composer <br>
      - Cài đặt composer và chọn PHP phiên bản vừa tải về và tiến hành cài đặt <br>
      <b> (Khuyến khích nên sử dụng laragon để thuận tiện trong việc cài đặt và sử dụng Laravel) </b> <br>
      - Mở <b>cmd</b> hoặc <b>git bash</b> tại thư mục clone repository và chạy: <b>cd api\NPCamera</b> để chuyển hướng sang thư mục api <br>
      - Chạy: <b>composer install</b> để cài đặt các phần còn thiếu của framework <br>
      - Tạo: file <b>.env</b> bằng cách copy file <b>.env.example</b> và sửa tên lại <br>
      - Chạy: <b>php artisan key:generate</b> để tạo APP_KEY trong file <b>.env</b> <br>
      - Thay đổi <b>DB_DATABASE</b> thành <b>NPCamera</b> <br>
      - Chạy: <b>php artisan migrate</b> hoặc <b>php artisan migrate --seed</b> để tạo dữ liệu seed kèm theo database <br>
      - Nếu trong quá trình chạy migrate gặp vấn đề mà muốn refresh lại thì chỉ cần thêm <b>:refresh</b> hoặc <b>:fresh</b> ở phía sau <b>....migrate...</b> là được.<br>