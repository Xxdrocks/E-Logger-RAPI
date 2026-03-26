<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         Schema::create('points', function (Blueprint $table) {
            $table->id();
            $table->string('ncs')->unique();
            $table->string('nama')->nullable();
            $table->integer('points')->default(0);
            $table->timestamps();
            $table->index('points');
            $table->index('ncs');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('points');
    }
};
