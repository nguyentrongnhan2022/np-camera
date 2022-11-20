<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // $table->foreign("customer_id")->references("id")->on("customers");
            $table->integer("customer_id"); // foreign key of id in customers table
            $table->foreignId("voucher_id")->nullable(); // NULL only happen when customer don't use voucher
            $table->string("id_delivery");
            $table->dateTime("date_order");
            $table->string("address");
            $table->string("name_receiver");
            $table->string("phone_receiver");
            $table->unsignedBigInteger("total_price")->unsigned();
            $table->unsignedTinyInteger("status")->default(0)->comment("OrderStatusEnum");
            $table->boolean("paid_type")->comment("0 for Cash Settlemen; 1 for Online Cash; 2 for QR Online Cash (through phone)");
            $table->boolean("deleted_by")->nullable()->comment("This one has 3 status: 1 for deleted by admin: 0 for customer and NULL for not delete");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
