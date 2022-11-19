<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Customer extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        "first_name",
        "last_name",
        "email",
        "password",
        "avatar",
    ];

    public function addresses() {
        return $this->hasMany(Address::class);
    }

    public function tokens() {
        return $this->hasMany(Token::class);
    }

    public function orders() {
        return $this->hasMany(Order::class);
    }
    
    public function customer_product_feedback() {
        return $this->belongsToMany(Product::class, "customer_product_feedback", "customer_id", "product_id")->withPivot("id","quality", "comment");
    }

    public function customer_product_favorite() {
        return $this->belongsToMany(Product::class, "customer_product_favorite", "customer_id", "product_id");
    }

    public function customer_product_cart() {
        return $this->belongsToMany(Product::class, "customer_product_cart", "customer_id", "product_id")->withPivot("quantity");
    }
}
